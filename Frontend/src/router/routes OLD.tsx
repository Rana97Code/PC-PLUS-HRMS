import React, { lazy } from 'react';

// const file = lazy(() => import('../../public/assets/excel_file/'));
const Index = lazy(() => import('../pages/Index'));
const Profile = lazy(() => import('../pages/GeneralSettings/User/Profile'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const RegisterCover = lazy(() => import('../pages/Authentication/RegisterCover'));
const Customers = lazy(() => import('../pages/Relationship/Customers/Index'));
const AddCustomers = lazy(() => import('../pages/Relationship/Customers/AddCustomers'));
const EditCustomers = lazy(() => import('../pages/Relationship/Customers/EditCustomers'));
const Suppliers = lazy(() => import('../pages/Relationship/Suppliers/index'));
const AddSuppliers = lazy(() => import('../pages/Relationship/Suppliers/AddSuppliers'));
const EditSuppliers = lazy(() => import('../pages/Relationship/Suppliers/EditSuppliers'));

const AccountsSummary = lazy(() => import('../pages/Accounts/Balance/AccountsSummary'));

const Transaction = lazy(() => import('../pages/Accounts/Transaction/index'));
const TransactionAdd = lazy(() => import('../pages/Accounts/Transaction/components/AddTransaction'));
const TransactionInvoice = lazy(() => import('../pages/Invoice/AccountsInvoice/TransactionInvoice'));

const Due = lazy(() => import('../pages/Accounts/Due/index'));
const DuePay = lazy(() => import('../pages/Accounts/Due/payDue/PayDue'));
const DueInvoice = lazy(() => import('../pages/Invoice/AccountsInvoice/DueInvoice'));


const Items = lazy(() => import('../pages/Inventory/Items/index'));
const ItemsAdd = lazy(() => import('../pages/Inventory/Items/AddItems'));
const ItemsEdit = lazy(() => import('../pages/Inventory/Items/EditItems'));



const ServicePurchase = lazy(() => import('../pages/Production/Procurement/ServicePurchase/index'));
const ServicePurchaseAdd = lazy(() => import('../pages/Production/Procurement/ServicePurchase/components/addServicePurchase'));
const ImportPurchase = lazy(() => import('../pages/Production/Procurement/ImportServicePurchase/index'));
const ImportPurchaseAdd = lazy(() => import('../pages/Production/Procurement/ImportServicePurchase/components/AddImportPurchase'));


const LocalPurchase = lazy(() => import('../pages/Production/Procurement/LocalPurchase/index'));
const LocalPurchaseAdd = lazy(() => import('../pages/Production/Procurement/LocalPurchase/components/addLocalPurchase'));
const ForeignPurchase = lazy(() => import('../pages/Production/Procurement/ForeigenPurchase/index'));
const ForeignPurchaseAdd = lazy(() => import('../pages/Production/Procurement/ForeigenPurchase/components/addForeignPurchase'));
const DebitNote = lazy(() => import('../pages/Production/Procurement/DebitNote/index'));
const AddDebitNote = lazy(() => import('../pages/Production/Procurement/DebitNote/components/AddDebitNote'));
const IssueVds = lazy(() => import('../pages/Production/Procurement/IssueVDS/index'));
const IssueVdsAdd = lazy(() => import('../pages/Production/Procurement/IssueVDS/components/AddIssueVds'));
const UploadExcel = lazy(() => import('../pages/Sales/UploadExcel/index'));
const ServiceSales = lazy(() => import('../pages/Sales/ServiceSales/index'));
const AddServiceSales = lazy(() => import('../pages/Sales/ServiceSales/components/AddServiceSales'));
const ForeignSales = lazy(() => import('../pages/Sales/ForeignSales/index'));
const AddForeignSales = lazy(() => import('../pages/Sales/ForeignSales/components/AddForeignSales'));
const CreditNote = lazy(() => import('../pages/Sales/CreditNote/index'));
const AddCreditNote = lazy(() => import('../pages/Sales/CreditNote/components/AddCreditNote'));
const AdjustCreditNote = lazy(() => import('../pages/Sales/CreditNote/components/AdjustCreditNote'));
const ReceiveVds = lazy(() => import('../pages/Sales/ReceiveVds/index'));
const AddReceiveVds = lazy(() => import('../pages/Sales/ReceiveVds/components/AddReceiveVds'));
const GenerateMushak = lazy(() => import('../pages/Reports/Generate_Mushak/index'));
const Mushak61Intex = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak61/index'));
const Mushak61 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak61/mushak61'));
const Mushak62Intex = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak62/index'));
const Mushak62 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak62/mushak62'));
const Mushak610Intex = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak610/index'));
const Mushak610 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak610/mushak610'));
const Mushak91Intex = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/index'));
const Mushak91 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/mushak91'));
const TreasuryChallan = lazy(() => import('../pages/Reports/Treasury_Challan/index'));
const AddTreasuryChallan = lazy(() => import('../pages/Reports/Treasury_Challan/components/AddTreasuryChallan'));
const Payble91 = lazy(() => import('../pages/Reports/Payble91/index'));
const AddPayble91 = lazy(() => import('../pages/Reports/Payble91/components/AddPayble91'));
const PaybleVoucher = lazy(() => import('../pages/Reports/PaybleVoucher/index'));
const AddPaybleVoucher = lazy(() => import('../pages/Reports/PaybleVoucher/components/AddPaybleVoucher'));
const ReceviableVoucher = lazy(() => import('../pages/Reports/ReceivableVoucher/index'));
const AddReceviableVoucher = lazy(() => import('../pages/Reports/ReceivableVoucher/components/AddReceivableVoucher'));
const Currency = lazy(() => import('../pages/GeneralSettings/Currency/index'));
const EditCurrency = lazy(() => import('../pages/GeneralSettings/Currency/components/EditCurrency'));





const RawMatOpeningStock = lazy(() => import('../pages/Inventory/OpeningStock/RawMaterials'));
const FinishOpeningStock = lazy(() => import('../pages/Inventory/OpeningStock/FinishGoods'));
const CompanySettings = lazy(() => import('../pages/GeneralSettings/CompanySettings/index'));
const AuthorisedPerson = lazy(() => import('../pages/GeneralSettings/AuthorisedPerson/index'));
const AuthorisedPersonAdd = lazy(() => import('../pages/GeneralSettings/AuthorisedPerson/component/authorisedAdd'));
const AuthorisedPersonEdit = lazy(() => import('../pages/GeneralSettings/AuthorisedPerson/component/authorisedEdit'));
const Permission = lazy(() => import('../pages/GeneralSettings/User/permission'));
const PermissionEdit = lazy(() => import('../pages/GeneralSettings/User/components/permissionEdit'));
const Role = lazy(() => import('../pages/GeneralSettings/User/role'));
const UserRoleEdit = lazy(() => import('../pages/GeneralSettings/User/components/roleEdit'));
const User  = lazy(() => import('../pages/GeneralSettings/User/index'));
const UserEdit  = lazy(() => import('../pages/GeneralSettings/User/components/userEdit'));
const UserAdd  = lazy(() => import('../pages/GeneralSettings/User/components/userAdd'));
const UserRolePermission  = lazy(() => import('../pages/GeneralSettings/User/userRolePermission'));
const UserRole  = lazy(() => import('../pages/GeneralSettings/User/userRole'));
const UserPermission  = lazy(() => import('../pages/GeneralSettings/User/userPermission'));
const UserView  = lazy(() => import('../pages/GeneralSettings/User/components/userView'));
const Unit = lazy(() => import('../pages/GeneralSettings/Unit/index'));
const AddUnit = lazy(() => import('../pages/GeneralSettings/Unit/AddUnit'));
const EditUnit = lazy(() => import('../pages/GeneralSettings/Unit/EditUnit'));
const Costing = lazy(() => import('../pages/GeneralSettings/Costing/index'));
const CostingEdit = lazy(() => import('../pages/GeneralSettings/Costing/components/costingEdit'));
const CustomHouse = lazy(() => import('../pages/GeneralSettings/CustomHouse/index'));
const CustomHouseAdd = lazy(() => import('../pages/GeneralSettings/CustomHouse/components/addCustomHouse'));
const CustomHouseEdit = lazy(() => import('../pages/GeneralSettings/CustomHouse/components/editCustomHouse'));
const HsCode = lazy(() => import('../pages/GeneralSettings/HsCode/index'));
const CpcCode = lazy(() => import('../pages/GeneralSettings/CpcCode/index'));
const CpcAdd = lazy(() => import('../pages/GeneralSettings/CpcCode/components/cpcAdd'));
const CpcEdit = lazy(() => import('../pages/GeneralSettings/CpcCode/components/cpcEdit'));

const PurchaseInvoice = lazy(() => import('../pages/Invoice/PurchaseInvoice'));

const DebitNoteAdd = lazy(() => import('../pages/Production/Procurement/DebitNote/components/AddDebitNote'));

const ProductionBOM = lazy(() => import('../pages/Production/ProductionBOM/BOMIndex'));
const ProductionBOMAdd = lazy(() => import('../pages/Production/ProductionBOM/AddBOM'));
const ProductionBOMInvoice =lazy(() => import('../pages/Invoice/ProductionBOMInvoice'));

const ProductionWIP = lazy(() => import('../pages/Production/ProductionWIP/index'));
const ProductionWIPAdd = lazy(() => import('../pages/Production/ProductionWIP/AddProductionWIP'));
const ProductionWipInvoice =lazy(() => import('../pages/Invoice/ProductionWipInvoice'));

const LocalSales = lazy(() => import('../pages/Production/Sales/LocalSales/index'));
const LocalSalesAdd = lazy(() => import('../pages/Production/Sales/LocalSales/components/AddLocalSales'));

const ReceiveVdsAdd = lazy(() => import('../pages/Production/Sales/ReceiveVds/components/AddReceiveVds'));

const Mushak63 = lazy(() => import('../pages/Reports/Sales/Mushak-6.3'));

const Mushak91Note1 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note1'));
const Mushak91Note2 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note2'));
const Mushak91Note3 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note3'));
const Mushak91Note4 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note4'));
const Mushak91Note5 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note5'));
const Mushak91Note6 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note6'));
const Mushak91Note7 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note7'));
const Mushak91Note8 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note8'));
const Mushak91Note10 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note10'));
const Mushak91Note11 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note11'));
const Mushak91Note12 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note12'));
const Mushak91Note13 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note13'));
const Mushak91Note14 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note14'));
const Mushak91Note15 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note15'));
const Mushak91Note16 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note16'));
const Mushak91Note17 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note17'));
const Mushak91Note18 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note18'));
const Mushak91Note19 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note19'));
const Mushak91Note20 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note20'));
const Mushak91Note21 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note21'));
const Mushak91Note22 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note22'));
const Mushak91Note24 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note24'));
const Mushak91Note26 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note26'));
const Mushak91Note27 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note27'));
const Mushak91Note29 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note29'));
const Mushak91Note30 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note30'));
const Mushak91Note31 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note31'));
const Mushak91Note32 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note32'));
const Mushak91Note38 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note38'));
const Mushak91Note39 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note39'));
const Mushak91Note40 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note40'));
const Mushak91Note58 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note58'));
const Mushak91Note59 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note59'));
const Mushak91Note60 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note60'));
const Mushak91Note61 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note61'));
const Mushak91Note62 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note62'));
const Mushak91Note63 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note63'));
const Mushak91Note64 = lazy(() => import('../pages/Reports/Generate_Mushak/Mushak91/subForm/Note64'));


const routes = [
    {
        path: '/',
        element: <LoginCover />,
        layout: 'blank',
    },
    {
        path: '/login',
        element: <LoginCover />,
        layout: 'blank',
    },
    {
        path: '/register',
        element: <RegisterCover />,
        layout: 'blank',
    },
    {
        path: '/index',
        element: <Index />,
    },
    {
        path: '/pages/relationship/customers',
        element: <Customers />,
    },
    {
        path: '/pages/relationship/customers/add',
        element: <AddCustomers />,
    },
    {
        path: '/pages/relationship/customers/edit/:id',
        element: <EditCustomers />,
    },
    {
        path: '/pages/relationship/suppliers',
        element: <Suppliers />,
    },
    {
        path: '/pages/relationship/suppliers/add',
        element: <AddSuppliers />,
    },
    {
        path: '/pages/relationship/suppliers/edit/:id',
        element: <EditSuppliers />,
    },
    {
        path: '/pages/user/index',
        element: <User />,
    },
    {
        path: '/pages/user/edit',
        element: <UserEdit />,
    },
    {
        path: '/pages/user/add',
        element: <UserAdd />,
    },
    {
        path: '/pages/user/userRolePermission',
        element: <UserRolePermission />,
    },
    {
        path: '/pages/user/userRole',
        element: <UserRole />,
    },
    {
        path: '/pages/user/userPermissions',
        element: <UserPermission />,
    },
    {
        path: '/pages/user/view',
        element: <UserView />,
    },
    {
        path: '/pages/accounts/summary',
        element: <AccountsSummary />,
    },
    {
        path: '/pages/accounts/transaction',
        element: <Transaction />,
    },
    {
        path: '/pages/accounts/transaction/add',
        element: <TransactionAdd />,
    },
    {
        path: '/pages/accounts/transaction/invoice/:id',
        element: <TransactionInvoice />,
    },

    {
        path: '/pages/accounts/due',
        element: <Due />,
    },
    {
        path: '/pages/accounts/due/payment/:source_type/:source_id/:due_type',
        element: <DuePay />,
    },
    {
        path: '/pages/accounts/due/invoice/:source_type/:source_id/:due_type',
        element: <DueInvoice />,
    },
    {
        path: '/pages/inventory/items',
        element: <Items />,
    },
    {
        path: '/pages/inventory/items/add',
        element: <ItemsAdd />,
    },
    {
        path: '/pages/inventory/items/edit/:id',
        element: <ItemsEdit />,
    },
    {
        path: '/pages/purchase/debit_note/index',
        element: <DebitNote />,
    },
    {
        path: '/pages/purchase/debit_note/add',
        element: <AddDebitNote />,
    },
    {
        path: '/pages/sales/excel_sales/index',
        element: <UploadExcel />,
    },
    {
        path: '/pages/sales/service_sales/index',
        element: <ServiceSales />,
    },
    {
        path: '/pages/sales/service_sales/add',
        element: <AddServiceSales />,
    },
    {
        path: '/pages/sales/foreign_sales/index',
        element: <ForeignSales />,
    },
    {
        path: '/pages/sales/foreign_sales/add',
        element: <AddForeignSales />,
    },
    {
        path: '/pages/sales/credit_note/index',
        element: <CreditNote />,
    },
    {
        path: '/pages/sales/credit_note/add',
        element: <AddCreditNote />,
    },
    {
        path: '/pages/sales/credit_note/adjust_credit_note',
        element: <AdjustCreditNote />,
    },
    {
        path: '/pages/sales/receive_vds/index',
        element: <ReceiveVds />,
    },
    {
        path: '/pages/sales/receive_vds/add',
        element: <AddReceiveVds />,
    },





    {
        path: '/pages/inventory/opening/rawmaterials',
        element: <RawMatOpeningStock />,
    },
    {
        path: '/pages/inventory/opening/finishgoods',
        element: <FinishOpeningStock />,
    },
    {
        path: '/pages/procurment/local_purchase/index',
        element: <LocalPurchase />,
    },
    {
        path: '/pages/procurment/local_purchase/add',
        element: <LocalPurchaseAdd />,
    },
    {
        path: '/pages/invoice/purchase_invoice/:id',
        element: <PurchaseInvoice />,
    },
    {
        path: '/pages/procurment/foreign_purchase/index',
        element: <ForeignPurchase />,
    },
    {
        path: '/pages/procurment/foreign_purchase/add',
        element: <ForeignPurchaseAdd />,
    },
    {
        path: '/pages/procurment/service_purchase/index',
        element: <ServicePurchase />,
    },
    {
        path: '/pages/procurment/service_purchase/add',
        element: <ServicePurchaseAdd />,
    },
    {
        path: '/pages/procurment/import_purchase/index',
        element: <ImportPurchase />,
    },
    {
        path: '/pages/procurment/import_purchase/add',
        element: <ImportPurchaseAdd />,
    },
    {
        path: '/pages/procurment/debitNote/index',
        element: <DebitNote />,
    },
    {
        path: '/pages/procurment/debitNote/add',
        element: <DebitNoteAdd />,
    },
    {
        path: '/pages/procurment/issueVds/index',
        element: <IssueVds />,
    },
    {
        path: '/pages/procurment/issueVds/add',
        element: <IssueVdsAdd />,
    },

    {
        path: '/pages/production_bom/index',
        element: <ProductionBOM />,
    },
    {
        path: '/pages/production_bom/add',
        element: <ProductionBOMAdd />,
    },
    {
        path: '/pages/invoice/production_bom/:id',
        element: <ProductionBOMInvoice />,
    },
    {
        path: '/pages/production_wip/index',
        element: <ProductionWIP />,
    },
    {
        path: '/pages/production_wip/add',
        element: <ProductionWIPAdd />,
    },
    {
        path: '/pages/invoice/production_invoice/:id',
        element: <ProductionWipInvoice />,
    },
    {
        path: '/pages/sales/local_sales/index',
        element: <LocalSales />,
    },
    {
        path: '/pages/sales/local_sales/add',
        element: <LocalSalesAdd />,
    },
    // {
    //     path: '/pages/sales/creditNote/index',
    //     element: <CreditNote />,
    // },
    // {
    //     path: '/pages/sales/creditNote/add',
    //     element: <CreditNoteAdd />,
    // },
    {
        path: '/pages/sales/receiveVds/index',
        element: <ReceiveVds />,
    },
    {
        path: '/pages/sales/receiveVds/add',
        element: <ReceiveVdsAdd />,
    },

    

    // Reports
    {
        path: '/pages/reports/generate_mushak/index',
        element: <GenerateMushak />,
    },
    {
        path: '/pages/report/mushak61/index',
        element: <Mushak61Intex />,
    },
    {
        path: '/pages/report/mushak61/:data',
        element: <Mushak61 />,
    },
    {
        path: '/pages/report/mushak62/index',
        element: <Mushak62Intex />,
    },
    {
        path: '/pages/report/mushak62/:data',
        element: <Mushak62 />,
    },
    {
        path: '/pages/report/mushak610/index',
        element: <Mushak610Intex />,
    },
    {
        path: '/pages/report/mushak610/:data',
        element: <Mushak610 />,
    },
    {
        path: '/pages/report/mushak91/index',
        element: <Mushak91Intex />,
    },
    {
        path: '/pages/report/mushak91/:data',
        element: <Mushak91 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_1',
        element: <Mushak91Note1 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_2',
        element: <Mushak91Note2 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_3',
        element: <Mushak91Note3 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_4',
        element: <Mushak91Note4 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_5',
        element: <Mushak91Note5 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_6',
        element: <Mushak91Note6 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_7',
        element: <Mushak91Note7 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_8',
        element: <Mushak91Note8 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_10',
        element: <Mushak91Note10 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_11',
        element: <Mushak91Note11 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_12',
        element: <Mushak91Note12 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_13',
        element: <Mushak91Note13 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_14',
        element: <Mushak91Note14 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_15',
        element: <Mushak91Note15 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_16',
        element: <Mushak91Note16 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_17',
        element: <Mushak91Note17 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_18',
        element: <Mushak91Note18 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_19',
        element: <Mushak91Note19 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_20',
        element: <Mushak91Note20 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_21',
        element: <Mushak91Note21 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_22',
        element: <Mushak91Note22 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_24',
        element: <Mushak91Note24 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_26',
        element: <Mushak91Note26 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_27',
        element: <Mushak91Note27 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_29',
        element: <Mushak91Note29 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_30',
        element: <Mushak91Note30 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_31',
        element: <Mushak91Note31 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_32',
        element: <Mushak91Note32 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_38',
        element: <Mushak91Note38 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_39',
        element: <Mushak91Note39 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_40',
        element: <Mushak91Note40 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_58',
        element: <Mushak91Note58 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_59',
        element: <Mushak91Note59 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_60',
        element: <Mushak91Note60 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_61',
        element: <Mushak91Note61 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_62',
        element: <Mushak91Note62 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_63',
        element: <Mushak91Note63 />,
    },
    {
        path: '/pages/report/mushak91/subform/note_64',
        element: <Mushak91Note64 />,
    },
    {
        path: '/pages/reports/treasury_challan/index',
        element: <TreasuryChallan />,
    },
    {
        path: '/pages/reports/treasury_challan/add',
        element: <AddTreasuryChallan />,
    },
    {
        path: '/pages/reports/payble91/index',
        element: <Payble91 />,
    },
    {
        path: '/pages/reports/payble91/add',
        element: <AddPayble91 />,
    },
    {
        path: '/pages/reports/payble_voucher/index',
        element: <PaybleVoucher />,
    },
    {
        path: '/pages/reports/payble_voucher/add',
        element: <AddPaybleVoucher />,
    },
    {
        path: '/pages/reports/receivable_voucher/index',
        element: <ReceviableVoucher />,
    },
    {
        path: '/pages/reports/receivable_voucher/add',
        element: <AddReceviableVoucher />,
    },




    //Company Settings
    {
        path: '/pages/settings/Company_Settings',
        element: <CompanySettings />,
    },
    {
        path: '/pages/settings/authorised_person/index',
        element: <AuthorisedPerson />,
    },
    {
        path: '/pages/settings/authorised_person/add',
        element: <AuthorisedPersonAdd />,
    },
    {
        path: '/pages/settings/authorised_person/edit/:id',
        element: <AuthorisedPersonEdit />,
    },
    {
        path: '/pages/settings/unit',
        element: <Unit />,
    },
    {
        path: '/pages/settings/unit/add',
        element: <AddUnit />,
    },
    {
        path: '/pages/settings/unit/edit/:id',
        element: <EditUnit />,
    },
    {
        path: '/pages/settings/costing',
        element: <Costing />,
    },
    {
        path: '/pages/settings/costing/edit/:id',
        element: <CostingEdit />,
    },
    {
        path: '/pages/settings/custom_house',
        element: <CustomHouse />,
    },
    {
        path: '/pages/settings/custom_house/add',
        element: <CustomHouseAdd />,
    },
    {
        path: '/pages/settings/custom_house/edit/:id',
        element: <CustomHouseEdit />,
    },

    {
        path: '/pages/settings/currency/index',
        element: <Currency />,
    },
    {
        path: '/pages/settings/currency/edit/:id',
        element: <EditCurrency />,
    },

    {
        path: '/pages/hscode/list',
        element: <HsCode />,
    },

    {
        path: '/pages/cpccode/list',
        element: <CpcCode />,
    },
    {
        path: '/pages/cpccode/add',
        element: <CpcAdd />,
    },
    {
        path: '/pages/cpccode/edit/:id',
        element: <CpcEdit />,
    },
    {
        path: '/pages/user/profile',
        element: <Profile />,
    },
    {
        path: '/pages/user/role',
        element: <Role />,
    },
    {
        path: '/pages/user/userRole/edit',
        element: <UserRoleEdit />,
    },
    {
        path: '/pages/user/permissions',
        element: <Permission />,
    },
    {
        path: '/pages/user/permissions/edit',
        element: <PermissionEdit />,
    },
    {
        path: '/pages/report/sales/Mushak63/:id',
        element: <Mushak63 />,
    }
];
export { routes };