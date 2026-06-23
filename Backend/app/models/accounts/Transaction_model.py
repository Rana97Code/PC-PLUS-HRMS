from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,Float,Date,DateTime,Text,Double,Float,Numeric,BigInteger
from sqlalchemy.sql import func
from datetime import datetime, time ,date
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional


class Transaction(Base):
    __tablename__ = "transactions"
    id=Column(Integer,primary_key=True,index=True)
    transaction_date = Column(Date, index=True, nullable=False)
    transaction_type = Column(String(50),nullable=True)
    transaction_by = Column(String(100),nullable=True)
    transaction_to = Column(String(100),nullable=True)
    transaction_invoice = Column(String(100),nullable=True)
    amount_in = Column(Float, default=0)
    amount_out = Column(Float, default=0)
    cost = Column(Float, default=0)
    due_amount = Column(Float, default=0)
    return_amount = Column(Float, default=0)
    transaction_notes = Column(String(255),nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    created_by = Column(Integer, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_by = Column(Integer, nullable=True)



