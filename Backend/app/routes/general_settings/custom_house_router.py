# from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
# from typing import Union,List,Optional
# from sqlalchemy.orm import Session
# from app.models.general_settings.custom_house_model import Custom_houseCreateSchema, Custom_houseSchema, Custom_house
# from app.db.database import get_db
# from app.routes.auth_router import get_current_active_user;
# from fastapi.responses import JSONResponse
# from fastapi.encoders import jsonable_encoder
# from pathlib import *
# import os



# #route define
# custom_house_router = APIRouter()



# @custom_house_router.get("/pcplus/api/customhouse/all_custom_house", response_model=List[Custom_houseSchema], dependencies=[Depends(get_current_active_user)])
# async def index(db:Session=Depends(get_db)):  
#     return db.query(Custom_house).all()



# @custom_house_router.post("/pcplus/api/customhouse/add_custom_house", dependencies=[Depends(get_current_active_user)])
# async def create(custom_house:Custom_houseCreateSchema,db:Session=Depends(get_db)): 
#     #print(Custom_house)
#     srv=Custom_house(custom_house_name=custom_house.custom_house_name,custom_house_code=custom_house.custom_house_code, custom_house_address = custom_house.custom_house_address, custom_house_status = custom_house.custom_house_status)
#     db.add(srv)
#     db.commit()
#     return {"Message":"Successfully Add"}






# @custom_house_router.get("/pcplus/api/customhouse/get_custom_house/{custom_house_id}",response_model=Custom_houseSchema, dependencies=[Depends(get_current_active_user)])
# async def get_itm(custom_house_id:int,db:Session=Depends(get_db)):
#     try:
#         u=db.query(Custom_house).filter(Custom_house.id == custom_house_id).first()
#         return (u)
#     except:
#         return HTTPException(status_code=422, details="Custom House data not found")



# @custom_house_router.put("/pcplus/api/customhouse/update_custom_house/{custom_house_id}", dependencies=[Depends(get_current_active_user)])
# async def update(custom_house_id:int, custom_house:Custom_houseCreateSchema, db:Session=Depends(get_db)):
#     try:
#         print(custom_house)
#         u=db.query(Custom_house).filter(Custom_house.id==custom_house_id).first()
#         u.custom_house_name=custom_house.custom_house_name
#         u.custom_house_code=custom_house.custom_house_code
#         u.custom_house_address=custom_house.custom_house_address
#         u.custom_house_status=custom_house.custom_house_status
#         #u.user_id=custom_house.user_id
#         print(jsonable_encoder(u))
#         db.add(u)
#         db.commit()
#         return {"Message":"Successfully Updated"}
#     except:
#         return HTTPException(status_code=404,detail="Update Unsucessfull")


    
# @custom_house_router.post("/pcplus/api/customhouse/upload_custom_house_excel", dependencies=[Depends(get_current_active_user)])
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
#                 'custom_house_name': row[0],
#                 'custom_house_code': row[1],
#                 'custom_house_address': row[2],
#                 'custom_house_status': row[3]
#             })

#         for row in data:
#             # print(row)
#             custom_house_list = [Custom_house(**row)]
#             db.add_all(custom_house_list)
#             db.commit()

#         return {"filename": file.filename}
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
