# from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
# from typing import Union,List,Optional
# from sqlalchemy.orm import Session
# from app.db.database import get_db
# from app.routes.auth_router import get_current_active_user;
# from fastapi.responses import JSONResponse
# from fastapi.encoders import jsonable_encoder
# from pathlib import *
# import os
# from sqlalchemy.sql.sqltypes import Numeric
# from app.models.inventory.opening_stock_model import OpeningStock, OpeningInsertSchema , OpeningStockSchema
# from app.models.relationship.supplier_model import Supplier, supplierBase, SupplierSchema
# from app.models.production.procurement.Purchase_model import Purchase,Purchase_item
# from app.schemas.production.procurement.ForeignPurchase_schema import ForeignPurchaseInsertSchema,ItemDetailsModel, ForeignPurchaseFetch
# from app.models.general_settings.hs_code_model import Hscode
# from app.models.inventory.item_model import Item, ItemSuggest

# Foreign_purchase_router = APIRouter()

# @Foreign_purchase_router.post("/pcplus/api/purchase/add-foreign-purchase", dependencies=[Depends(get_current_active_user)])
# async def create_foreign_purchase(fpurchase: ForeignPurchaseInsertSchema, db: Session = Depends(get_db)):
#     try:
#         srv = Purchase(
#             invoice_no=fpurchase.invoice_no,
#             vendor_inv=fpurchase.vendor_inv,
#             supplier_id=fpurchase.supplier_id,
#             purchase_type=fpurchase.purchase_type,
#             purchase_category=fpurchase.purchase_category,
#             lc_number=fpurchase.lc_number,
#             custom_house_id=fpurchase.custom_house_id,
#             country_origin=fpurchase.country_origin,
#             data_source=fpurchase.data_source,
#             cpc_code_id=fpurchase.cpc_code_id,
#             grand_total=fpurchase.grand_total,
#             total_tax=fpurchase.total_tax,
#             total_at=fpurchase.total_at,
#             fiscal_year=fpurchase.fiscal_year,
#             notes=fpurchase.notes,
#             user_id=fpurchase.user_id,
#             lc_date=fpurchase.lc_date,
#             chalan_date=fpurchase.chalan_date,
#             entry_date=fpurchase.entry_date
#             )
#         db.add(srv)
#         db.flush()  # Get the srv.id before committing

#         for item in fpurchase.items:
#             purchase_item = Purchase_item(
#                 item_id = item.item_id,
#                 hs_code = item.hs_code,
#                 hs_code_id = item.hs_code_id,
#                 purchase_id = srv.id,
#                 qty = item.qty,
#                 rate = item.rate,
#                 access_amount = item.access_amount,
#                 item_cd = item.item_cd,
#                 cd_amount = item.cd_amount,
#                 item_sd = item.item_sd,
#                 sd_amount = item.sd_amount,
#                 item_at = item.item_at,
#                 at_amount = item.at_amount,
#                 item_rd = item.item_rd,
#                 rd_amount = item.rd_amount,
#                 vat_rate = item.vat_rate,
#                 vat_type = item.vat_type,
#                 vatable_value = item.vatable_value,
#                 rebate = item.rebate,
#                 t_amount = item.item_total,
#                 purchase_date = srv.entry_date,
#                 entry_date = srv.entry_date,
#                 p_date = srv.entry_date
#                 )
#             db.add(purchase_item)
#         db.commit()
#         return {"Message": "Successfully Added"}

#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=400, detail=f"Error occurred: {e}")
#     finally:
#         db.close()









# #foreing purchase ITem Search function
# async def all_suggestitm(year: int, db:Session=Depends(get_db)):
#     result = db.query(Item,Hscode).join(Hscode, Item.hs_code_id==Hscode.id)\
#             .filter(Item.stock_status == 1, Hscode.calculate_year == year)\
#             .add_columns(Item.id, Item.item_name, Item.hs_code, Item.calculate_year).all()
            
#     items = []
#     for y in result:
#         items.append({
#             'id' : y.id,
#             'item_name': y.item_name,
#             'hs_code': y.hs_code,
#             'calculate_year': y.calculate_year,
#         })

#     json_items = jsonable_encoder(items)
#     return json_items

# #foreing purchase ITem Search query
# @Foreign_purchase_router.post("/pcplus/api/item/getItemSuggestions", response_model=List[ItemSuggest])
# async def suggest_items(request: Request,db:Session=Depends(get_db)):
#     request_body = await request.body()
#     decoded_string = request_body.decode()
#     parts = decoded_string.split("/")
    
#     if len(parts) > 1:
#         year = parts[0]
#         part2 = parts[1]
#         items = await all_suggestitm(year = year, db = db)
#         searchTerm = part2.lower()
#         if searchTerm:
#             data= [item for item in items if 'item_name' in item and searchTerm in item['item_name'].lower()]
#             return data

#         else:
#             return []
#     else:
#         return []


# @Foreign_purchase_router.get("/pcplus/api/purchase/get_item_details/{item_id}", response_model=ItemDetailsModel, dependencies=[Depends(get_current_active_user)])
# async def get_item_details_by_id(item_id: int, db: Session = Depends(get_db)):
#     try:
#         print(item_id)
#         item = db.query(Item.id, Item.item_name, Item.hs_code_id, Item.hs_code, Hscode.sd, Hscode.vat, Hscode.cd, Hscode.ait, Hscode.rd, Hscode.at, Hscode.tti)\
#             .join(Hscode, Item.hs_code_id == Hscode.id).filter(Item.id == item_id).first()
        
#         if item is None:
#             raise HTTPException(status_code=404, detail="Item not found")


#         item_details = {
#             "id": item.id, 
#             "item_name": item.item_name, 
#             "hs_code_id": item.hs_code_id,
#             "hs_code": item.hs_code,
#             "sd": item.sd,
#             "vat": item.vat,
#             "cd": item.cd,
#             "ait": item.ait,
#             "rd": item.rd,
#             "at": item.at,
#             "tti": item.tti
#         }

#         return item_details
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         print(f"Unexpected error: {e}")



# @Foreign_purchase_router.get("/pcplus/api/foreign_purchase/all_foreign_purchase",response_model=List[ForeignPurchaseFetch], dependencies=[Depends(get_current_active_user)])
# async def index(db:Session=Depends(get_db)):

#     x=db.query(Purchase, Supplier).join(Supplier, Purchase.supplier_id==Supplier.id).filter(Purchase.purchase_type==2)\
#         .add_columns(Purchase.id,Supplier.supplier_name,Purchase.invoice_no,Purchase.vendor_inv,Purchase.chalan_date,Purchase.grand_total).all()
#     #print(x)
#     p_item =[]
#     for pp in x:
#         p_item.append({
#            'id': pp.id,
#            'invoice_no': pp.invoice_no,
#            'vendor_inv': pp.vendor_inv,
#            'chalan_date': pp.chalan_date,
#            'supplier_name': pp.supplier_name,
#            'grand_total': pp.grand_total,
#            })

#     junit = jsonable_encoder(p_item)
#     return JSONResponse(content=junit)












