from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os
from sqlalchemy import desc, extract, func
from datetime import datetime, date, timedelta
from sqlalchemy.sql.sqltypes import Numeric
from app.models.accounts.Transaction_model import Transaction
from app.models.accounts.Balance_model import Balance
from app.models.user_model import User
from app.schemas.accounts.Transaction_schema import TransactionInsertSchema, TransactionUpdateSchema, TransactionFetchSchema, TransactionResponseSchema
from app.schemas.accounts.Balance_schema import BalanceCreate, BalanceUpdate, BalanceResponse
from app.models.inventory.InventoryStock_model import Stock, StockHistory
from app.models.production.procurement.Purchase_model import Purchase,Purchase_item
from app.models.relationship.supplier_model import Supplier
from app.schemas.production.procurement.ForeignPurchase_schema import ForeignPurchaseInsertSchema,ItemDetailsModel
from app.schemas.production.procurement.ServicePurchase_schema import ServicePurchaseInsertSchema, ServicePurchaseFetch
from app.models.general_settings.hs_code_model import Hscode
from app.models.inventory.item_model import Item, ItemSuggest
from sqlalchemy import func

Transaction_router = APIRouter()



#foreing purchase ITem Search function
async def transaction_suggestitm(year: int, db:Session=Depends(get_db)):
    result = db.query(Item,Hscode).join(Hscode, Item.hs_code_id==Hscode.id)\
            .filter(Hscode.schedule == "service", Hscode.calculate_year == year)\
            .add_columns(Item.id, Item.item_name, Item.hs_code, Item.calculate_year).all()
            
    items = []
    for y in result:
        items.append({
            'id' : y.id,
            'item_name': y.item_name,
            'hs_code': y.hs_code,
            'calculate_year': y.calculate_year,
        })

    json_items = jsonable_encoder(items)
    return json_items

#foreing purchase ITem Search query
@Transaction_router.post("/pcplus/api/transaction/get_transction_item_suggestions", response_model=List[ItemSuggest])
async def suggest_items(request: Request,db:Session=Depends(get_db)):
    request_body = await request.body()
    decoded_string = request_body.decode()
    parts = decoded_string.split("/")
    
    if len(parts) > 1:
        year = parts[0]
        part2 = parts[1]
        items = await transaction_suggestitm(year = year, db = db)
        searchTerm = part2.lower()
        if searchTerm:
            data= [item for item in items if 'item_name' in item and searchTerm in item['item_name'].lower()]
            return data

        else:
            return []
    else:
        return []


@Transaction_router.get("/pcplus/api/transaction/get_transction_details/{t_id}", response_model=TransactionResponseSchema, dependencies=[Depends(get_current_active_user)])
async def get_transaction_details_by_id(t_id: int, db: Session = Depends(get_db)):
    try:
        print(t_id)
        get_transaction = db.query(Transaction).filter(Transaction.id == t_id).first()
        if not get_transaction:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
        return get_transaction
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


from typing import List

@Transaction_router.post("/pcplus/api/transaction/add-multiple-transaction", dependencies=[Depends(get_current_active_user)])
async def create_multiple_transaction(
    transactions: List[TransactionInsertSchema],
    db: Session = Depends(get_db)
):
    try:
        if not transactions:
            raise HTTPException(status_code=400, detail="No transaction found")

        last_transaction = db.query(Transaction).order_by(desc(Transaction.id)).first()
        next_id = 1 if last_transaction is None else last_transaction.id + 1

        TransactionInv = (
            "TRN-" +
            datetime.now().strftime('%Y%m%d') +
            '-' +
            f"{next_id:04d}"
        )

        creator = db.query(User).filter(
            User.user_email == transactions[0].created_by
        ).first()

        if not creator:
            raise HTTPException(status_code=404, detail="Creator user not found")

        last_balance = db.query(Balance).order_by(desc(Balance.id)).first()

        pre_cost = last_balance.current_cost if last_balance and last_balance.current_cost is not None else 0
        pre_due = last_balance.current_due if last_balance and last_balance.current_due is not None else 0
        pre_balance = last_balance.current_balance if last_balance and last_balance.current_balance is not None else 0

        total_amount_in = 0
        total_amount_out = 0
        total_cost = 0
        total_due = 0
        total_return = 0

        for item in transactions:
            amount_in = item.amount_in or 0
            amount_out = item.amount_out or 0
            cost = item.cost or 0
            due_amount = item.due_amount or 0
            return_amount = item.return_amount or 0

            total_amount_in += amount_in
            total_amount_out += amount_out
            total_cost += cost
            total_due += due_amount
            total_return += return_amount

            transaction = Transaction(
                transaction_date=item.transaction_date,
                transaction_type=item.transaction_type,
                transaction_by=item.transaction_by,
                transaction_to=item.transaction_to,
                transaction_invoice=TransactionInv,
                amount_in=amount_in,
                amount_out=amount_out,
                cost=cost,
                due_amount=due_amount,
                return_amount=return_amount,
                transaction_notes=item.transaction_notes,
                created_by=creator.id
            )

            db.add(transaction)

        new_balance = (
            pre_balance
            + total_amount_in
            + total_return
            - total_amount_out
        )

        db.add(Balance(
            previous_cost=pre_cost,
            current_cost=pre_cost + total_cost,
            previous_due=pre_due,
            current_due=pre_due + total_due,
            previous_balance=pre_balance,
            current_balance=new_balance,
            status=1,
            created_by=creator.id
        ))

        db.commit()

        return {
            "success": True,
            "message": "Transactions created successfully",
            "invoice_no": TransactionInv,
            "previous_balance": pre_balance,
            "current_balance": new_balance,
            "total_amount_in": total_amount_in,
            "total_amount_out": total_amount_out,
            "total_cost": total_cost,
            "total_due": total_due,
            "total_return": total_return
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Transaction failed: {str(e)}"
        )

@Transaction_router.get("/pcplus/api/transaction/all_transaction",response_model=List[TransactionFetchSchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):

    x=db.query(Transaction).all()
    #print(x)
    p_item =[]
    for t in x:
        p_item.append({
           'id': t.id,
           'transaction_invoice': t.transaction_invoice,
           'transaction_type': t.transaction_type,
           'transaction_date': t.transaction_date,
           'cost': t.cost,
           'transaction_by': t.transaction_by,
           })

    junit = jsonable_encoder(p_item)
    return JSONResponse(content=junit)


@Transaction_router.get("/pcplus/api/transaction/transaction_invoice/{id}", dependencies=[Depends(get_current_active_user)])
async def transaction_invoice(id: int, db: Session = Depends(get_db)):
    first_transaction = db.query(Transaction).filter(Transaction.id == id).first()

    if not first_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    invoice_no = first_transaction.transaction_invoice

    creator = (db.query(User).filter(User.id == first_transaction.created_by)
                .first()
              )

    transactions = db.query(Transaction).filter(
        Transaction.transaction_invoice == invoice_no
    ).all()

    items = []
    total_amount_in = 0
    total_amount_out = 0
    total_cost = 0
    total_due = 0
    total_return = 0

    for t in transactions:
        total_amount_in += t.amount_in or 0
        total_amount_out += t.amount_out or 0
        total_cost += t.cost or 0
        total_due += t.due_amount or 0
        total_return += t.return_amount or 0

        items.append({
            "id": t.id,
            "transaction_date": t.transaction_date,
            "transaction_type": t.transaction_type,
            "transaction_by": t.transaction_by,
            "transaction_to": t.transaction_to,
            "amount_in": t.amount_in,
            "amount_out": t.amount_out,
            "cost": t.cost,
            "due_amount": t.due_amount,
            "return_amount": t.return_amount,
            "transaction_notes": t.transaction_notes,
        })

    return jsonable_encoder({
        "invoice_no": invoice_no,
        "invoice_date": first_transaction.transaction_date,
        "created_by": creator.user_name,
        "total_amount_in": total_amount_in,
        "total_amount_out": total_amount_out,
        "total_cost": total_cost,
        "total_due": total_due,
        "total_return": total_return,
        "items": items,
    })





@Transaction_router.get("/pcplus/api/accounts/investor-contribution", dependencies=[Depends(get_current_active_user)])
async def investor_contribution(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Transaction.transaction_by.label("investor_name"),
            func.sum(Transaction.amount_in).label("total_amount_in"),
            func.count(Transaction.id).label("total_transaction")
        )
        .filter(Transaction.amount_in > 0)
        .filter(Transaction.transaction_type == "Office_Investment")
        .filter(Transaction.transaction_type != "Service_Sales")
        .group_by(Transaction.transaction_by)
        .all()
    )

    data = []
    for r in rows:
        data.append({
            "investor_name": r.investor_name,
            "total_amount_in": r.total_amount_in or 0,
            "total_transaction": r.total_transaction
        })

    return jsonable_encoder(data)




@Transaction_router.get("/pcplus/api/accounts/investor-contribution/{investor_name}", dependencies=[Depends(get_current_active_user)])
async def investor_contribution_details(investor_name: str, db: Session = Depends(get_db)):
    rows = (
        db.query(Transaction)
        .filter(Transaction.transaction_by == investor_name)
        .filter(Transaction.amount_in > 0)
        .order_by(desc(Transaction.id))
        .all()
    )

    data = []
    for t in rows:
        data.append({
            "id": t.id,
            "transaction_date": t.transaction_date,
            "transaction_type": t.transaction_type,
            "transaction_by": t.transaction_by,
            "transaction_to": t.transaction_to,
            "transaction_invoice": t.transaction_invoice,
            "amount_in": t.amount_in,
            "amount_out": t.amount_out,
            "cost": t.cost,
            "due_amount": t.due_amount,
            "return_amount": t.return_amount,
            "transaction_notes": t.transaction_notes,
            "created_at": t.created_at,
            "created_by": t.created_by,
            "updated_at": t.updated_at,
            "updated_by": t.updated_by,
        })

    return jsonable_encoder(data)


@Transaction_router.get("/pcplus/api/accounts/latest-balance", dependencies=[Depends(get_current_active_user)])
async def latest_balance(db: Session = Depends(get_db)):
    balance = db.query(Balance).order_by(desc(Balance.id)).first()

    if not balance:
        return {
            "previous_cost": 0,
            "current_cost": 0,
            "previous_due": 0,
            "current_due": 0,
            "previous_balance": 0,
            "current_balance": 0,
        }

    return jsonable_encoder(balance)



@Transaction_router.get(
    "/pcplus/api/accounts/monthly-chart",
    dependencies=[Depends(get_current_active_user)]
)
async def monthly_chart(db: Session = Depends(get_db)):

    investment_rows = (
        db.query(
            extract("month", Transaction.transaction_date).label("month"),
            func.sum(Transaction.amount_in).label("amount_in"),
            func.sum(Transaction.return_amount).label("return_amount"),
        )
        .filter(Transaction.transaction_type == "Office_Investment")
        .group_by(extract("month", Transaction.transaction_date))
        .all()
    )

    income_rows = (
        db.query(
            extract("month", Transaction.transaction_date).label("month"),
            func.sum(Transaction.amount_in).label("amount_in"),
            func.sum(Transaction.return_amount).label("return_amount"),
        )
        .filter(Transaction.transaction_type == "Service_Sales")
        .group_by(extract("month", Transaction.transaction_date))
        .all()
    )

    expense_rows = (
        db.query(
            extract("month", Transaction.transaction_date).label("month"),
            func.sum(Transaction.amount_out).label("amount_out"),
        )
        .group_by(extract("month", Transaction.transaction_date))
        .all()
    )

    officeInvestment = [0] * 12
    income = [0] * 12
    expenses = [0] * 12
    profit = [0] * 12

    # Office Investment
    for row in investment_rows:
        idx = int(row.month) - 1

        officeInvestment[idx] = round(
            float(row.amount_in or 0)
            + float(row.return_amount or 0),
            2
        )

    # Service Sales Income
    for row in income_rows:
        idx = int(row.month) - 1

        total_income = (
            float(row.amount_in or 0)
            + float(row.return_amount or 0)
        )

        income[idx] = round(total_income, 2)

        # Profit = Income
        profit[idx] = round(total_income, 2)

    # Expenses
    for row in expense_rows:
        idx = int(row.month) - 1

        expenses[idx] = round(
            float(row.amount_out or 0),
            2
        )

    return {
        "office_investment": officeInvestment,
        "income": income,
        "expenses": expenses,
        "profit": profit,
    }



@Transaction_router.get("/pcplus/api/accounts/cost-pie-chart",
    dependencies=[Depends(get_current_active_user)]
)
async def cost_pie_chart(db: Session = Depends(get_db)):
    today = date.today()

    start_this_week = today - timedelta(days=today.weekday())

    start_this_month = today.replace(day=1)

    last_month_end = start_this_month - timedelta(days=1)
    last_month_start = last_month_end.replace(day=1)

    today_cost = db.query(func.sum(Transaction.amount_out)).filter(
        Transaction.transaction_date == today
    ).scalar() or 0

    this_week = db.query(func.sum(Transaction.amount_out)).filter(
        Transaction.transaction_date >= start_this_week,
        Transaction.transaction_date <= today
    ).scalar() or 0

    this_month = db.query(func.sum(Transaction.amount_out)).filter(
        Transaction.transaction_date >= start_this_month,
        Transaction.transaction_date <= today
    ).scalar() or 0

    last_month = db.query(func.sum(Transaction.amount_out)).filter(
        Transaction.transaction_date >= last_month_start,
        Transaction.transaction_date <= last_month_end
    ).scalar() or 0

    return {
        "series": [
            round(float(today_cost), 2),
            round(float(this_week), 2),
            round(float(this_month), 2),
            round(float(last_month), 2),
        ],
        "labels": ["Today", "This Week", "This Month", "Last Month"]
    }