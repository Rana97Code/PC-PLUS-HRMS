from fastapi import APIRouter, Depends, HTTPException, Request, File, UploadFile
from typing import Union, List, Optional
from sqlalchemy.orm import Session
from app.models.general_settings.company_settings_model import Company_settingsCreateSchema, Company_settingsSchema, Company_settings
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import Path
import os

# Route definition
company_settings_router = APIRouter()

@company_settings_router.get("/pcplus/api/company/get-company", response_model=List[Company_settingsSchema], dependencies=[Depends(get_current_active_user)])
async def index(db: Session = Depends(get_db)):  
    return db.query(Company_settings).all()

@company_settings_router.get("/pcplus/api/company/get-company/{company_settings_id}", response_model=Company_settingsSchema, dependencies=[Depends(get_current_active_user)])
async def get_itm(company_settings_id: int, db: Session = Depends(get_db)):
    u = db.query(Company_settings).filter(Company_settings.id == company_settings_id).first()
    if not u:
        raise HTTPException(status_code=422, detail="Company Settings data not found")
    return u

@company_settings_router.put("/pcplus/api/company/update-company/{company_settings_id}", dependencies=[Depends(get_current_active_user)])
async def update(company_settings_id: int, company_settings: Company_settingsCreateSchema, db: Session = Depends(get_db)):
    u = db.query(Company_settings).filter(Company_settings.id == company_settings_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Company Settings data not found")

    u.company_name = company_settings.company_name
    u.short_name = company_settings.site_short_name
    u.email = company_settings.email
    u.phone = company_settings.phone
    u.address = company_settings.address
    u.zip_code = company_settings.zip_code
    u.country_id = company_settings.country_id
    u.tin = company_settings.tin
    u.loginpage_image = company_settings.loginpage_image
    u.bank_name = company_settings.bank_name
    u.ac_no = company_settings.ac_no
    u.ifs_code = company_settings.ifs_code
    u.bin = company_settings.bin
    u.invoice_image = company_settings.invoice_image
    u.business_nature = company_settings.business_nature
    u.business_economics = company_settings.business_economics
    u.company_vat_type = company_settings.company_vat_type
    u.authorised_person = company_settings.authorised_person
    u.status = company_settings.status

    db.add(u)
    db.commit()
    return {"Message": "Successfully Updated"}

