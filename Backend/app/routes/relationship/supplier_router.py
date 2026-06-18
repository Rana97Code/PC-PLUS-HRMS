from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.models.relationship.supplier_model import Supplier, SupplierCreateSchema, SupplierSchema
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os



#route define
supplier_router = APIRouter()

@supplier_router.post("/pcplus/api/supplier/add-supplier", dependencies=[Depends(get_current_active_user)])
async def create(supplier:SupplierCreateSchema,db:Session=Depends(get_db)): 
    srv=Supplier(supplier_name=supplier.supplier_name,supplier_email=supplier.supplier_email, supplier_phone=supplier.supplier_phone,
                 supplier_type=supplier.supplier_type, country_id=supplier.country_id, s_address= supplier.s_address,
                 s_bin_nid= supplier.s_bin_nid, s_tin=supplier.s_tin, status=supplier.status, user_id=supplier.user_id )
    db.add(srv)
    db.commit()
    return {"Message":"Successfully Add"}

@supplier_router.get("/pcplus/api/supplier/all_supplier",response_model=List[SupplierSchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):
    return db.query(Supplier).all()

@supplier_router.get("/pcplus/api/supplier/get_supplier/{supplier_id}",response_model=SupplierSchema, dependencies=[Depends(get_current_active_user)])
async def get_itm(supplier_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Supplier).filter(Supplier.id == supplier_id).first()
        return (u)
    except:
        return HTTPException(status_code=422, details="supplier not found")

@supplier_router.put("/pcplus/api/supplier/update_supplier/{supplier_id}", dependencies=[Depends(get_current_active_user)])
async def update(supplier_id:int,supplier:SupplierCreateSchema,db:Session=Depends(get_db)):
    try:
        u=db.query(Supplier).filter(Supplier.id==supplier_id).first()
        u.supplier_name=supplier.supplier_name
        u.supplier_email=supplier.supplier_email
        u.supplier_phone=supplier.supplier_phone
        u.supplier_type=supplier.supplier_type
        u.country_id=supplier.country_id
        u.s_address= supplier.s_address
        u.s_bin_nid= supplier.s_bin_nid
        u.s_tin=supplier.s_tin
        u.status=supplier.status
        u.user_id=supplier.user_id
        # print(jsonable_encoder(u))
        db.add(u)
        db.commit()
        return {"Message":"Successfully Update"}
    except:
        return HTTPException(status_code=404,detail="Update Uncessfull")

@supplier_router.delete("/pcplus/api/supplier/delete_supplier/{supplier_id}",response_class=JSONResponse, dependencies=[Depends(get_current_active_user)])
async def get_itm(supplier_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Supplier).filter(Supplier.id==supplier_id).first()
        db.delete(u)
        db.commit()
        return {"supplier has been deleted"}
    except:
        return HTTPException(status_code=422, details="user not found")
    

#array push

@supplier_router.post("/pcplus/api/add_supplier_array", dependencies=[Depends(get_current_active_user)])
async def create(supplier:List[SupplierCreateSchema], request: Request, db:Session=Depends(get_db)): 
    # for request print
    # body =await request.body()
    # print(body)

    name= jsonable_encoder(supplier)
    i = []
    custom = []
    for i in range(len(name)):
        print(i)
        custom.append({
          'supplier_name': name[i]["supplier_name"],
          'supplier_email': name[i]["supplier_email"],
          'supplier_phone': name[i]["supplier_phone"],
          'supplier_type': name[i]["supplier_type"],
          'country_id': name[i]["country_id"],
          's_address': name[i]["s_address"],
          's_bin_nid': name[i]["s_bin_nid"],
          's_tin': name[i]["s_tin"],
          'status': name[i]["status"],
          'user_id': name[i]["user_id"]
        })
        print(custom)
    for row in custom:
        print(row)
        supplier_list = [Supplier(**row)]
        db.add_all(supplier_list)
        db.commit()
    return {"Message":"Successfully Add"}


@supplier_router.put("/pcplus/api/update_supplier_array/{supplier_id}", dependencies=[Depends(get_current_active_user)])
async def update_array(supplier_id: str, request: Request, db:Session=Depends(get_db)): 
    y = supplier_id.split(",")
    u=db.query(Supplier).filter(Supplier.id.in_(y)).all()
    name= jsonable_encoder(u)
    i = []
    x = []
    for i,x in enumerate(name):
        supplier_name = x["supplier_name"],
        supplier_email = x["supplier_email"] + "+" + x["supplier_name"]

        uu=db.query(Supplier).filter(Supplier.id == x["id"]).first()
        uu.supplier_name=supplier_name
        uu.supplier_email=supplier_email
        print(jsonable_encoder(uu))
        db.add(uu)
        db.commit()
    return {"Message":"Successfully Update"}



@supplier_router.post("/pcplus/api/supplier/upload_supplier_excel", dependencies=[Depends(get_current_active_user)])
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
                'supplier_name': row[0],
                'supplier_email': row[1],
                'supplier_phone': row[2],
                'supplier_type': row[3],
                'country_id': row[4],
                's_address': row[5],
                's_bin_nid': row[6],
                's_tin': row[7],
                'status': row[8],
                'user_id': row[9]
            })

        for row in data:
            # print(row)
            supplier_list = [Supplier(**row)]
            db.add_all(supplier_list)
            db.commit()

        return {"filename": file.filename}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
