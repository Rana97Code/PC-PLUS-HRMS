from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional

class foreignPurchaseItemInsertSchema(BaseModel):
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
    item_cd: Optional[float] = None
    cd_amount: Optional[float] = None
    item_at: Optional[float] = None
    at_amount: Optional[float] = None
    item_rd: Optional[float] = None
    rd_amount: Optional[float] = None
    vds: Optional[int] = None
    rebate: Optional[int] = None
    item_total: Optional[float] = None
   

#foreign purchase insert Schema  
class ForeignPurchaseInsertSchema(BaseModel):
    invoice_no: Optional[str] = None
    vendor_inv: Optional[str] = None
    supplier_id: Optional[int] = None
    purchase_type: Optional[int] = None
    purchase_category: Optional[int] = None
    lc_number: Optional[str] = None
    custom_house_id: Optional[int] = None
    country_origin: Optional[int] = None
    data_source: Optional[str] = None
    cpc_code_id: Optional[int] = None
    grand_total: Optional[float] = None
    total_tax: Optional[float] = None
    total_at: Optional[float] = None
    fiscal_year: Optional[int] = None
    notes: Optional[str] = None
    user_id: Optional[int] = None
    lc_date: Optional[date] = None
    entry_date: Optional[date] = None
    chalan_date: Optional[date] = None

    items: List[foreignPurchaseItemInsertSchema]


class ForeignPurchaseFetch(BaseModel):
    invoice_no: Optional[str] = None
    grand_total: Optional[float] = None
    supplier_name: Optional[str] = None
    lc_number: Optional[str] = None
    supplier_id: Optional[int] = None

    # class Config:
    #     from_attributes = True

class ItemDetailsModel(BaseModel):
    id: int
    item_name: str
    hs_code_id: int
    hs_code: str
    sd: int
    vat: int
    cd: int
    ait: int
    rd: int
    at: int
    tti: float

    # item = db.query(Item.id, Item.item_name, Item.hs_code_id, Item.hs_code,Hscode.sd, Hscode.vat, Hscode.cd, Hscode.ait, Hscode.rd, Hscode.at, Hscode.tti)

    class Config:
        from_mode = True






