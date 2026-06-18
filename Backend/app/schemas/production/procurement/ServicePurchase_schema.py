from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional

class ServicePurchaseItemInsertSchema(BaseModel):
    item_id: Optional[int] = None
    hs_code: Optional[str] = None
    hs_code_id: Optional[int] = None
    qty: Optional[float] = None
    rate: Optional[float] = None
    access_amount: Optional[float] = None
    item_sd: Optional[float] = None
    sd_amount: Optional[float] = None
    vatable_value: Optional[float] = None
    vat_type: Optional[int] = None
    vat_rate: Optional[float] = None
    vat_amount: Optional[float] = None
    vds: Optional[int] = None
    rebate: Optional[int] = None
    item_total: Optional[float] = None

   

#Service purchase insert Schema  
class ServicePurchaseInsertSchema(BaseModel):
    purchase_type: Optional[int] = None
    purchase_category: Optional[int] = None
    supplier_id: Optional[int] = None
    entry_date: Optional[date] = None
    chalan_number: Optional[str] = None
    chalan_date: Optional[date] = None
    fiscal_year: Optional[int] = None
    total_tax: Optional[float] = None
    total_sd: Optional[float] = None
    grand_total: Optional[float] = None
    notes: Optional[str] = None
    items: List[ServicePurchaseItemInsertSchema]


    #Service purchase insert Schema  
class ServicePurchaseFetch(BaseModel):
    invoice_no: Optional[str] = None
    vendor_inv: Optional[str] = None
    chalan_date: Optional[date] = None
    grand_total: Optional[float] = None

