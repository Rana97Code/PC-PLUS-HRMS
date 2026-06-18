from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,DateTime
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from datetime import datetime,date, time


class Item(Base):
    __tablename__="items"
    id=Column(Integer,primary_key=True,index=True)
    item_name = Column(String(255),index=True)
    item_type = Column(Integer,index=True)
    description = Column(String(255),index=True)
    hs_code = Column(String(255), nullable=True)
    unit_id = Column(Integer, nullable=True)
    stock_status = Column(Integer, nullable=True)
    status = Column(Integer, nullable=True)
    created_by = Column(Integer, nullable=True)
    updated_by = Column(Integer, nullable=True)
    created_at = Column(DateTime,index=True, default=datetime.utcnow())
    # prod = relationship(Product)

Base.metadata.create_all(bind=engine)

class ItemCreateSchema(BaseModel):
    item_name:str
    item_type:int | None
    description:str | None
    hs_code:str | None
    unit_id:int | None
    stock_status:int | None
    status:int | None
    created_by:int | None
    updated_by:int | None

    class Config:
        from_attributes = True

class ItemSchema(BaseModel):
    id:int
    item_name:str
    item_type:int | None
    description:str | None
    hs_code:str | None
    unit_name:int | None
    stock_status:int | None
    status:int | None
    created_by:int | None
    updated_by:int | None

    class Config:
        from_attributes = True

class ItemBase(BaseModel):
    id : int
    item_name:str
    item_type:int | None
    description:str | None
    hs_code:str | None
    unit_id:int | None
    stock_status:int | None
    status:int | None
    created_by:int | None
    updated_by:int | None

    class Config:
        from_attributes = True

class ItemSuggest(BaseModel):
    id : int
    item_name:str
    item_type:str

 


    class Config:
        from_attributes = True 
