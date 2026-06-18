from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.models.country_model import CountryCreateSchema,CountrySchema,Country 
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os



#route define
country_router = APIRouter()

@country_router.post("/pcplus/api/country/add_country", dependencies=[Depends(get_current_active_user)])
async def create(country:CountryCreateSchema,db:Session=Depends(get_db)): 
    # print(country)
    srv=country(sortname=country.sortname,country_name=country.country_name, phone_code=country.phone_code)
    db.add(srv)
    db.commit()
    return {"Message":"Successfully Add"}

@country_router.get("/pcplus/api/country/all_country",response_model=List[CountrySchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):
    return db.query(Country).all()

@country_router.get("/pcplus/api/country/get_country/{country_id}",response_model=CountrySchema, dependencies=[Depends(get_current_active_user)])
async def get_itm(country_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Country).filter(Country.id == country_id).first()
        return (u)
    except:
        return HTTPException(status_code=422, details="country not found")
    

@country_router.post("/pcplus/api/country/add_country_array", dependencies=[Depends(get_current_active_user)])
async def create(country:List[CountryCreateSchema], request: Request, db:Session=Depends(get_db)): 
    # for request print
    # body =await request.body()
    # print(body)

    name= jsonable_encoder(country)
    i = []
    unt = []
    for i in range(len(name)):
        print(i)
        unt.append({
          'sortname': name[i]["sortname"],
          'country_name': name[i]["country_name"],
          'phone_code': name[i]["phone_code"]
        })
        # print(unt)
    for row in unt:
        print(row)
        country_list = [Country(**row)]
        db.add_all(country_list)
        db.commit()
    return {"Message":"Successfully Add"}


@country_router.put("/pcplus/api/country/update_country_array/{country_id}", dependencies=[Depends(get_current_active_user)])
async def update_array(country_id: str, request: Request, db:Session=Depends(get_db)): 
    y = country_id.split(",")
    u=db.query(Country).filter(Country.id.in_(y)).all()
    name= jsonable_encoder(u)
    i = []
    x = []
    for i,x in enumerate(name):
        sortname = x["sortname"],
        country_name = x["country_name"],
        phone_code = x["phone_code"]

        uu=db.query(Country).filter(Country.id == x["id"]).first()
        uu.sortname=sortname
        uu.country_name=country_name
        uu.phone_code=phone_code
        print(jsonable_encoder(uu))
        db.add(uu)
        db.commit()
    return {"Message":"Successfully Update"}