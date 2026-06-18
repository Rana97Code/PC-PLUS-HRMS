from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger, TIMESTAMP, func, create_engine
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base


class Company_settings(Base):
    __tablename__="company_settings"
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), index=True,nullable=False)
    short_name = Column(String(255), index=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(255), nullable=True)
    loginpage_image = Column(String(255), nullable=True)
    address = Column(String(255), nullable=True)
    country_id = Column(String(255), nullable=True)
    zip_code = Column(String(255), nullable=True) 
    tin = Column(String(255), nullable=True)
    bin = Column(String(255), nullable=True)
    bank_name = Column(String(255), nullable=True)
    ac_no = Column(String(255), nullable=True)
    bank_branch = Column(String(255), nullable=True)
    com_currency = Column(String(255), nullable=True)
    ifs_code = Column(String(255), nullable=True)
    invoice_image = Column(String(255), nullable=True)
    business_nature = Column(String(255), nullable=True)
    business_economics = Column(String(255), nullable=True)
    company_vat_type = Column(String(255), nullable=True)
    authorised_person = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    #user_id = Column(String(255), index= True, nullable=True)
    # city_id = Column(Integer, nullable=True)
    # state_id = Column(Integer, nullable=True)




Base.metadata.create_all(bind=engine)

class Company_settingsCreateSchema(BaseModel):
    company_name:str
    site_short_name:str
    email:str
    phone:str
    address : str
    zip_code : str
    country_id : str
    tin : str
    loginpage_image : str
    bank_name : str
    ac_no : str
    ifs_code : str
    bin : str
    invoice_image: str
    business_nature : str
    business_economics: str
    company_vat_type : str
    authorised_person: str
    status: str
    #user_id : str
    # city_id: int
    # state_id: int
    

    class Config:
        from_attributes = True



class Company_settingsSchema(BaseModel):
    id:int
    company_name : str
    site_short_name : str
    email: str
    phone : str
    address : str
    zip_code : str
    country_id : str
    tin : str
    loginpage_image : str
    bank_name : str
    ac_no : str
    ifs_code : str
    bin : str
    invoice_image: str
    business_nature : str
    business_economics: str
    company_vat_type : str
    authorised_person: str
    status: str
    #user_id : str
    # city_id: int
    # state_id: int

    class Config:
        from_attributes = True

class Company_settingsBase(BaseModel):
    company_name : str
    site_short_name : str
    email: str
    phone : str
    address : str
    zip_code : str
    country_id : str
    tin : str
    loginpage_image : str
    bank_name : str
    ac_no : str
    ifs_code : str
    bin : str
    invoice_image: str
    business_nature : str
    business_economics: str
    company_vat_type : str
    authorised_person: str
    status: str
    #user_id : str
    # city_id: int
    # state_id: int

    class Config:
        from_attributes = True