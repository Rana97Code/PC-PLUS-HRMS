from fastapi import APIRouter, Depends,HTTPException,requests,Request,File,UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.models.general_settings.authorised_person_model import Authorised_personCreateSchema, Authorised_personSchema, Authorised_person
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os




#route define
authorised_person_router = APIRouter()



@authorised_person_router.get("/pcplus/api/authorised_person/all_person", response_model=List[Authorised_personSchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):  
    return db.query(Authorised_person).all()

@authorised_person_router.post("/pcplus/api/authorised_person/add-person", dependencies=[Depends(get_current_active_user)])
async def create(authorised_person:Authorised_personCreateSchema,db:Session=Depends(get_db)): 
    srv=Authorised_person(authorised_person_name=authorised_person.authorised_person_name,authorised_person_description=authorised_person.authorised_person_description,
                          authorised_person_phone=authorised_person.authorised_person_phone,authorised_person_nid_number=authorised_person.authorised_person_nid_number,
                          authorised_person_email_address=authorised_person.authorised_person_email_address,
                          authorised_person_signature=authorised_person.authorised_person_signature,user_id=authorised_person.user_id )
    # print(authorised_person)
    db.add(srv)
    db.commit()
    return {"Message":"Successfully Add"}


@authorised_person_router.get("/pcplus/api/authorised_person/get_person/{authorised_person_id}",response_model=Authorised_personSchema, dependencies=[Depends(get_current_active_user)])
async def get_itm(authorised_person_id:int, db:Session=Depends(get_db)):
    try:
        u=db.query(Authorised_person).filter(Authorised_person.id == authorised_person_id).first()
        return (u)
    except:
        return HTTPException(status_code=422, details="Custom House data not found")



@authorised_person_router.put("/pcplus/api/authorised_person/update_person/{authorised_person_id}", dependencies=[Depends(get_current_active_user)])
async def update(authorised_person_id:int, authorised_person:Authorised_personCreateSchema, db:Session=Depends(get_db)):
    try:
        u=db.query(Authorised_person).filter(Authorised_person.id==authorised_person_id).first()
        u.authorised_person_name=authorised_person.authorised_person_name
        u.authorised_person_description= authorised_person.authorised_person_description
        u.authorised_person_phone=authorised_person.authorised_person_phone
        u.authorised_person_nid_number=authorised_person.authorised_person_nid_number
        u.authorised_person_email_address=authorised_person.authorised_person_email_address
        u.authorised_person_signature=authorised_person.authorised_person_signature
        u.user_id=authorised_person.user_id

        print(jsonable_encoder(u))
        db.add(u)
        db.commit()
        return {"Message":"Successfully Updated"}
    except:
        return HTTPException(status_code=404,detail="Update Unsucessfull")
