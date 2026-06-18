from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger, TIMESTAMP, func, create_engine
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base


class Costing(Base):
    __tablename__="costing"
    id = Column(Integer, primary_key=True, index=True)
    costing_name = Column(String(255), index=True)
    costing_type = Column(String(255), index=True)
    costing_status = Column(Integer, nullable=True)
    delete_date = Column(TIMESTAMP, nullable=True, default=func.now())
    user_id = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, nullable=True, server_default=func.current_timestamp())
    updated_at = Column(TIMESTAMP, nullable=True, default=func.now(), onupdate=func.current_timestamp())




Base.metadata.create_all(bind=engine)

class CostingCreateSchema(BaseModel):
    costing_name: str
    costing_type: str
    costing_status: int
    user_id: int
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    delete_date: datetime = Field(default_factory=datetime.now)
    class Config:
        from_attributes = True



class CostingSchema(BaseModel):
    id:int
    costing_name: str
    costing_type: str
    costing_status: int
    delete_date: datetime = Field(default_factory=datetime.now)
    user_id: int
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        from_attributes = True

class CostingBase(BaseModel):
    costing_name: str
    costing_type: str
    costing_status: int
    delete_date: datetime = Field(default_factory=datetime.now)
    user_id: int
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        from_attributes = True