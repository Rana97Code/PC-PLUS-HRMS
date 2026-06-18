from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,DateTime,Date,Text,Double,Float,BigInteger,Numeric
from sqlalchemy.sql import func
from datetime import datetime, time ,date
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional


class ReceiveVds(Base):
    __tablename__ = 'receive_vds'

    id = Column(Integer, primary_key=True, autoincrement=True)
    receive_vds_no = Column(String, nullable=True)
    vds_certificate_no = Column(String, nullable=True)
    vds_type = Column(Integer, nullable=True)
    vds_receive_date = Column(Date, nullable=True)
    customer_id = Column(BigInteger, nullable=True)
    total_vat = Column(Numeric(precision=10, scale=2), nullable=True)
    total_vds = Column(Numeric(precision=10, scale=2), nullable=True)
    total_value = Column(Numeric(precision=10, scale=2), nullable=True)
    total_receive = Column(Numeric(precision=10, scale=2), nullable=True)
    notes = Column(String, nullable=True)
    user_id = Column(BigInteger, nullable=True)
    created_at = Column(Date, nullable=False, server_default=func.now())

class ReceiveVdsItems(Base):
    __tablename__ = 'receive_vds_items'

    id = Column(Integer, primary_key=True, autoincrement=True)
    vds_id = Column(BigInteger, nullable=True)
    vds_invoice = Column(String, nullable=True)
    sales_date = Column(Date, nullable=True)
    sales_id = Column(BigInteger, nullable=True)
    customer_id = Column(BigInteger, nullable=True)
    sales_amount = Column(Numeric(precision=10, scale=2), nullable=True)
    vat_amount = Column(Numeric(precision=10, scale=2), nullable=True)
    vds_amount = Column(Numeric(precision=10, scale=2), nullable=True)
    receive_qty = Column(Numeric(precision=10, scale=2), nullable=True)
    receive_amount = Column(Numeric(precision=10, scale=2), nullable=True)
    bank_name = Column(String, nullable=True)
    branch_name = Column(String, nullable=True)
    account_no = Column(String, nullable=True)
    deposit_serial = Column(String, nullable=True)
    deposit_date = Column(Date, nullable=True)
    created_at = Column(Date, nullable=False, server_default=func.now())

Base.metadata.create_all(bind=engine)