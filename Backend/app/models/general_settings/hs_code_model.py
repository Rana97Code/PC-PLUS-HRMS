from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,Float,Double,DateTime,Date
from datetime import datetime,date, time
from sqlalchemy.orm import relationship
from pydantic import BaseModel


class Hscode(Base):
    __tablename__="hs_code"
    id=Column(Integer,primary_key=True,index=True)
    heading = Column(String(255),unique=False,index=True)
    hs_code = Column(String(255),unique=False,index=True)
    description = Column(String(255),unique=False,index=True)
    description_bn = Column(String(255),unique=False,index=True)
    cd = Column(Float,unique=False,index=True)
    sd = Column(Float,unique=False,index=True)
    vat = Column(Float,unique=False,index=True)
    ait = Column(Float,unique=False,index=True)
    rd = Column(Float,unique=False,index=True)
    at = Column(Float,unique=False,index=True)
    tti = Column(Float,unique=False,index=True)
    service_schedule = Column(String(255),unique=False,index=True)
    schedule = Column(String(255),unique=False,index=True)
    user_id = Column(Integer,unique=False,index=True)
    delete_status = Column(Integer,unique=False,index=True)
    delete_date = Column(DateTime,index=True)
    vat_type = Column(Integer,unique=False,index=True)
    type = Column(Integer,unique=False,index=True)
    year_start = Column(Date,unique=False,index=True)
    year_end = Column(Date,unique=False,index=True)
    calculate_year = Column(String(255),unique=False,index=True)
    keycode = Column(String(255),unique=False,index=True)
    created_at = Column(DateTime,index=True, default=datetime.utcnow())


    

Base.metadata.create_all(bind=engine)

class HscodeCreateSchema(BaseModel):
    # heading:str
    hs_code:str
    description:str
    description_bn:str | None
    cd:float
    sd:float
    vat:float
    ait:float
    rd:float
    at:float
    tti:float
    # service_schedule:str
    schedule:str
    user_id:int
    delete_status:int
    # delete_date:datetime
    vat_type:int
    type:int
    year_start:date
    year_end:date
    calculate_year:str
    keycode:str
    
    class Config:
        from_attributes = True

class HscodeSchema(BaseModel):
    id:int
    heading:str | None
    hs_code:str
    description:str
    description_bn:str | None
    cd:float
    sd:float
    vat:float
    ait:float
    rd:float
    at:float
    tti:float
    service_schedule:str | None
    schedule:str | None
    user_id:int
    delete_status:int
    delete_date:date | None
    vat_type:int
    type:int
    year_start:date
    year_end:date
    calculate_year:str
    keycode:str

    class Config:
        from_attributes = True