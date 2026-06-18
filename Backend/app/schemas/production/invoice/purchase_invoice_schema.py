from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional

class PurchaseItemInvoiceSchema(BaseModel):
    item_name: Optional[str] = None
    hs_code: Optional[str] = None
    qty: Optional[float] = None
    rate: Optional[float] = None
    access_amount: Optional[float] = None
    sd_amount: Optional[float] = None
    vatable_value: Optional[float] = None
    vat_amount: Optional[float] = None
    item_total: Optional[float] = None

class PurchaseInvoiceSchema(BaseModel):
    invoice_no: Optional[str] = None
    vendor_inv: Optional[str] = None
    supplier_name: Optional[str] = None
    supplier_email: Optional[str] = None
    supplier_phone: Optional[str] = None
    supplier_type: Optional[int] = None
    s_address: Optional[str] = None
    s_tin: Optional[str] = None
    s_bin_nid: Optional[str] = None
    country_name: Optional[str] = None
    chalan_date: Optional[date] = None

    items: List[PurchaseItemInvoiceSchema]