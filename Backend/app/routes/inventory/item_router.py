from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.models.inventory.item_model import Item, ItemCreateSchema, ItemSchema, ItemBase
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os
from app.models.general_settings.unit_model import Unit
from app.models.general_settings.hs_code_model import Hscode



#route define
item_route = APIRouter()

@item_route.post("/pcplus/api/item/add_item", dependencies=[Depends(get_current_active_user)])
async def create(item:ItemCreateSchema,db:Session=Depends(get_db)): 
    # print(item)
    srv=Item(item_name=item.item_name,  item_type=item.item_type, description_code=item.description_code, hs_code=item.hs_code, hs_code_id=item.hs_code_id,
             unit_id=item.unit_id,stock_status=item.stock_status, status=item.status, calculate_year=item.calculate_year, created_by=item.created_by,updated_by=item.updated_by)
    db.add(srv)
    db.commit()
    return {"Message":"Successfully Add"}





@item_route.get("/pcplus/api/item/allitems",response_model=List[ItemSchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):

    #In ITEM shows data From unit data table 
    x=db.query(Item, Unit, Hscode).join(Unit, Item.unit_id==Unit.id ).join(Hscode, Item.hs_code_id==Hscode.id)\
        .add_columns(Item.id,Item.item_name,Item.description_code, Hscode.description,Item.item_type,Item.hs_code,Unit.unit_name,Item.stock_status,Item.status,Hscode.calculate_year,Item.created_by,Item.updated_by).all()
    #print(x)
    p_item =[]
    for pp in x:
        p_item.append({
           'id': pp.id,
           'item_name': pp.item_name,
           'description_code': pp.description_code,
           'description': pp.description,
           'item_type':pp.item_type,
           'hs_code':pp.hs_code,
           'unit_name':pp.unit_name,
           'stock_status':pp.stock_status,
           'status':pp.status,
           'calculate_year':pp.calculate_year,
           'created_by':pp.created_by,
           'updated_by':pp.updated_by
           })

    junit = jsonable_encoder(p_item)
    return JSONResponse(content=junit)

@item_route.get("/pcplus/api/item/get_item/{item_id}",response_model=ItemBase, dependencies=[Depends(get_current_active_user)])
async def get_itm(item_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Item).filter(Item.id == item_id).first()
        return (u)
    except:
        return HTTPException(status_code=422, details="item not found")

@item_route.put("/pcplus/api/item/update_item/{item_id}", dependencies=[Depends(get_current_active_user)])
async def update(item_id:int,item:ItemCreateSchema,db:Session=Depends(get_db)):
    try:
        u=db.query(Item).filter(Item.id==item_id).first()
        print(u)
        print(item)
        u.item_name=item.item_name
        u.item_type=item.item_type
        u.hs_code=item.hs_code
        u.hs_code_id=item.hs_code_id
        u.unit_id=item.unit_id
        u.stock_status=item.stock_status
        u.status=item.status
        u.calculate_year=item.calculate_year
        u.created_by=item.created_by
        u.updated_by=item.updated_by
        # print(jsonable_encoder(u))
        db.add(u)
        db.commit()
        return {"Message":"Successfully Update"}
    except:
        return HTTPException(status_code=404,detail="Update Uncessfull")

@item_route.delete("/pcplus/api/item/delete_item/{item_id}",response_class=JSONResponse, dependencies=[Depends(get_current_active_user)])
async def get_itm(item_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Item).filter(Item.id==item_id).first()
        db.delete(u)
        db.commit()
        return {"item has been deleted"}
    except:
        return HTTPException(status_code=422, details="user not found")
    

#array push

@item_route.post("/pcplus/api/item/add_item_array", dependencies=[Depends(get_current_active_user)])
async def create(item:List[ItemCreateSchema], request: Request, db:Session=Depends(get_db)): 
    # for request print
    # body =await request.body()
    # print(body)

    name= jsonable_encoder(item)
    i = []
    unt = []
    for i in range(len(name)):
        print(i)
        unt.append({
          'item_name': name[i]["item_name"],
          'item_type': name[i]["item_type"],
          'hs_code': name[i]["hs_code"],
          'hs_code_id': name[i]["hs_code_id"],
          'stock_status': name[i]["stock_status"],
          'status': name[i]["status"],
          'calculate_year': name[i]["calculate_year"],
          'created_by': name[i]["created_by"]
        })
        print(unt)
    for row in unt:
        print(row)
        item_list = [Item(**row)]
        db.add_all(item_list)
        db.commit()
    return {"Message":"Successfully Add"}


@item_route.put("/pcplus/api/item/update_item_array/{item_id}", dependencies=[Depends(get_current_active_user)])
async def update_array(item_id: str, item:ItemCreateSchema, request: Request, db:Session=Depends(get_db)): 
    y = item_id.split(",")
    u=db.query(Item).filter(Item.id.in_(y)).all()
    name= jsonable_encoder(u)
    i = []
    x = []
    for i,x in enumerate(name):
        item_name = x["item_name"],
        item_type = x["item_type"],
        hs_code = x["hs_code"],
        hs_code_id = x["hs_code_id"],
        stock_status = x["stock_status"],
        status = x["status"],
        calculate_year = x["calculate_year"],
        created_by = x["created_by"],
        updated_by = x["updated_by"]
 

        uu=db.query(Item).filter(Item.id == x["id"]).first()
        uu.item_name=item_name
        uu.item_type=item_type
        uu.hs_code=hs_code
        uu.hs_code_id=hs_code_id
        uu.stock_status=stock_status
        uu.status=status
        uu.calculate_year=calculate_year
        uu.created_by=created_by
        uu.updated_by=updated_by
        print(jsonable_encoder(uu))
        db.add(uu)
        db.commit()
    return {"Message":"Successfully Update"}



@item_route.post("/pcplus/api/item/upload_item_excel", dependencies=[Depends(get_current_active_user)])
async def upload_file(file: UploadFile = File(...), db:Session=Depends(get_db)):
    try:

        file_path = os.path.join(file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        import openpyxl
        wb = openpyxl.load_workbook(file_path)
        sheet = wb.active
        data = []

        for row in sheet.iter_rows(min_row=2, values_only=True):
            data.append({
                'item_name':    row[0],
                'item_type':    row[1],
                'hs_code':      row[2],
                'hs_code_id':   row[3],
                'stock_status': row[4],
                'status':       row[5],
                'calculate_year': row[6],
                'created_by':   row[7]
            })

        for row in data:
            # print(row)
            item_list = [Item(**row)]
            db.add_all(item_list)
            db.commit()

        return {"filename": file.filename}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
