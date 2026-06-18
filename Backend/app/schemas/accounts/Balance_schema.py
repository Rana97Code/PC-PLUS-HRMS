from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional
from decimal import Decimal

class BalanceCreate(BaseModel):
    previous_cost: float = 0
    current_cost: float = 0
    previous_due: float = 0
    current_due: float = 0
    previous_balance: float = 0
    current_balance: float = 0
    status: Optional[int] = 0
    created_by: Optional[int] = None

class BalanceUpdate(BaseModel):
    previous_cost: Optional[float] = None
    current_cost: Optional[float] = None
    previous_due: Optional[float] = None
    current_due: Optional[float] = None
    previous_balance: Optional[float] = None
    current_balance: Optional[float] = None
    status: Optional[int] = None
    created_by: Optional[int] = None

class BalanceResponse(BaseModel):
    id: int
    previous_cost: Optional[float]
    current_cost: Optional[float]
    previous_due: Optional[float]
    current_due: Optional[float]
    previous_balance: Optional[float]
    current_balance: Optional[float]
    status: Optional[int]
    created_by: Optional[int]
    created_at: date

    class Config:
        from_attributes = True