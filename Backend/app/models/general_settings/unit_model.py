from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger
from sqlalchemy.orm import relationship
from pydantic import BaseModel


class Unit(Base):
    __tablename__="units"
    id=Column(Integer,primary_key=True,index=True)
    unit_name = Column(String(255),unique=True,index=True)
    unit_details = Column(String(255),unique=True,index=True)
    unit_status = Column(Integer, nullable=True)
    # prod = relationship(Product)


Base.metadata.create_all(bind=engine)

class UnitCreateSchema(BaseModel):
    unit_name:str
    unit_details:str
    unit_status:int
    class Config:
        from_attributes = True

class UnitSchema(BaseModel):
    id:int
    unit_name:str
    unit_details:str
    unit_status:int

    class Config:
        from_attributes = True

class UnitBase(BaseModel):
    unit_name:str
    unit_details:str
    unit_status:int

    class Config:
        from_attributes = True