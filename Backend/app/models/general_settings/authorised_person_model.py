from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column, DateTime,String,Integer,Boolean,SmallInteger, TIMESTAMP, func, create_engine
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base


class Authorised_person(Base):
    __tablename__="authorised_person"
    id = Column(Integer, primary_key=True, index=True)
    authorised_person_name = Column(String(255), index=True)
    authorised_person_description = Column(String(255),index=True, nullable=True)
    authorised_person_phone = Column(String(200), nullable=True)
    authorised_person_nid_number = Column(String(250), nullable=True)
    authorised_person_email_address= Column(String(255),index=True, nullable=True)
    authorised_person_signature = Column(String(255),index=True, nullable=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
    user_id = Column(Integer, nullable=True)
    
Base.metadata.create_all(bind=engine) 

class Authorised_personCreateSchema(BaseModel):
    authorised_person_name: str
    authorised_person_description : str
    authorised_person_phone: str
    authorised_person_nid_number : str
    authorised_person_email_address : str
    authorised_person_signature: str | None
    user_id: int
    

    class Config:
        from_attributes = True



class Authorised_personSchema(BaseModel):
    id : int 
    authorised_person_name: str
    authorised_person_description : str
    authorised_person_phone: str
    authorised_person_nid_number : str
    authorised_person_email_address : str
    authorised_person_signature: str
    user_id: int
    

    class Config:
        from_attributes = True

class Authorised_personBase(BaseModel):
    id : int 
    authorised_person_name: str
    authorised_person_description : str
    authorised_person_phone: str
    authorised_person_nid_number : str
    authorised_person_email_address : str
    authorised_person_signature: str
    user_id: int
    

    class Config:
        from_attributes = True