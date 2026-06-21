from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional
from decimal import Decimal

class TransactionInsertSchema(BaseModel):
    transaction_date: date
    transaction_type: Optional[str] = None
    transaction_by: Optional[str] = None
    transaction_to: Optional[str] = None
    amount_in: float = 0
    amount_out: float = 0
    cost: float = 0
    due_amount: float = 0
    return_amount: float = 0
    transaction_notes: Optional[str] = None
    created_by: Optional[str] = None

class TransactionUpdateSchema(BaseModel):
    transaction_date: Optional[date] = None
    transaction_type: Optional[str] = None
    transaction_by: Optional[str] = None
    transaction_to: Optional[str] = None
    transaction_invoice: Optional[str] = None
    amount_in: Optional[float] = None
    amount_out: Optional[float] = None
    cost: Optional[float] = None
    due_amount: Optional[float] = None
    return_amount: Optional[float] = None
    transaction_notes: Optional[str] = None
    updated_by: Optional[str] = None


class TransactionFetchSchema(BaseModel):
    transaction_invoice: Optional[str] = None
    transaction_type: Optional[str] = None
    transaction_date: Optional[date] = None
    cost: Optional[float] = None
    transaction_by: Optional[str] = None


class TransactionResponseSchema(BaseModel):
    id: int
    transaction_date: date
    transaction_type: Optional[str]
    transaction_by: Optional[str]
    transaction_to: Optional[str]
    transaction_invoice: Optional[str]
    amount_in: float
    amount_out: float
    cost: float
    due_amount: float
    return_amount: float
    transaction_notes: Optional[str]
    created_at: datetime
    created_by: Optional[str]
    updated_at: datetime
    updated_by: Optional[str]

    class Config:
        from_attributes = True