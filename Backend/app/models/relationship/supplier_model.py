from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,DateTime
from datetime import datetime, time
from sqlalchemy.orm import relationship
from pydantic import BaseModel


class Supplier(Base):
    __tablename__="suppliers"
    id=Column(Integer,primary_key=True,index=True)
    supplier_name = Column(String(255),index=True)
    supplier_email = Column(String(255),unique=True,index=True)
    supplier_phone = Column(String(255),unique=True,index=True)
    supplier_type = Column(Integer, index=True)
    country_id = Column(Integer,index=True)
    s_address = Column(String(255),index=True)
    s_bin_nid = Column(String(255),index=True)
    s_tin = Column(String(255),index=True)
    status = Column(Integer, nullable=True)
    user_id = Column(Integer, nullable=True)
    created_at = Column(DateTime,index=True, default=datetime.utcnow())
    updated_at = Column(DateTime,index=True, default=datetime.utcnow())


Base.metadata.create_all(bind=engine)

class SupplierCreateSchema(BaseModel):
    supplier_name:str
    supplier_email:str
    supplier_phone:str
    supplier_type:int
    country_id:int
    s_address:str
    s_bin_nid:str
    s_tin:str
    status:int
    user_id:int
    
    class Config:
        from_attributes = True

class SupplierSchema(BaseModel):
    id:int
    supplier_name:str
    supplier_email:str
    supplier_phone:str
    supplier_type:int
    country_id:int
    s_address:str
    s_bin_nid:str
    s_tin:str
    status:int
    user_id:int

    class Config:
        from_attributes = True

class supplierBase(BaseModel):
    supplier_name:str
    supplier_email:str
    supplier_phone:str
    country_id:int
    c_address:str
    c_bin_nid:str
    c_tin:str
    status:int
    user_id:int

    class Config:
        from_attributes = True