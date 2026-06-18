from fastapi import APIRouter
from app.routes.auth_router import auth_router
from app.routes.user_router import user_router
from app.routes.general_settings.unit_router import unit_router
from app.routes.general_settings.costing_router import costing_router
from app.routes.country_route import country_router
from app.routes.relationship.customer_router import customer_router
from app.routes.relationship.supplier_router import supplier_router
from app.routes.general_settings.hscode_router import hscode_route
from app.routes.inventory.item_router import item_route
# from app.routes.general_settings.custom_house_router import custom_house_router
from app.routes.general_settings.authorised_person_router import authorised_person_router
from app.routes.general_settings.company_settings_router import company_settings_router
from app.routes.inventory.item_router import item_route
# from app.routes.inventory.opening_stock_router import Opening_stock_router
from app.routes.production.sales.localSales_router import sales_router
from app.routes.production.sales.creditnote_router import Creditnote_router
from app.routes.production.sales.receiveVds_router import ReceiveVds_router
from app.routes.production.wastage.wastage_router import Wastage_router 
from app.routes.production.procurement.service_purchase_router import Service_purchase_router  
# from app.routes.production.procurement.foreign_purchase_router import Foreign_purchase_router  
from app.routes.production.procurement.local_purchase_router import Local_purchase_router  
# from app.routes.general_settings.cpc_router import cpc_router  
from app.routes.invoice.purchase_invoice_route import purchase_invoice_router 
from app.routes.accounts.transaction_router import Transaction_router 

 




router = APIRouter()



router.include_router(auth_router)
router.include_router(user_router)
router.include_router(country_router)
router.include_router(customer_router)
router.include_router(supplier_router)
router.include_router(hscode_route)
router.include_router(unit_router)
router.include_router(item_route)
router.include_router(costing_router)
# router.include_router(custom_house_router)
router.include_router(authorised_person_router)
router.include_router(company_settings_router)
# router.include_router(Opening_stock_router)
router.include_router(sales_router)
router.include_router(Creditnote_router)
router.include_router(ReceiveVds_router)
router.include_router(Wastage_router)
# router.include_router(Foreign_purchase_router)
router.include_router(Service_purchase_router)
router.include_router(Local_purchase_router)
# router.include_router(cpc_router)
router.include_router(purchase_invoice_router)
router.include_router(Transaction_router)


