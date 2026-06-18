from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os
from sqlalchemy import desc
from datetime import datetime
from sqlalchemy.sql.sqltypes import Numeric
from app.models.accounts.Transaction_model import Transaction
from app.models.accounts.Balance_model import Balance
from app.schemas.accounts.Transaction_schema import TransactionInsertSchema, TransactionUpdateSchema, TransactionFetchSchema, TransactionResponseSchema
from app.schemas.accounts.Balance_schema import BalanceCreate, BalanceUpdate, BalanceResponse
from app.models.inventory.InventoryStock_model import Stock, StockHistory
from app.models.production.procurement.Purchase_model import Purchase,Purchase_item
from app.models.relationship.supplier_model import Supplier
from app.schemas.production.procurement.ForeignPurchase_schema import ForeignPurchaseInsertSchema,ItemDetailsModel
from app.schemas.production.procurement.ServicePurchase_schema import ServicePurchaseInsertSchema, ServicePurchaseFetch
from app.models.general_settings.hs_code_model import Hscode
from app.models.inventory.item_model import Item, ItemSuggest

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


# @Transaction_router.post("/pcplus/api/transaction/add-transaction",dependencies=[Depends(get_current_active_user)])
# async def create_transaction(
#     TransactionSchema: TransactionInsertSchema,
#     db: Session = Depends(get_db)
# ):

#     try:
#         # 1. Generate Invoice No

#         last_transaction = db.query(Transaction).order_by(desc(Transaction.id)).first()
#         next_id = 1 if last_transaction is None else last_transaction.id + 1

#         TransactionInv = (
#             "TRN-" +
#             datetime.now().strftime('%Y%m%d') +
#             '-' +
#             f"{next_id:04d}"
#         )

#         # 2. Transaction
#         transaction=Transaction(
#             transaction_date=TransactionSchema.transaction_date,
#             transaction_type=TransactionSchema.transaction_type,
#             transaction_by=TransactionSchema.transaction_by,
#             transaction_to=TransactionSchema.transaction_to,
#             transaction_invoice=TransactionInv,
#             amount_in=TransactionSchema.amount_in,
#             amount_out=TransactionSchema.amount_out,
#             cost=TransactionSchema.cost,
#             due_amount=TransactionSchema.due_amount,
#             return_amount=TransactionSchema.return_amount,
#             transaction_notes=TransactionSchema.transaction_notes,
#             created_by=TransactionSchema.created_by
#         )
#         db.add(transaction)
#         db.flush() 

#         # 3. Balance Update
#         last_cost = db.query(Balance).order_by(desc(Balance.id)).first()

#         pre_cost = last_cost.current_cost if last_cost and last_cost.current_cost is not None else 0
#         pre_due = last_cost.current_due if last_cost and last_cost.current_due is not None else 0
#         pre_balance = last_cost.current_balance if last_cost and last_cost.current_balance is not None else 0

#         cost = TransactionSchema.cost or 0
#         due_amount = TransactionSchema.due_amount or 0

#         db.add(Balance(
#             previous_cost=pre_cost,
#             current_cost=pre_cost + cost,
#             previous_due=pre_due,
#             current_due=pre_due + due_amount,
#             previous_balance=pre_balance,
#             current_balance=pre_balance - cost,
#             status=1,
#             created_by=TransactionSchema.created_by
#         ))

#         # 4. Commit Transaction

#         db.commit()

#         return {
#             "success": True,
#             "message": "Transaction created successfully",
#             "transaction_id": transaction.id,
#             "invoice_no": TransactionInv
#         }

#     except Exception as e:
#         # ROLLBACK EVERYTHING
#         db.rollback()

#         raise HTTPException(
#             status_code=400,
#             detail=f"Transaction failed: {str(e)}"
#         )

#     finally:
#         db.close()

from typing import List

@Transaction_router.post("/pcplus/api/transaction/add-multiple-transaction", dependencies=[Depends(get_current_active_user)])
async def create_multiple_transaction(
    transactions: List[TransactionInsertSchema],
    db: Session = Depends(get_db)
):
    try:
        last_transaction = db.query(Transaction).order_by(desc(Transaction.id)).first()
        next_id = 1 if last_transaction is None else last_transaction.id + 1

        TransactionInv = (
            "TRN-" +
            datetime.now().strftime('%Y%m%d') +
            '-' +
            f"{next_id:04d}"
        )

        last_balance = db.query(Balance).order_by(desc(Balance.id)).first()

        pre_cost = last_balance.current_cost if last_balance and last_balance.current_cost is not None else 0
        pre_due = last_balance.current_due if last_balance and last_balance.current_due is not None else 0
        pre_balance = last_balance.current_balance if last_balance and last_balance.current_balance is not None else 0

        total_cost = 0
        total_due = 0

        for item in transactions:
            cost = item.cost or 0
            due_amount = item.due_amount or 0

            total_cost += cost
            total_due += due_amount

            transaction = Transaction(
                transaction_date=item.transaction_date,
                transaction_type=item.transaction_type,
                transaction_by=item.transaction_by,
                transaction_to=item.transaction_to,
                transaction_invoice=TransactionInv,
                amount_in=item.amount_in,
                amount_out=item.amount_out,
                cost=item.cost,
                due_amount=item.due_amount,
                return_amount=item.return_amount,
                transaction_notes=item.transaction_notes,
                created_by=item.created_by
            )

            db.add(transaction)

        db.add(Balance(
            previous_cost=pre_cost,
            current_cost=pre_cost + total_cost,
            previous_due=pre_due,
            current_due=pre_due + total_due,
            previous_balance=pre_balance,
            current_balance=pre_balance - total_cost,
            status=1,
            created_by=transactions[0].created_by if transactions else None
        ))

        db.commit()

        return {
            "success": True,
            "message": "Transactions created successfully",
            "invoice_no": TransactionInv
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