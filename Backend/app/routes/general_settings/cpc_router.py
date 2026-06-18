# from fastapi import APIRouter, Depends,HTTPException,requests,Request,File,UploadFile
# from typing import Union,List,Optional
# from sqlalchemy.orm import Session
# from app.models.general_settings.cpc_model import CpcCreateSchema,CpcSchema,Cpc
# from app.db.database import get_db
# from app.routes.auth_router import get_current_active_user;
# from fastapi.responses import JSONResponse
# from fastapi.encoders import jsonable_encoder
# from pathlib import *
# import os




# #route define
# cpc_router = APIRouter()



# @cpc_router.get("/pcplus/api/cpc/all_cpc", response_model=List[CpcSchema], dependencies=[Depends(get_current_active_user)])
# async def index(db:Session=Depends(get_db)):  
#     return db.query(Cpc).all()


# @cpc_router.post("/pcplus/api/cpc/add_cpc", dependencies=[Depends(get_current_active_user)])
# async def create(cpc:CpcCreateSchema,db:Session=Depends(get_db)): 
#     srv=Cpc(cpc_name=cpc.cpc_name,cpc_code=cpc.cpc_code,cpc_status=cpc.cpc_status,user_id=cpc.user_id)
#     db.add(srv)
#     db.commit()
#     return {"Message":"Successfully Add"}


# @cpc_router.get("/pcplus/api/cpc/get_cpc/{cpc_id}",response_model=CpcSchema, dependencies=[Depends(get_current_active_user)])
# async def get_itm(cpc_id:int,db:Session=Depends(get_db)):
#     try:
#         u=db.query(Cpc).filter(Cpc.id == cpc_id).first()
#         return (u)
#     except:
#         return HTTPException(status_code=422, details="Custom House data not found")



# @cpc_router.put("/pcplus/api/cpc/update_cpc/{cpc_id}", dependencies=[Depends(get_current_active_user)])
# async def update(cpc_id:int, cpc:CpcCreateSchema, db:Session=Depends(get_db)):
#     try:
#         u=db.query(Cpc).filter(Cpc.id==cpc_id).first()
#         u.cpc_name=cpc.cpc_name
#         u.cpc_code=cpc.cpc_code
#         u.cpc_status=cpc.cpc_status
#         u.user_id= cpc.user_id

#         print(jsonable_encoder(u))
#         db.add(u)
#         db.commit()
#         return {"Message":"Successfully Updated"}
#     except:
#         return HTTPException(status_code=404,detail="Update Unsucessfull")


    
# @cpc_router.post("/pcplus/api/cpc/upload_cpc_excel", dependencies=[Depends(get_current_active_user)])
# async def upload_file(file: UploadFile = File(...), db:Session=Depends(get_db)):
#     try:

#         file_path = os.path.join(file.filename)
#         with open(file_path, "wb") as f:
#             f.write(await file.read())

#         import openpyxl # type: ignore
#         wb = openpyxl.load_workbook(file_path)
#         sheet = wb.active
#         data = []

#         for row in sheet.iter_rows(min_row=2, values_only=True):
#             data.append({
#                 'cpc_name': row[0],
#                 'cpc_code': row[1],
#                 'cpc_status': row[2]
#             })

#         for row in data:
#             # print(row)
#             cpc_list = [Cpc(**row)]
#             db.add_all(cpc_list)
#             db.commit()

#         return {"filename": file.filename}
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
