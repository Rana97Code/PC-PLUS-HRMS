from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,Float,Date,Text,Double,Float,Numeric,BigInteger
from sqlalchemy.sql import func
from datetime import datetime, time ,date
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional

class Stock(Base):
    __tablename__ = 'stock'

    id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, nullable=True)
    current_stock = Column(Float, nullable=True)
    rate = Column(Float, nullable=True)
    total_value = Column(Float, nullable=True)
    status = Column(Integer, nullable=True)
    user_id = Column(Integer, nullable=True)
    created_at = Column(Date, default=datetime.utcnow)



class StockHistory(Base):
    __tablename__ = 'stock_history'

    id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, nullable=False)
    action_tbl = Column(String(200), nullable=False)
    action_tbl_id = Column(Integer, nullable=True)
    previous_stock = Column(Numeric(precision=10, scale=2), nullable=True)
    qty = Column(Numeric(precision=10, scale=2), nullable=True)
    action_type = Column(String(200), nullable=True)
    status = Column(Integer, nullable=True)
    user_id = Column(Integer, nullable=True)
    created_at = Column(Date, default=datetime.utcnow, nullable=False)

