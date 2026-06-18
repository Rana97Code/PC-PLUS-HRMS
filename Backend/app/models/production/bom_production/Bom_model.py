from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,DateTime,Date,Text,Double,Float,BigInteger,Numeric
from sqlalchemy.sql import func
from datetime import datetime, time ,date
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional

class Bom(Base):
    __tablename__ = 'bom'

    id = Column(Integer, primary_key=True, autoincrement=True)
    item_sku = Column(String, nullable=True, name="item_sku")
    bom_no = Column(String, nullable=True, name="bom_no")
    product_code = Column(String, nullable=True, name="product_code")
    item_id = Column(Integer, nullable=True, name="item_id")
    hs_code = Column(String, nullable=True, name="hs_code")
    unit_name = Column(String, nullable=True, name="unit_name")
    remarks = Column(String, nullable=True)
    reference = Column(String, nullable=True)
    total_costing = Column(Numeric(precision=10, scale=2), nullable=True, name="total_costing")
    item_price = Column(Numeric(precision=10, scale=2), nullable=True, name="item_price")
    sales_price = Column(Numeric(precision=10, scale=2), nullable=True, name="sales_price")
    service_code = Column(String, nullable=True, name="service_code")
    status = Column(Integer, nullable=True)
    mrp_type = Column(Integer, nullable=True, name="mrp_type")
    bom_type = Column(Integer, nullable=True, name="bom_type")
    submission_date = Column(Date, nullable=True, name="submission_date")
    effective_date = Column(Date, nullable=True, name="effective_date")
    user_id = Column(Integer, nullable=True, name="user_id")
    created_at = Column(Date, nullable=False, server_default=func.now(), name="created_at")


class BomCosting(Base):
    __tablename__ = 'bom_costing'

    id = Column(Integer, primary_key=True, autoincrement=True)
    bom_id =Column(Integer, nullable=True, name="bom_id")
    costing_id = Column(Integer, nullable=True, name="costing_id")
    cost = Column(Numeric(precision=10, scale=2), nullable=True, name="cost")
    user_id = Column(Integer, nullable=True, name="user_id")
    created_at = Column(Date, nullable=False, server_default=func.now(), name="created_at")

class BomRawMaterials(Base):
    __tablename__ = 'bom_raw_materials'

    id = Column(Integer, primary_key=True, autoincrement=True)
    bom_id = Column(Integer, nullable=True, name="bom_id")
    raw_material_id = Column(Integer, nullable=True, name="raw_material_id")
    unit_name = Column(String, nullable=True, name="unit_name")
    material_qty = Column(Numeric(precision=10, scale=2), nullable=True, name="material_qty")
    material_rate = Column(Numeric(precision=10, scale=2), nullable=True, name="material_rate")
    material_price = Column(Numeric(precision=10, scale=2), nullable=True, name="material_price")
    wastage_percent = Column(Integer, nullable=True, name="wastage_percent")
    wastage_qty = Column(Numeric(precision=10, scale=2), nullable=True, name="wastage_qty")
    wastage_price = Column(Numeric(precision=10, scale=2), nullable=True, name="wastage_price")
    total_qty = Column(Numeric(precision=10, scale=2), nullable=True, name="total_qty")
    total_price = Column(Numeric(precision=10, scale=2), nullable=True, name="total_price")
    c_date = Column(Date, nullable=True, name="c_date")
    user_id = Column(Integer, nullable=True, name="user_id")
    created_at = Column(Date, nullable=False, server_default=func.now(), name="created_at")

Base.metadata.create_all(bind=engine)