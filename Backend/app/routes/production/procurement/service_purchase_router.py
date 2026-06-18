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
from app.models.inventory.InventoryStock_model import Stock, StockHistory
from app.models.production.procurement.Purchase_model import Purchase,Purchase_item
from app.models.relationship.supplier_model import Supplier
from app.schemas.production.procurement.ForeignPurchase_schema import ForeignPurchaseInsertSchema,ItemDetailsModel
from app.schemas.production.procurement.ServicePurchase_schema import ServicePurchaseInsertSchema, ServicePurchaseFetch
from app.models.general_settings.hs_code_model import Hscode
from app.models.inventory.item_model import Item, ItemSuggest

Service_purchase_router = APIRouter()



#foreing purchase ITem Search function
async def service_suggestitm(year: int, db:Session=Depends(get_db)):
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
@Service_purchase_router.post("/pcplus/api/service_purchase/get_service_item_suggestions", response_model=List[ItemSuggest])
async def suggest_items(request: Request,db:Session=Depends(get_db)):
    request_body = await request.body()
    decoded_string = request_body.decode()
    parts = decoded_string.split("/")
    
    if len(parts) > 1:
        year = parts[0]
        part2 = parts[1]
        items = await service_suggestitm(year = year, db = db)
        searchTerm = part2.lower()
        if searchTerm:
            data= [item for item in items if 'item_name' in item and searchTerm in item['item_name'].lower()]
            return data

        else:
            return []
    else:
        return []


@Service_purchase_router.get("/pcplus/api/service_purchase/get_service_item_details/{item_id}", response_model=ItemDetailsModel, dependencies=[Depends(get_current_active_user)])
async def get_item_details_by_id(item_id: int, db: Session = Depends(get_db)):
    try:
        print(item_id)
        item = db.query(Item.id, Item.item_name, Item.hs_code_id, Item.hs_code, Hscode.sd, Hscode.vat, Hscode.cd, Hscode.ait, Hscode.rd, Hscode.at, Hscode.tti)\
            .join(Hscode, Item.hs_code_id == Hscode.id).filter(Item.id == item_id).first()
        
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")


        item_details = {
            "id": item.id, 
            "item_name": item.item_name, 
            "hs_code_id": item.hs_code_id,
            "hs_code": item.hs_code,
            "sd": item.sd,
            "vat": item.vat,
            "cd": item.cd,
            "ait": item.ait,
            "rd": item.rd,
            "at": item.at,
            "tti": item.tti
        }

        return item_details
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error: {e}")



# @Service_purchase_router.post("/pcplus/api/service_purchase/add-service-purchase", dependencies=[Depends(get_current_active_user)])
# async def create_service_purchase(Spurchase: ServicePurchaseInsertSchema, db: Session = Depends(get_db)):
#     try:
#         last_purchase = db.query(Purchase).order_by(desc(Purchase.id)).first()
#         next_id = 1 if last_purchase is None else last_purchase.id + 1
#         PurchaseInv = (
#             "LOC-" +
#             datetime.now().strftime('%Y%m%d') +
#             '-' +
#             f"{next_id:04d}"
#         )
#         srvp = Purchase(
#             invoice_no= PurchaseInv,
#             vendor_inv=Spurchase.chalan_number,
#             supplier_id=Spurchase.supplier_id,
#             purchase_type=Spurchase.purchase_type,
#             purchase_category=Spurchase.purchase_category,
#             grand_total=Spurchase.grand_total,
#             total_tax=Spurchase.total_tax,
#             total_sd=Spurchase.total_sd,
#             fiscal_year=Spurchase.fiscal_year,
#             notes=Spurchase.notes,
#             user_id='1',
#             chalan_date=Spurchase.chalan_date,
#             entry_date=Spurchase.entry_date
#             )
#         db.add(srvp)
#         db.flush()  # Get the srv.id before committing
#         for item in Spurchase.items:
#             purchase_item = Purchase_item(
#                 item_id = item.item_id,
#                 purchase_id = srvp.id,
#                 hs_code = item.hs_code,
#                 hs_code_id = item.hs_code_id,
#                 qty = item.qty,
#                 rate = item.rate,
#                 access_amount = item.access_amount,
#                 item_sd = item.item_sd,
#                 sd_amount = item.sd_amount,
#                 vatable_value = item.vatable_value,
#                 vat_type = item.vat_type,
#                 vat_rate = item.vat_rate,
#                 vat_amount = item.vat_amount,
#                 vds = item.vds,
#                 rebate = item.rebate,
#                 item_total = item.item_total,
#                 purchase_date = srvp.entry_date
#                 )
#             db.add(purchase_item)

#         #    Stock Manage 
#             item_stock = db.query(Stock).filter(Stock.item_id == item.item_id).first()
#             if item_stock is not None:
#                 # Update the existing stock entry
#                 item_stock.qty = float(item_stock.qty or 0) + float(item.qty)
#                 item_stock.rate = item.rate

#                 stock_history = StockHistory(
#                     item_id = item.item_id,
#                     action_tbl= 'purchase',
#                     action_tbl_id = srvp.id,
#                     action_type='increment',
#                     previous_stock = item_stock.qty,
#                     qty = item.qty,
#                     status = 1
#                 )
#                 db.add(stock_history)
#             else:
#                 # Insert a new stock entry
#                 stock = Stock(
#                     item_id = item.item_id,
#                     qty = item.qty,
#                     rate = item.rate,
#                     status = 1
#                     )
#                 db.add(stock)

#                 stock_history = StockHistory(
#                     item_id = item.item_id,
#                     action_tbl= 'purchase',
#                     action_tbl_id = srvp.id,
#                     action_type='increment',
#                     previous_stock = 0,
#                     qty = item.qty,
#                     status = 1
#                 )
#                 db.add(stock_history)

#         db.commit()
#         return {"Message": "Successfully Added"}

#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=400, detail=f"Error occurred: {e}")
#     finally:
#         db.close()


@Service_purchase_router.post(
    "/pcplus/api/service_purchase/add-service-purchase",
    dependencies=[Depends(get_current_active_user)]
)
async def create_service_purchase(
    Spurchase: ServicePurchaseInsertSchema,
    db: Session = Depends(get_db)
):

    try:
        # 1. Generate Invoice No

        last_purchase = db.query(Purchase).order_by(desc(Purchase.id)).first()
        next_id = 1 if last_purchase is None else last_purchase.id + 1

        PurchaseInv = (
            "LOC-" +
            datetime.now().strftime('%Y%m%d') +
            '-' +
            f"{next_id:04d}"
        )

        # 2. Create Purchase Master
        srvp = Purchase(
            invoice_no=PurchaseInv,
            vendor_inv=Spurchase.chalan_number,
            supplier_id=Spurchase.supplier_id,
            purchase_type=Spurchase.purchase_type,
            purchase_category=Spurchase.purchase_category,
            grand_total=Spurchase.grand_total,
            total_tax=Spurchase.total_tax,
            total_sd=Spurchase.total_sd,
            fiscal_year=Spurchase.fiscal_year,
            notes=Spurchase.notes,
            user_id=1,
            chalan_date=Spurchase.chalan_date,
            entry_date=Spurchase.entry_date
        )

        db.add(srvp)
        db.flush()  

        # 3. Insert Items + Stock Update
        for item in Spurchase.items:

            purchase_item = Purchase_item(
                item_id=item.item_id,
                purchase_id=srvp.id,
                hs_code=item.hs_code,
                hs_code_id=item.hs_code_id,
                qty=item.qty,
                rate=item.rate,
                access_amount=item.access_amount,
                item_sd=item.item_sd,
                sd_amount=item.sd_amount,
                vatable_value=item.vatable_value,
                vat_type=item.vat_type,
                vat_rate=item.vat_rate,
                vat_amount=item.vat_amount,
                vds=item.vds,
                rebate=item.rebate,
                item_total=item.item_total,
                purchase_date=srvp.entry_date
            )
            db.add(purchase_item)

            # Stock Handling

            item_stock = db.query(Stock).filter(
                Stock.item_id == item.item_id
            ).first()

            if item_stock:
                previous_stock = float(item_stock.qty or 0)

                item_stock.qty = previous_stock + float(item.qty)
                item_stock.rate = item.rate

                db.add(StockHistory(
                    item_id=item.item_id,
                    action_tbl='purchase',
                    action_tbl_id=srvp.id,
                    action_type='increment',
                    previous_stock=previous_stock,
                    qty=item.qty,
                    status=1
                ))

            else:
                db.add(Stock(
                    item_id=item.item_id,
                    qty=item.qty,
                    rate=item.rate,
                    status=1
                ))

                db.add(StockHistory(
                    item_id=item.item_id,
                    action_tbl='purchase',
                    action_tbl_id=srvp.id,
                    action_type='increment',
                    previous_stock=0,
                    qty=item.qty,
                    status=1
                ))

        # 4. Inventory Transaction

        db.add(InventoryTransaction(
            transaction_date=srvp.entry_date,
            transaction_type="Purchase",
            transaction_by="Company",
            transaction_to=str(Spurchase.supplier_id),
            transaction_invoice=PurchaseInv,
            amount_in=Spurchase.grand_total,
            amount_out=Spurchase.grand_total,
            cost=Spurchase.grand_total,
            due_amount=0,
            return_amount=0,
            transaction_notes=Spurchase.notes,
            created_by=1
        ))

        # 5. Balance Update
        last_balance = db.query(Balance).order_by(desc(Balance.id)).first()

        previous_balance = (
            last_balance.current_balance
            if last_balance and last_balance.current_balance
            else 0
        )

        db.add(Balance(
            previous_balance=previous_balance,
            current_balance=previous_balance + Spurchase.grand_total,
            current_due=getattr(Spurchase, "due_amount", 0),
            status=1,
            user_id=Spurchase.supplier_id
        ))

        # 6. Commit Transaction

        db.commit()

        return {
            "success": True,
            "message": "Purchase created successfully",
            "purchase_id": srvp.id,
            "invoice_no": PurchaseInv
        }

    except Exception as e:
        # ROLLBACK EVERYTHING
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=f"Transaction failed: {str(e)}"
        )

    finally:
        db.close()


@Service_purchase_router.get("/pcplus/api/service_purchase/all_service_purchase",response_model=List[ServicePurchaseFetch], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):

    x=db.query(Purchase, Supplier).join(Supplier, Purchase.supplier_id==Supplier.id).filter(Purchase.purchase_type==3)\
        .add_columns(Purchase.id,Supplier.supplier_name,Purchase.invoice_no,Purchase.vendor_inv,Purchase.chalan_date,Purchase.grand_total).all()
    #print(x)
    p_item =[]
    for pp in x:
        p_item.append({
           'id': pp.id,
           'invoice_no': pp.invoice_no,
           'vendor_inv': pp.vendor_inv,
           'chalan_date': pp.chalan_date,
           'supplier_name': pp.supplier_name,
           'grand_total': pp.grand_total,
           })

    junit = jsonable_encoder(p_item)
    return JSONResponse(content=junit)