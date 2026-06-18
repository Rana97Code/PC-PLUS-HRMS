from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.models.general_settings.costing_model import CostingCreateSchema,CostingSchema,Costing 
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os



#route define
costing_router = APIRouter()




@costing_router.get("/pcplus/api/costing/all_costing", response_model=List[CostingSchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):
    return db.query(Costing).all()




@costing_router.post("/pcplus/api/costing/add_costing", dependencies=[Depends(get_current_active_user)])
async def create(costing:CostingCreateSchema,db:Session=Depends(get_db)): 
    print(costing)
    srv=Costing(costing_name=costing.costing_name,costing_type=costing.costing_type, costing_status=costing.costing_status, user_id= costing.user_id)
    db.add(srv)
    db.commit()
    return {"Message":"Successfully Add"}







@costing_router.get("/pcplus/api/costing/get_costing/{costing_id}",response_model=CostingSchema, dependencies=[Depends(get_current_active_user)])
async def get_itm(costing_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Costing).filter(Costing.id == costing_id).first()
        return (u)
    except:
        return HTTPException(status_code=422, details="Costing data not found")



@costing_router.put("/pcplus/api/costing/update_costing/{costing_id}", dependencies=[Depends(get_current_active_user)])
async def update(costing_id:int,costing:CostingCreateSchema,db:Session=Depends(get_db)):
    try:
        u=db.query(Costing).filter(Costing.id==costing_id).first()
        u.costing_name=costing.costing_name
        u.costing_type=costing.costing_type
        u.costing_status=costing.costing_status
        u.user_id=costing.user_id
        print(jsonable_encoder(u))
        db.add(u)
        db.commit()
        return {"Message":"Successfully Update"}
    except:
        return HTTPException(status_code=404,detail="Update Uncessfull")


    
@costing_router.post("/pcplus/api/costing/upload_costing_excel", dependencies=[Depends(get_current_active_user)])
async def upload_file(file: UploadFile = File(...), db:Session=Depends(get_db)):
    try:

        file_path = os.path.join(file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        import openpyxl # type: ignore
        wb = openpyxl.load_workbook(file_path)
        sheet = wb.active
        data = []

        for row in sheet.iter_rows(min_row=2, values_only=True):
            data.append({
                'costing_name': row[0],
                'costing_type': row[1],
                'costing_status': row[2],
                'user_id': row[3],
            })

        for row in data:
            # print(row)
            costing_list = [Costing(**row)]
            db.add_all(costing_list)
            db.commit()

        return {"filename": file.filename}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
