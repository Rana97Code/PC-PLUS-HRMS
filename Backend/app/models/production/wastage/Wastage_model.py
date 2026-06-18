from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,DateTime,Date,Text,Double,Float,BigInteger,Numeric
from sqlalchemy.sql import func
from datetime import datetime, time ,date
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional

class Wastage(Base):
    __tablename__ = 'wastage'

    id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, nullable=True, name="item_id")
    production_id = Column(Integer, nullable=True, name="production_id")
    sales_id = Column(Integer, nullable=True, name="sales_id")
    wastage_qty_rate = Column(Numeric(precision=10, scale=2), nullable=True, name="wastage_qty_rate")
    total_wastage_qty = Column(Numeric(precision=10, scale=2), nullable=True, name="total_wastage_qty")
    wastage_value_rate = Column(Numeric(precision=10, scale=2), nullable=True, name="wastage_value_rate")
    total_wastage_value = Column(Numeric(precision=10, scale=2), nullable=True, name="total_wastage_value")
    status = Column(Integer, nullable=True, name="status")
    production_date = Column(Date, nullable=True, name="production_date")
    user_id = Column(Integer, nullable=True, name="user_id")
    created_at = Column(Date, nullable=False, server_default=func.now(), name="created_at")

Base.metadata.create_all(bind=engine)