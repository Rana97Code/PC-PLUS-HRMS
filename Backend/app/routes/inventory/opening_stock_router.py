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
# from app.models.general_settings.unit_model import Unit
# from app.models.general_settings.hs_code_model import Hscode
# from app.models.inventory.item_model import Item, ItemBase 





# # route define
# Opening_stock_router = APIRouter()
# #For Raw_Materials::
# @Opening_stock_router.get("/pcplus/api/item/all_raw_materials", response_model=List[ItemBase], dependencies=[Depends(get_current_active_user)])
# async def index(db: Session = Depends(get_db)):  
#     return db.query(Item).filter(Item.item_type == 1, Item.stock_status == 0).all()


# @Opening_stock_router.get("/pcplus/api/opening_stock/all_raw_stock", response_model=List[OpeningStockSchema], dependencies=[Depends(get_current_active_user)])
# async def index(db: Session = Depends(get_db)):
#     tt = db.query(OpeningStock, Item).join(Item, OpeningStock.item_id == Item.id).filter(OpeningStock.item_type == 1)\
#         .add_columns(OpeningStock.id, OpeningStock.item_id, OpeningStock.item_type, Item.item_name, Item.hs_code, OpeningStock.opening_date, 
#                      OpeningStock.opening_quantity, OpeningStock.opening_rate, OpeningStock.opening_value, OpeningStock.closing_date).all()
#     raw_goods = []
#     for y in tt:
#         raw_goods.append({
#             'id' : y.id,
#             'item_id': y.item_id,
#             'item_name': y.item_name,
#             'hs_code': y.hs_code,
#             'item_type': y.item_type,
#             'opening_date': y.opening_date,
#             'opening_quantity': y.opening_quantity,
#             'opening_rate': y.opening_rate,
#             'opening_value': y.opening_value,
#             'closing_date': y.closing_date
#         })
    
#     json_raw_goods = jsonable_encoder(raw_goods)
#     return JSONResponse(content=json_raw_goods)




# #for Finishing_Goods::
# @Opening_stock_router.get("/pcplus/api/item/all_finish_goods", response_model=List[ItemBase], dependencies=[Depends(get_current_active_user)])
# async def index(db: Session = Depends(get_db)):  
#     return db.query(Item).filter(Item.item_type == 2, Item.status == 1).all()

# @Opening_stock_router.post("/pcplus/api/opening_stock/add-opening-stock", dependencies=[Depends(get_current_active_user)])
# async def create(openingStock:OpeningInsertSchema, db:Session=Depends(get_db)):
#     print(openingStock)
#     srv= OpeningStock( item_id=openingStock.item_id, item_type=openingStock.item_type, opening_date=openingStock.opening_date, 
#                       opening_quantity=openingStock.opening_quantity, opening_rate= openingStock.opening_rate, opening_value= openingStock.opening_value)
#     db.add(srv)
#     db.commit()
#     db.refresh(srv)

#     # Update item table's stock_status to 1
#     item = db.query(Item).filter(Item.id == openingStock.item_id).first()
#     if not item:
#         raise HTTPException(status_code=404, detail="Item not found")
#     item.stock_status = 1
#     db.commit()

#     return {"message": "Opening stock added and item stock status updated successfully", "opening_stock": srv}

    
    


# @Opening_stock_router.get("/pcplus/api/opening_stock/all_finish_stock", response_model=List[OpeningStockSchema], dependencies=[Depends(get_current_active_user)])
# async def index(db: Session = Depends(get_db)):
#     pp = db.query(OpeningStock, Item).join(Item, OpeningStock.item_id == Item.id)\
#         .add_columns(OpeningStock.id, OpeningStock.item_id, OpeningStock.item_type, Item.item_name, Item.hs_code, OpeningStock.opening_date, 
#                      OpeningStock.opening_quantity, OpeningStock.opening_rate, OpeningStock.opening_value, OpeningStock.closing_date).all()

#     finish_goods = []
#     for x in pp:
#         finish_goods.append({
#             'id' : x.id,
#             'item_id': x.item_id,
#             'item_name': x.item_name,
#             'hs_code': x.hs_code,
#             'item_type': x.item_type,
#             'opening_date': x.opening_date,
#             'opening_quantity': x.opening_quantity,
#             'opening_rate': x.opening_rate,
#             'opening_value': x.opening_value,
#             'closing_date': x.closing_date
#         })
    
#     json_finish_goods = jsonable_encoder(finish_goods)
#     return JSONResponse(content=json_finish_goods)


# # @FinishGoods_router.get("/pcplus/api/opening_stock/all_finish_stock", response_model=List[OpeningStockSchema], dependencies=[Depends(get_current_active_user)])
# # async def index(db:Session = Depends(get_db)):
#      #return db.query(OpeningStock).all()

#     # x=db.query(OpeningStock, Item).join(Item, OpeningStock.item_id == Item.id)\
#     #     .add_column(OpeningStock.item_id, OpeningStock.item_type, Item.item_name, Item.hs_code, OpeningStock.opening_date, OpeningStock.opening_quantity, 
#     #                 OpeningStock.opening_rate, OpeningStock.opening_value, OpeningStock.closing_date).all()
#     # finish_goods = []
#     # for y in x:
#     #     finish_goods.append({
#     #         'item_id': y.item_id,
#     #         'item_name': y.item_name,
#     #         'hs_code' : y.hs_code,
#     #         'item_type': y.item_type,
#     #         'opening_date' : y.opening_date,
#     #         'opening_quantity' : y.opening_quantity,
#     #         'opening_rate' :y.opening_rate,
#     #         'opening_value': y.opening_value,
#     #         'closing_date' : y.closing_date
#     #     })
    
# #     junit = jsonable_encoder(p_Finishgoods)
# #     return JSONResponse(content=junit)

