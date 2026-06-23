from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,Float,Date,Text,Double,Float,Numeric,BigInteger
from sqlalchemy.sql import func
from datetime import datetime, time ,date
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional

class Balance(Base):
    __tablename__ = 'balance'

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    previous_cost = Column(Float, default=0)
    current_cost = Column(Float, default=0)
    previous_due = Column(Float, default=0)
    current_due = Column(Float, default=0)
    previous_balance = Column(Float, default=0)
    current_balance = Column(Float, default=0)
    status = Column(Integer, nullable=True)
    created_by = Column(Integer, nullable=True)
    created_at = Column(Date, default=datetime.utcnow)

    

