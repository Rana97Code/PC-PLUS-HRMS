from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,DateTime
from datetime import datetime, time
from sqlalchemy.orm import relationship
from pydantic import BaseModel


class Country(Base):
    __tablename__="countries"
    id=Column(Integer,primary_key=True,index=True)
    sortname = Column(String(255),unique=False,index=True)
    country_name = Column(String(255),unique=False,index=True)
    phone_code = Column(String(255),unique=False,index=True)
    

Base.metadata.create_all(bind=engine)

class CountryCreateSchema(BaseModel):
    sortname:str
    country_name:str
    phone_code:str
  
    
    class Config:
        from_attributes = True

class CountrySchema(BaseModel):
    id:int
    sortname:str
    country_name:str
    phone_code:int

    class Config:
        from_attributes = True