from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger, TIMESTAMP, func, create_engine
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base


class Branch_office(Base):
    __tablename__="branch_office"
    id = Column(Integer, primary_key=True, index=True)
    branch_office_name = Column(String(255), index=True)
    branch_office_code = Column(String(255), index=True)
    branch_office_address = Column(String(255), nullable=True)
    branch_office_status = Column(Integer, nullable=True )
    




Base.metadata.create_all(bind=engine)

class Branch_officeCreateSchema(BaseModel):
    branch_office_name : str
    branch_office_code : str
    branch_office_address : str
    branch_office_status : int
    class Config:
        from_attributes = True



class Branch_officeSchema(BaseModel):
    id:int
    branch_office_name : str
    branch_office_code : str
    branch_office_address : str
    branch_office_status : int

    class Config:
        from_attributes = True

class Branch_officeBase(BaseModel):
    branch_office_name : str
    branch_office_code : str
    branch_office_address : str
    branch_office_status : int

    class Config:
        from_attributes = True