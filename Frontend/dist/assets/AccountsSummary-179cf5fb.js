import{u as B,a as O,r,s as M,j as a,b as e,N as F}from"./index-b3ab9e8c.js";import{N as H}from"./index-5b5bc790.js";import{s as U}from"./sortBy-222a53d8.js";import{a as f}from"./axios-9eb6bd93.js";import{Z as G}from"./react-to-print-dbb284e5.js";const W=()=>{const N=B(),v=O(t=>t.auth).token,g=[10,20,30,50,100],[c,C]=r.useState({}),[x,P]=r.useState([]),[l,p]=r.useState([]),[i,w]=r.useState(""),[D,S]=r.useState(!1),[b,y]=r.useState(1),[o,T]=r.useState(g[0]),[E,j]=r.useState([]),[d,A]=r.useState(""),[m,R]=r.useState({columnAccessor:"total_amount_in",direction:"desc"});r.useEffect(()=>{N(M("Accounts Summary"))},[N]),r.useEffect(()=>{v&&(f.get("/accounts/latest-balance").then(t=>C(t.data||{})).catch(t=>console.error("Error fetching balance:",t)),f.get("/accounts/investor-contribution").then(t=>P(t.data||[])).catch(t=>console.error("Error fetching investor contribution:",t)))},[v]);const u=r.useMemo(()=>{const t=d.toLowerCase();return x.filter(n=>{var s,h,_;return((s=n.investor_name)==null?void 0:s.toLowerCase().includes(t))||((h=n.total_amount_in)==null?void 0:h.toString().includes(t))||((_=n.total_transaction)==null?void 0:_.toString().includes(t))})},[x,d]);r.useEffect(()=>{const t=U(u,m.columnAccessor),n=m.direction==="desc"?t.reverse():t,s=(b-1)*o,h=s+o;j(n.slice(s,h))},[u,m,b,o]),r.useEffect(()=>{y(1)},[o,d]);const L=async t=>{w(t),p([]),S(!0);try{const n=encodeURIComponent(t),s=await f.get(`/accounts/investor-contribution/${n}`);p(s.data||[])}catch(n){console.error("Error fetching investor details:",n)}},$=()=>{S(!1),w(""),p([])},I=r.useRef(null),z=G({contentRef:I,documentTitle:`Investment-Details-${i}`}),k=l.reduce((t,n)=>t+Number(n.amount_in||0),0).toFixed(2);return a("div",{children:[e("div",{className:"panel flex items-center justify-between flex-wrap gap-4 text-black print:hidden",children:e("h2",{className:"text-xl font-bold",children:"Accounts Summary"})}),a("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-5 pt-5 print:hidden",children:[a("div",{className:"panel bg-white",children:[e("h5",{className:"font-semibold text-sm",children:"Current Balance"}),e("h2",{className:"text-2xl font-bold text-primary",children:c.current_balance||0})]}),a("div",{className:"panel bg-white",children:[e("h5",{className:"font-semibold text-sm",children:"Current Cost"}),e("h2",{className:"text-2xl font-bold text-danger",children:c.current_cost||0})]}),a("div",{className:"panel bg-white",children:[e("h5",{className:"font-semibold text-sm",children:"Payable Due"}),e("h2",{className:"text-2xl font-bold text-warning",children:c.payable_due||0})]}),a("div",{className:"panel bg-white",children:[e("h5",{className:"font-semibold text-sm",children:"Receivable Due"}),e("h2",{className:"text-2xl font-bold",children:c.receivable_due||0})]})]}),e("div",{className:"pt-5 print:hidden",children:a("div",{className:"panel col-span-3",children:[a("div",{className:"flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5",children:[a("div",{children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Investor Contribution"}),e("p",{className:"text-sm text-gray-500",children:"Grouped by investor name and total amount in"})]}),e("input",{type:"text",className:"h-12 w-56 border border-slate-300 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none",placeholder:"Search investor...",value:d,onChange:t=>A(t.target.value)})]}),e("div",{className:"datatables",children:e(H,{highlightOnHover:!0,className:"whitespace-nowrap table-hover",records:E,columns:[{accessor:"investor_name",title:"Investor Name",sortable:!0,render:({investor_name:t})=>e("button",{type:"button",className:"text-cyan-600 font-semibold hover:underline",onClick:()=>L(t),children:t})},{accessor:"total_amount_in",title:"Total Investment",sortable:!0,render:({total_amount_in:t})=>e("span",{className:"font-bold",children:Number(t||0).toFixed(2)})},{accessor:"total_transaction",title:"Total Transaction",sortable:!0}],totalRecords:u.length,recordsPerPage:o,page:b,onPageChange:y,recordsPerPageOptions:g,onRecordsPerPageChange:T,sortStatus:m,onSortStatusChange:R,minHeight:200,paginationText:({from:t,to:n,totalRecords:s})=>`Showing ${t} to ${n} of ${s} entries`})})]})}),D&&a("div",{className:"fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4",children:[a("div",{ref:I,className:"investment-print-area bg-white text-black rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto",children:[a("div",{className:"flex items-center justify-between border-b p-5 no-print",children:[a("div",{children:[a("h5",{className:"font-semibold text-lg",children:["Investment Details: ",i]}),e("p",{className:"text-sm text-gray-500",children:"All amount-in transactions of this investor"})]}),a("div",{className:"flex gap-2",children:[e("button",{type:"button",className:"btn btn-primary btn-sm",onClick:z,children:"Print"}),e("button",{type:"button",className:"btn btn-danger btn-sm",onClick:$,children:"✕"})]})]}),a("div",{className:"p-5",children:[a("div",{className:"flex justify-between items-center border-b pb-4 mb-6",children:[a("div",{className:"flex items-center gap-4",children:[e("img",{src:"/assets/images/auth/logo.jpeg",alt:"PC Plus Solution",className:"w-24 h-24 object-contain"}),a("div",{children:[e("h2",{className:"text-2xl font-bold text-[#0064C8]",children:"PC PLUS SOLUTION LTD"}),e("p",{className:"text-sm",children:"House-34, Block-A, Road-18, Banani, Dhaka"}),e("p",{className:"text-sm",children:"Email: info@pcplusbd.com"}),e("p",{className:"text-sm",children:"Phone: +8801772699434"})]})]}),a("div",{className:"text-right",children:[e("h3",{className:"text-xl font-bold text-[#0064C8]",children:"INVESTMENT DETAILS"}),a("p",{className:"text-sm",children:["Investor: ",e("strong",{children:i})]}),a("p",{className:"text-sm",children:["Print Date: ",new Date().toLocaleDateString()]})]})]}),a("div",{className:"mb-4 grid grid-cols-1 md:grid-cols-3 gap-4",children:[a("div",{className:"border rounded p-3",children:[e("p",{className:"text-sm text-gray-500",children:"Investor Name"}),e("h4",{className:"font-bold",children:i})]}),a("div",{className:"border rounded p-3",children:[e("p",{className:"text-sm text-gray-500",children:"Total Transaction"}),e("h4",{className:"font-bold",children:l.length})]}),a("div",{className:"border rounded p-3",children:[e("p",{className:"text-sm text-gray-500",children:"Total Investment"}),e("h4",{className:"font-bold",children:k})]})]}),e("div",{className:"overflow-x-auto investment-table-wrapper",children:a("table",{className:"investment-table w-full table-hover whitespace-nowrap border",children:[e("thead",{children:a("tr",{className:"investment-header",children:[e("th",{className:"p-2 border",children:"SL"}),e("th",{className:"p-2 border",children:"Invoice"}),e("th",{className:"p-2 border",children:"Date"}),e("th",{className:"p-2 border",children:"Type"}),e("th",{className:"p-2 border",children:"Investor"}),e("th",{className:"p-2 border",children:"To"}),e("th",{className:"p-2 border",children:"Amount In"}),e("th",{className:"p-2 border",children:"Note"})]})}),e("tbody",{children:l.length>0?l.map((t,n)=>a("tr",{children:[e("td",{className:"p-2 border",children:n+1}),e("td",{className:"p-2 border",children:e(F,{to:`/pages/accounts/transaction/invoice/${t.id}`,className:"text-cyan-500 print:text-black",children:t.transaction_invoice})}),e("td",{className:"p-2 border",children:t.transaction_date}),e("td",{className:"p-2 border",children:t.transaction_type}),e("td",{className:"p-2 border",children:t.transaction_by}),e("td",{className:"p-2 border",children:t.transaction_to}),e("td",{className:"p-2 border font-bold text-right",children:Number(t.amount_in||0).toFixed(2)}),e("td",{className:"p-2 border whitespace-normal",children:t.transaction_notes})]},`${t.id}-${n}`)):e("tr",{children:e("td",{className:"p-4 border text-center",colSpan:8,children:"No investment details found"})})}),e("tfoot",{children:a("tr",{className:"investment-footer",children:[e("td",{className:"p-2 border text-right",colSpan:6,children:"Total"}),e("td",{className:"p-2 border text-right",children:k}),e("td",{className:"p-2 border"})]})})]})}),a("div",{className:"grid grid-cols-2 gap-10 mt-16",children:[e("div",{children:e("div",{className:"border-t border-black pt-2 text-center",children:"Prepared By"})}),e("div",{children:e("div",{className:"border-t border-black pt-2 text-center",children:"Authorized Signature"})})]})]})]}),e("style",{children:`
                            .investment-header {
                                background: #0064C8 !important;
                                color: #ffffff !important;
                            }

                            .investment-footer {
                                background: #0064C8 !important;
                                color: #ffffff !important;
                                font-weight: bold;
                            }

                            @media print {
                                body {
                                    background: white !important;
                                }

                                * {
                                    -webkit-print-color-adjust: exact !important;
                                    print-color-adjust: exact !important;
                                }

                                .no-print {
                                    display: none !important;
                                }

                                .investment-print-area {
                                    width: 100% !important;
                                    max-width: 100% !important;
                                    max-height: none !important;
                                    overflow: visible !important;
                                    padding: 0 !important;
                                    margin: 0 !important;
                                    box-shadow: none !important;
                                    border-radius: 0 !important;
                                    background: white !important;
                                    color: black !important;
                                }

                                .investment-table-wrapper {
                                    overflow: visible !important;
                                }

                                .investment-table {
                                    width: 100% !important;
                                    table-layout: fixed !important;
                                    border-collapse: collapse !important;
                                    font-size: 10px !important;
                                }

                                .investment-table th,
                                .investment-table td {
                                    padding: 5px !important;
                                    word-break: break-word !important;
                                    white-space: normal !important;
                                }

                                .investment-header th {
                                    background: #0064C8 !important;
                                    color: #ffffff !important;
                                    font-weight: bold !important;
                                }

                                .investment-footer td {
                                    background: #0064C8 !important;
                                    color: #ffffff !important;
                                    font-weight: bold !important;
                                }

                                @page {
                                    size: A4 landscape;
                                    margin: 10mm;
                                }
                            }
                        `})]})]})};export{W as default};
