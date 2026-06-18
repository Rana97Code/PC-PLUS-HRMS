from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.models.general_settings.unit_model import UnitCreateSchema,UnitSchema,Unit 
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os



#route define
unit_router = APIRouter()

@unit_router.post("/pcplus/api/add_unit", dependencies=[Depends(get_current_active_user)])
async def create(unit:UnitCreateSchema,db:Session=Depends(get_db)): 
    # print(unit)
    srv=Unit(unit_name=unit.unit_name,unit_details=unit.unit_details, unit_status=unit.unit_status)
    db.add(srv)
    db.commit()
    return {"Message":"Successfully Add"}

@unit_router.get("/pcplus/api/allunits",response_model=List[UnitSchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):
    return db.query(Unit).all()

@unit_router.get("/pcplus/api/get_unit/{unit_id}",response_model=UnitSchema, dependencies=[Depends(get_current_active_user)])
async def get_itm(unit_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Unit).filter(Unit.id == unit_id).first()
        return (u)
    except:
        return HTTPException(status_code=422, details="Unit not found")

@unit_router.put("/pcplus/api/update_unit/{unit_id}", dependencies=[Depends(get_current_active_user)])
async def update(unit_id:int,unit:UnitCreateSchema,db:Session=Depends(get_db)):
    try:
        u=db.query(Unit).filter(Unit.id==unit_id).first()
        u.unit_name=unit.unit_name
        u.unit_details=unit.unit_details
        u.unit_status=unit.unit_status
        # print(jsonable_encoder(u))
        db.add(u)
        db.commit()
        return {"Message":"Successfully Update"}
    except:
        return HTTPException(status_code=404,detail="Update Uncessfull")

@unit_router.delete("/pcplus/api/delete_unit/{unit_id}",response_class=JSONResponse, dependencies=[Depends(get_current_active_user)])
async def get_itm(unit_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Unit).filter(Unit.id==unit_id).first()
        db.delete(u)
        db.commit()
        return {"Unit has been deleted"}
    except:
        return HTTPException(status_code=422, details="user not found")
    

#array push

@unit_router.post("/pcplus/api/add_unit_array", dependencies=[Depends(get_current_active_user)])
async def create(unit:List[UnitCreateSchema], request: Request, db:Session=Depends(get_db)): 

    name= jsonable_encoder(unit)
    i = []
    unt = []
    for i in range(len(name)):
        # print(i)
        unt.append({
          'unit_name': name[i]["unit_name"],
          'unit_details': name[i]["unit_details"],
          'unit_status': name[i]["unit_status"]
        })
        # print(unt)
    for row in unt:
        # print(row)
        unit_list = [Unit(**row)]
        db.add_all(unit_list)
        db.commit()
    return {"Message":"Successfully Add"}


@unit_router.put("/pcplus/api/update_unit_array/{unit_id}", dependencies=[Depends(get_current_active_user)])
async def update_array(unit_id: str, request: Request, db:Session=Depends(get_db)): 
    y = unit_id.split(",")
    u=db.query(Unit).filter(Unit.id.in_(y)).all()
    name= jsonable_encoder(u)
    i = []
    x = []
    for i,x in enumerate(name):
        unit_name = x["unit_name"],
        unit_details = x["unit_details"] + "+" + x["unit_name"]

        uu=db.query(Unit).filter(Unit.id == x["id"]).first()
        uu.unit_name=unit_name
        uu.unit_details=unit_details
        print(jsonable_encoder(uu))
        db.add(uu)
        db.commit()
    return {"Message":"Successfully Update"}



@unit_router.post("/pcplus/api/unit/upload_unit_excel", dependencies=[Depends(get_current_active_user)])
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
                'unit_name': row[0],
                'unit_details': row[1],
                'unit_status': row[2]
            })

        for row in data:
            # print(row)
            unit_list = [Unit(**row)]
            db.add_all(unit_list)
            db.commit()

        return {"filename": file.filename}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
