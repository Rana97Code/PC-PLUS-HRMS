from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,DateTime,Date,Text,Double,Float,BigInteger,Numeric
from sqlalchemy.sql import func
from datetime import datetime, time ,date
from sqlalchemy.orm import relationship
from pydantic import BaseModel,condecimal
from typing import Optional



class Sales(Base):
    __tablename__ = 'sales'

    id = Column(Integer, primary_key=True, autoincrement=True)
    sales_invoice = Column(String, nullable=True)
    sales_challan = Column(String, nullable=True)
    sales_type = Column(String, nullable=True)
    sales_category = Column(Integer, nullable=True)
    customer_id = Column(BigInteger, nullable=True)
    sale_center_id = Column(BigInteger, nullable=True)
    sales_transfer_id = Column(BigInteger, nullable=True)
    transfer_type = Column(String, nullable=True)
    lc_no = Column(String, nullable=True)
    cpc_code_id = Column(Integer, nullable=True)
    custom_house_id = Column(Integer, nullable=True)
    country_id = Column(Integer, nullable=True)
    destination = Column(String, nullable=True)
    vehicle_type = Column(String, nullable=True)
    vehicle_info = Column(String, nullable=True)
    boe_number = Column(String, nullable=True)
    boe_item_no = Column(Integer, nullable=True)
    total_sd = Column(Numeric(precision=10, scale=2), nullable=True)
    total_discount = Column(Numeric(precision=10, scale=2), nullable=True)
    total_vat = Column(Numeric(precision=10, scale=2), nullable=True)
    grand_total = Column(Numeric(precision=10, scale=2), nullable=True)
    notes = Column(String, nullable=True)
    user_id = Column(Integer, nullable=True)
    chalan_date = Column(Date, nullable=True)
    boe_date = Column(Date, nullable=True)
    lc_date = Column(Date, nullable=True)
    created_at = Column(Date, nullable=False, server_default=func.now())
   

class SalesItem(Base):
    __tablename__ = 'sales_item'

    id = Column(Integer, primary_key=True, autoincrement=True)
    transferType = Column(String, nullable=True, name="trans_type")
    salesId = Column(BigInteger, nullable=True, name="sales_id")
    itemId = Column(BigInteger, nullable=True, name="item_id")
    hsCodeId = Column(BigInteger, nullable=True, name="hs_code_id")
    tradingType = Column(Integer, nullable=True, name="trading_type")
    rate = Column(Numeric(precision=10, scale=2), nullable=True)
    qty = Column(Numeric(precision=10, scale=2), nullable=True)
    vatType = Column(String, nullable=True, name="vat_type")
    vatRate = Column(Numeric(precision=10, scale=2), nullable=True, name="vat_rate")
    vatAmount = Column(Numeric(precision=10, scale=2), nullable=True, name="vat_amount")
    sdRate = Column(Numeric(precision=10, scale=2), nullable=True, name="sd_rate")
    sdAmount = Column(Numeric(precision=10, scale=2), nullable=True, name="sd_amount")
    vatableValue = Column(Numeric(precision=10, scale=2), nullable=True, name="vatable_value")
    amount = Column(Numeric(precision=10, scale=2), nullable=True)
    totalAmount = Column(Numeric(precision=10, scale=2), nullable=True, name="total_amount")
    vds = Column(Integer, nullable=True)
    discountRate = Column(Numeric(precision=10, scale=2), nullable=True, name="discount_rate")
    discountAmount = Column(Numeric(precision=10, scale=2), nullable=True, name="discount_amount")
    salesPrice = Column(Numeric(precision=10, scale=2), nullable=True, name="sales_price")
    salesDate = Column(Date, nullable=True, name="sales_date")
    createdAt = Column(Date, nullable=False, server_default=func.now(), name="created_at")

class Invoice(Base):
    __tablename__ = "invoice"
    id = Column(Integer, primary_key=True, autoincrement=True)
    invoice_no = Column(String(20), nullable=True)
    sales_id = Column(Integer, nullable=True)
    sc_sales_id = Column(Integer, nullable=True)
    sales_amount = Column(Float(precision=20, decimal_return_scale=2), nullable=True)
    invoice_date = Column(Date, nullable=True)
    user_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())


Base.metadata.create_all(bind=engine)

