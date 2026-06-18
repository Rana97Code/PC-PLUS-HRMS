from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class SalesItemBase(BaseModel):
    trans_type: str
    item_id: int
    sales_id: int
    hscode_id: Optional[int] = None
    rate: float
    qty: float
    vat_amount: Optional[float] = None
    sd_rate: Optional[int] = None
    sd_amount: Optional[float] = None
    vatable_value: Optional[float] = None
    amount: float
    t_amount: Optional[float] = None
    vat_type: Optional[str] = None
    vat_rate: Optional[float] = 0
    trade_category: Optional[str] = None
    sales_date: date
    vds: Optional[int] = 0
    discount_rate: Optional[int] = 0
    discount_amount: Optional[float] = None
    sprice_after_discount: Optional[float] = None

class SalesItemCreate(SalesItemBase):
    pass

class SalesItemResponse(SalesItemBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True