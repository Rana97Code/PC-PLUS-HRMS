from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.models.general_settings.hs_code_model import HscodeCreateSchema,HscodeSchema,Hscode 
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os



#route define
hscode_route = APIRouter()

@hscode_route.post("/pcplus/api/hs_code/add_hs_code", dependencies=[Depends(get_current_active_user)])
async def create(hscode:HscodeCreateSchema,db:Session=Depends(get_db)): 

    srv=Hscode(hscode=hscode.hs_code, description=hscode.description,cd=hscode.cd,sd=hscode.sd, vat=hscode.vat,
                ait=hscode.ait, rd=hscode.rd,at=hscode.at,tti=hscode.tti,schedule=hscode.schedule,
                user_id=hscode.user_id,delete_status=hscode.delete_status,vat_type=hscode.vat_type,type=hscode.type,
                year_start=hscode.year_start, year_end=hscode.year_end, calculate_year=hscode.calculate_year, keycode=hscode.keycode)
    db.add(srv)
    db.commit()
    return {"Message":"Successfully Add"}

@hscode_route.get("/pcplus/api/hs_code/all_hs_code",response_model=List[HscodeSchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):
    return db.query(Hscode).all()

@hscode_route.get("/pcplus/api/hs_code/get_hs_code/{hs_code_id}",response_model=HscodeSchema, dependencies=[Depends(get_current_active_user)])
async def get_itm(hs_code_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Hscode).filter(Hscode.id == hs_code_id).first()
        return (u)
    except:
        return HTTPException(status_code=422, details="hs_code not found")
    

@hscode_route.post("/pcplus/api/hs_code/add_hs_code_array", dependencies=[Depends(get_current_active_user)])
async def create(hs_code:List[HscodeCreateSchema], request: Request, db:Session=Depends(get_db)): 

    name= jsonable_encoder(hs_code)
    i = []
    unt = []
    for i in range(len(name)):
        print(i)
        unt.append({
            # 'heading'       :name[i]["heading"],
            'hs_code'       :name[i]["hs_code"],
            'description'   :name[i]["description"],
            # 'description_bn':name[i]["description_bn"],
            'cd'            :name[i]["cd"],
            'sd'            :name[i]["sd"],
            'vat'           :name[i]["vat"],
            'ait'           :name[i]["ait"],
            'rd'            :name[i]["rd"],
            'at'            :name[i]["at"],
            'tti'           :name[i]["tti"],
            # 'service_schedule':name[i]["service_schedule"],
            'schedule'      :name[i]["schedule"],
            'user_id'       :name[i]["user_id"],
            'delete_status' :name[i]["delete_status"],
            # 'delete_date'   :name[i]["delete_date"],
            'vat_type'      :name[i]["vat_type"],
            'type'          :name[i]["type"],
            'year_start'    :name[i]["year_start"],
            'year_end'      :name[i]["year_end"],
            'calculate_year':name[i]["calculate_year"],
            'keycode'       :name[i]["keycode"]
        })
        # print(unt)
    for row in unt:
        print(row)
        hs_code_list = [Hscode(**row)]
        db.add_all(hs_code_list)
        db.commit()
    return {"Message":"Successfully Add"}


@hscode_route.put("/pcplus/api/hs_code/update_hs_code_array/{hs_code_id}", dependencies=[Depends(get_current_active_user)])
async def update_array(hs_code_id: str, request: Request, db:Session=Depends(get_db)): 
    y = hs_code_id.split(",")
    u=db.query(Hscode).filter(Hscode.id.in_(y)).all()
    name= jsonable_encoder(u)
    i = []
    x = []
    for i,x in enumerate(name):
        heading     = x["heading"],
        hs_code     =x["hs_code"],
        description =x["description"],
        description_bn=x["description_bn"],
        cd          =x["cd"],
        sd          =x["sd"],
        vat         =x["vat"],
        ait         =x["ait"],
        rd          =x["rd"],
        at          =x["at"],
        tti         =x["tti"],
        service_schedule =x["service_schedule"],
        schedule    =x["schedule"],
        user_id     =x["user_id"],
        delete_status=x["delete_status"],
        delete_date =x["delete_date"],
        vat_type    =x["vat_type"],
        type        =x["type"],
        year_start  =x["year_start"],
        year_end    =x["year_end"],
        calculate_year =x["calculate_year"],
        keycode     =x["keycode"],

        uu=db.query(Hscode).filter(Hscode.id == x["id"]).first()
        uu.heading=heading
        uu.hs_code=hs_code
        uu.description=description
        uu.description_bn=description_bn
        uu.cd=cd
        uu.sd=sd
        uu.vat=vat
        uu.ait=ait
        uu.rd=rd
        uu.at=at
        uu.tti=tti
        uu.service_schedule=service_schedule
        uu.schedule=schedule
        uu.user_id=user_id
        uu.delete_status=delete_status
        uu.delete_date=delete_date
        uu.vat_type=vat_type
        uu.type=type
        uu.year_start=year_start
        uu.year_end=year_end
        uu.calculate_year=calculate_year
        uu.keycode=keycode
        print(jsonable_encoder(uu))
        db.add(uu)
        db.commit()
    return {"Message":"Successfully Update"}