from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column, Float,String,Integer,Boolean,ForeignKey,DateTime,Date
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from datetime import datetime,date, time
from typing import Optional, List


class Purchase(Base):
    __tablename__="purchase"
    id=Column(Integer,primary_key=True,index=True)
    invoice_no = Column(String(255), nullable=True)
    vendor_inv = Column(String(255), nullable=True)
    supplier_id= Column(Integer, ForeignKey('suppliers.id'), nullable=True)
    purchase_type=Column(Integer,nullable=True)
    purchase_category=Column(Integer,nullable=True)
    lc_number=Column(String(255),nullable=True)
    custom_house_id=Column(Integer,nullable=True)
    country_origin=Column(Integer,nullable=True)
    data_source=Column(String(255),nullable=True)
    cpc_code_id=Column(Integer,nullable=True)
    total_price=Column(Float,nullable=True)
    total_vat=Column(Float,nullable=True)
    total_sd=Column(Float,nullable=True)
    total_at=Column(Float,nullable=True)
    grand_total=Column(Float,nullable=True)
    fiscal_year=Column(Integer,nullable=True)
    notes=Column(String(255),nullable=True)
    lc_date = Column(Date, nullable=True)
    entry_date = Column(Date, index=True, nullable=False)
    chalan_date = Column(Date, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    created_by = Column(Integer, nullable=True)
    purchase_items = relationship("Purchase_item", back_populates="purchase")

class Purchase_item(Base):
    __tablename__='purchase_item'
    id = Column(Integer,primary_key=True,index=True)
    item_id= Column(Integer, ForeignKey('items.id'), nullable=True)
    custom_item_name = Column(String(255), nullable=True)
    custom_item_type = Column(String(255), nullable=True)
    purchase_id= Column(Integer, ForeignKey('purchase.id'))
    hs_code=Column(String(255),nullable=True)
    boe_item_no=Column(Integer,nullable=True)
    qty=Column(Float,nullable=True)
    rate=Column(Float,nullable=True)
    access_amount=Column(Float,nullable=True)
    item_sd=Column(Float,nullable=True)
    sd_amount=Column(Float,nullable=True)
    vatable_value=Column(Float,nullable=True)
    vat_type=Column(Integer,nullable=True)
    vat_rate=Column(Float,nullable=True)
    vat_amount=Column(Float,nullable=True)
    item_cd=Column(Float,nullable=True)
    cd_amount=Column(Float,nullable=True)
    item_at=Column(Float,nullable=True)
    at_amount=Column(Float,nullable=True)
    item_rd=Column(Float,nullable=True)
    rd_amount=Column(Float,nullable=True)
    vds=Column(Integer,nullable=True)
    rebate=Column(Integer,nullable=True)
    item_total=Column(Float,nullable=True)
    purchase_date = Column(Date, index=True,nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    created_by = Column(Integer, nullable=True)

    purchase = relationship("Purchase", back_populates="purchase_items")
    item = relationship("Item")  # Assuming a relationship with Item
    
Base.metadata.create_all(bind=engine)