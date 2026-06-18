from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,DateTime
from datetime import datetime, time
from sqlalchemy.orm import relationship
from pydantic import BaseModel


class Customer(Base):
    __tablename__="customers"
    id=Column(Integer,primary_key=True,index=True)
    passport_no = Column(String(255),unique=False,nullable=True,index=True)
    nid_no = Column(String(255),unique=False,nullable=True,index=True)
    customer_name = Column(String(255),unique=False,index=True)
    customer_email = Column(String(255),unique=True,index=True)
    customer_phone = Column(String(255),unique=True,index=True)
    customer_type = Column(Integer, index=True)
    country_id = Column(Integer,unique=False,index=True)
    c_address = Column(String(255),unique=False,index=True)
    shipping_country_id = Column(Integer,unique=False,index=True)
    shipping_address = Column(String(255),unique=False,index=True)
    c_bin_nid = Column(String(255),unique=True,index=True)
    c_tin = Column(String(255),unique=True,index=True)
    status = Column(Integer, nullable=True)
    user_id = Column(Integer, nullable=True)
    created_at = Column(DateTime,index=True, default=datetime.utcnow())
    updated_at = Column(DateTime,index=True, default=datetime.utcnow())


Base.metadata.create_all(bind=engine)

class CustomerCreateSchema(BaseModel):
    passport_no:str
    nid_no:str
    customer_name:str
    customer_email:str
    customer_phone:str
    customer_type:int
    country_id:int
    c_address:str
    shipping_country_id:int
    shipping_address:str
    c_bin_nid:str
    c_tin:str
    status:int
    user_id:int
    
    class Config:
        from_attributes = True

class CustomerSchema(BaseModel):
    id:int
    passport_no:str
    nid_no:str
    customer_name:str
    customer_email:str
    customer_phone:str
    customer_type:int
    country_id:int
    c_address:str
    shipping_country_id:int
    shipping_address:str
    c_bin_nid:str
    c_tin:str
    status:int
    user_id:int

    class Config:
        from_attributes = True

# class CustomerBase(BaseModel):
#     customer_name:str
#     customer_email:str
#     customer_phone:str
#     country_id:int
#     c_address:str
#     shipping_country_id:int
#     c_bin_nid:str
#     c_tin:str
#     status:int
#     user_id:int

#     class Config:
#         orm_mode=True