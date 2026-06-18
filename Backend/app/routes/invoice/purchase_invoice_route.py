from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session, joinedload
from app.models.inventory.item_model import Item
from app.models.relationship.supplier_model import Supplier
from app.models.country_model import Country
from app.models.production.procurement.Purchase_model import Purchase, Purchase_item
from app.schemas.production.invoice.purchase_invoice_schema import PurchaseInvoiceSchema , PurchaseItemInvoiceSchema
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os



#route define
purchase_invoice_router = APIRouter()


@purchase_invoice_router.get("/pcplus/api/purchase/purchase_invoice/{purchase_id}",response_model=PurchaseInvoiceSchema, dependencies=[Depends(get_current_active_user)])
async def get_itm(purchase_id:int,db:Session=Depends(get_db)):
    
    u = db.query(Purchase, Supplier, Country)\
        .join(Supplier, Purchase.supplier_id == Supplier.id)\
        .join(Country, Supplier.country_id == Country.id)\
        .filter(Purchase.id == purchase_id).first()

    if not u:
        raise HTTPException(status_code=404, detail="Purchase not found")
    # print(u)
    # Map the query result to the response model
    purchase_invoice = PurchaseInvoiceSchema(
        invoice_no=u.Purchase.invoice_no,
        vendor_inv=u.Purchase.vendor_inv,
        supplier_name=u.Supplier.supplier_name,
        supplier_email=u.Supplier.supplier_email,
        supplier_phone=u.Supplier.supplier_phone,
        supplier_type=u.Supplier.supplier_type,
        s_address=u.Supplier.s_address,
        s_tin=u.Supplier.s_tin,
        s_bin_nid=u.Supplier.s_bin_nid,
        country_name=u.Country.country_name,
        chalan_date=u.Purchase.chalan_date,
        items=[
            PurchaseItemInvoiceSchema(
                item_name=item.item.item_name,  # assuming item name is accessible like this
                hs_code=item.item.hs_code,  # assuming hs_code is part of the item
                qty=item.qty,
                rate=item.rate,
                access_amount=item.access_amount,
                sd_amount=item.sd_amount,
                vatable_value=item.vatable_value,
                vat_amount=item.vat_amount,
                item_total=item.item_total
            )
            for item in u.Purchase.purchase_items
        ]
    )
    return purchase_invoice




    







