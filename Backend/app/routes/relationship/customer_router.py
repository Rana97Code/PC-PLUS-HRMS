from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.models.relationship.customer_model import Customer, CustomerCreateSchema, CustomerSchema
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os



#route define
customer_router = APIRouter()

@customer_router.post("/pcplus/api/customer/add_customer", dependencies=[Depends(get_current_active_user)])
async def create(customer:CustomerCreateSchema,db:Session=Depends(get_db)): 
    srv=Customer(passport_no=customer.passport_no, nid_no=customer.nid_no, customer_name=customer.customer_name,customer_email=customer.customer_email, 
                 customer_phone=customer.customer_phone, customer_type=customer.customer_type, country_id=customer.country_id, c_address= customer.c_address,
                 shipping_country_id=customer.shipping_country_id, shipping_address= customer.shipping_address, c_bin_nid= customer.c_bin_nid,
                 c_tin=customer.c_tin, status=customer.status, user_id=customer.user_id )
    db.add(srv)
    db.commit()
    return {"Message":"Successfully Add"}



@customer_router.get("/pcplus/api/customer/all_customer",response_model=List[CustomerSchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):
    return db.query(Customer).all()



@customer_router.get("/pcplus/api/customer/get_customer/{customer_id}",response_model=CustomerSchema, dependencies=[Depends(get_current_active_user)])
async def get_itm(customer_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Customer).filter(Customer.id == customer_id).first()
        return (u)
    except:
        return HTTPException(status_code=422, details="Customer not found")



@customer_router.put("/pcplus/api/customer/update_customer/{customer_id}", dependencies=[Depends(get_current_active_user)])
async def update(customer_id:int,customer:CustomerCreateSchema,db:Session=Depends(get_db)):
    try:
        u=db.query(Customer).filter(Customer.id==customer_id).first()
        u.passport_no=customer.passport_no
        u.nid_no=customer.nid_no
        u.customer_name=customer.customer_name
        u.customer_email=customer.customer_email
        u.customer_phone=customer.customer_phone
        u.customer_type=customer.customer_type
        u.country_id=customer.country_id
        u.c_address= customer.c_address
        u.shipping_country_id=customer.shipping_country_id
        u.shipping_address= customer.shipping_address
        u.c_bin_nid= customer.c_bin_nid
        u.c_tin=customer.c_tin
        u.status=customer.status
        u.user_id=customer.user_id
        # print(jsonable_encoder(u))
        db.add(u)
        db.commit()
        return {"Message":"Successfully Update"}
    except:
        return HTTPException(status_code=404,detail="Update Uncessfull")



@customer_router.delete("/pcplus/api/delete_customer/{customer_id}",response_class=JSONResponse, dependencies=[Depends(get_current_active_user)])
async def get_itm(customer_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Customer).filter(Customer.id==customer_id).first()
        db.delete(u)
        db.commit()
        return {"customer has been deleted"}
    except:
        return HTTPException(status_code=422, details="user not found")
    

#array push



@customer_router.post("/pcplus/api/add_customer_array", dependencies=[Depends(get_current_active_user)])
async def create(customer:List[CustomerCreateSchema], request: Request, db:Session=Depends(get_db)): 
    # for request print
    # body =await request.body()
    # print(body)

    name= jsonable_encoder(customer)
    i = []
    custom = []
    for i in range(len(name)):
        print(i)
        custom.append({
          'passport_no': name[i]["passport_no"],
          'nid_no': name[i]["nid_no"],
          'customer_name': name[i]["customer_name"],
          'customer_email': name[i]["customer_email"],
          'customer_phone': name[i]["customer_phone"],
          'customer_type': name[i]["customer_type"],
          'country_id': name[i]["country_id"],
          'c_address': name[i]["c_address"],
          'shipping_country_id': name[i]["shipping_country_id"],
          'shipping_address': name[i]["shipping_address"],
          'c_bin_nid': name[i]["c_bin_nid"],
          'c_tin': name[i]["c_tin"],
          'status': name[i]["status"],
          'user_id': name[i]["user_id"]
        })
        print(custom)
    for row in custom:
        print(row)
        customer_list = [customer(**row)]
        db.add_all(customer_list)
        db.commit()
    return {"Message":"Successfully Add"}




@customer_router.put("/pcplus/api/update_customer_array/{customer_id}", dependencies=[Depends(get_current_active_user)])
async def update_array(customer_id: str, request: Request, db:Session=Depends(get_db)): 
    y = customer_id.split(",")
    u=db.query(Customer).filter(Customer.id.in_(y)).all()
    name= jsonable_encoder(u)
    i = []
    x = []
    for i,x in enumerate(name):
        customer_name = x["customer_name"],
        customer_email = x["customer_email"] + "+" + x["customer_name"]

        uu=db.query(Customer).filter(Customer.id == x["id"]).first()
        uu.customer_name=customer_name
        uu.customer_email=customer_email
        print(jsonable_encoder(uu))
        db.add(uu)
        db.commit()
    return {"Message":"Successfully Update"}




@customer_router.post("/pcplus/api/customer/upload_customer_excel", dependencies=[Depends(get_current_active_user)])
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
                'passport_no': row[0],
                'nid_no': row[1],
                'customer_name': row[2],
                'customer_email': row[3],
                'customer_phone': row[4],
                'customer_type': row[5],
                'country_id': row[6],
                'c_address': row[7],
                'shipping_country_id': row[8],
                'shipping_address': row[9],
                'c_bin_nid': row[10],
                'c_tin': row[11],
                'status': row[12],
                'user_id': row[13]
            })

        for row in data:
            # print(row)
            customer_list = [Customer(**row)]
            db.add_all(customer_list)
            db.commit()

        return {"filename": file.filename}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
