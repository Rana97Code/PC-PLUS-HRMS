import{u as M,r as n,U as F,s as H,c as g,a,j as e,N as G}from"./index-662d3983.js";import{N as Z}from"./index-e7eb9796.js";import{s as q}from"./sortBy-34555ae5.js";import{Z as V}from"./react-to-print-98b2a91c.js";const X=()=>{const x=M(),b=n.useContext(F),u=b.headers,c=b.base_url,w=b.token,y=[10,20,30,50,100],[l,T]=n.useState({}),[S,E]=n.useState([]),[i,f]=n.useState([]),[d,I]=n.useState(""),[j,k]=n.useState(!1),[N,C]=n.useState(1),[o,A]=n.useState(y[0]),[R,$]=n.useState([]),[m,L]=n.useState(""),[h,z]=n.useState({columnAccessor:"total_amount_in",direction:"desc"});n.useEffect(()=>{x(H("Accounts Summary"))},[x]),n.useEffect(()=>{w&&(g.get(`${c}/accounts/latest-balance`,{headers:u}).then(t=>T(t.data||{})).catch(t=>console.error("Error fetching balance:",t)),g.get(`${c}/accounts/investor-contribution`,{headers:u}).then(t=>E(t.data||[])).catch(t=>console.error("Error fetching investor contribution:",t)))},[w,c]);const v=n.useMemo(()=>{const t=m.toLowerCase();return S.filter(r=>{var s,p,D;return((s=r.investor_name)==null?void 0:s.toLowerCase().includes(t))||((p=r.total_amount_in)==null?void 0:p.toString().includes(t))||((D=r.total_transaction)==null?void 0:D.toString().includes(t))})},[S,m]);n.useEffect(()=>{const t=q(v,h.columnAccessor),r=h.direction==="desc"?t.reverse():t,s=(N-1)*o,p=s+o;$(r.slice(s,p))},[v,h,N,o]),n.useEffect(()=>{C(1)},[o,m]);const B=async t=>{I(t),f([]),k(!0);try{const r=encodeURIComponent(t),s=await g.get(`${c}/accounts/investor-contribution/${r}`,{headers:u});f(s.data||[])}catch(r){console.error("Error fetching investor details:",r)}},O=()=>{k(!1),I(""),f([])},_=n.useRef(null),U=V({contentRef:_,documentTitle:`Investment-Details-${d}`}),P=i.reduce((t,r)=>t+Number(r.amount_in||0),0).toFixed(2);return a("div",{children:[e("div",{className:"panel flex items-center justify-between flex-wrap gap-4 text-black print:hidden",children:e("h2",{className:"text-xl font-bold",children:"Accounts Summary"})}),a("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-5 pt-5 print:hidden",children:[a("div",{className:"panel bg-white",children:[e("h5",{className:"font-semibold text-sm",children:"Current Balance"}),e("h2",{className:"text-2xl font-bold text-primary",children:l.current_balance||0})]}),a("div",{className:"panel bg-white",children:[e("h5",{className:"font-semibold text-sm",children:"Current Cost"}),e("h2",{className:"text-2xl font-bold text-danger",children:l.current_cost||0})]}),a("div",{className:"panel bg-white",children:[e("h5",{className:"font-semibold text-sm",children:"Payable Due"}),e("h2",{className:"text-2xl font-bold text-warning",children:l.payable_due||0})]}),a("div",{className:"panel bg-white",children:[e("h5",{className:"font-semibold text-sm",children:"Receivable Due"}),e("h2",{className:"text-2xl font-bold",children:l.receivable_due||0})]})]}),e("div",{className:"pt-5 print:hidden",children:a("div",{className:"panel col-span-3",children:[a("div",{className:"flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5",children:[a("div",{children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Investor Contribution"}),e("p",{className:"text-sm text-gray-500",children:"Grouped by investor name and total amount in"})]}),e("input",{type:"text",className:"h-12 w-56 border border-slate-300 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none",placeholder:"Search investor...",value:m,onChange:t=>L(t.target.value)})]}),e("div",{className:"datatables",children:e(Z,{highlightOnHover:!0,className:"whitespace-nowrap table-hover",records:R,columns:[{accessor:"investor_name",title:"Investor Name",sortable:!0,render:({investor_name:t})=>e("button",{type:"button",className:"text-cyan-600 font-semibold hover:underline",onClick:()=>B(t),children:t})},{accessor:"total_amount_in",title:"Total Investment",sortable:!0,render:({total_amount_in:t})=>e("span",{className:"font-bold",children:Number(t||0).toFixed(2)})},{accessor:"total_transaction",title:"Total Transaction",sortable:!0}],totalRecords:v.length,recordsPerPage:o,page:N,onPageChange:C,recordsPerPageOptions:y,onRecordsPerPageChange:A,sortStatus:h,onSortStatusChange:z,minHeight:200,paginationText:({from:t,to:r,totalRecords:s})=>`Showing ${t} to ${r} of ${s} entries`})})]})}),j&&a("div",{className:"fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4",children:[a("div",{ref:_,className:"investment-print-area bg-white text-black rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto",children:[a("div",{className:"flex items-center justify-between border-b p-5 no-print",children:[a("div",{children:[a("h5",{className:"font-semibold text-lg",children:["Investment Details: ",d]}),e("p",{className:"text-sm text-gray-500",children:"All amount-in transactions of this investor"})]}),a("div",{className:"flex gap-2",children:[e("button",{type:"button",className:"btn btn-primary btn-sm",onClick:U,children:"Print"}),e("button",{type:"button",className:"btn btn-danger btn-sm",onClick:O,children:"✕"})]})]}),a("div",{className:"p-5",children:[a("div",{className:"flex justify-between items-center border-b pb-4 mb-6",children:[a("div",{className:"flex items-center gap-4",children:[e("img",{src:"/assets/images/auth/logo.jpeg",alt:"PC Plus Solution",className:"w-24 h-24 object-contain"}),a("div",{children:[e("h2",{className:"text-2xl font-bold text-[#0064C8]",children:"PC PLUS SOLUTION LTD"}),e("p",{className:"text-sm",children:"House-34, Block-A, Road-18, Banani, Dhaka"}),e("p",{className:"text-sm",children:"Email: info@pcplusbd.com"}),e("p",{className:"text-sm",children:"Phone: +8801772699434"})]})]}),a("div",{className:"text-right",children:[e("h3",{className:"text-xl font-bold text-[#0064C8]",children:"INVESTMENT DETAILS"}),a("p",{className:"text-sm",children:["Investor: ",e("strong",{children:d})]}),a("p",{className:"text-sm",children:["Print Date: ",new Date().toLocaleDateString()]})]})]}),a("div",{className:"mb-4 grid grid-cols-1 md:grid-cols-3 gap-4",children:[a("div",{className:"border rounded p-3",children:[e("p",{className:"text-sm text-gray-500",children:"Investor Name"}),e("h4",{className:"font-bold",children:d})]}),a("div",{className:"border rounded p-3",children:[e("p",{className:"text-sm text-gray-500",children:"Total Transaction"}),e("h4",{className:"font-bold",children:i.length})]}),a("div",{className:"border rounded p-3",children:[e("p",{className:"text-sm text-gray-500",children:"Total Investment"}),e("h4",{className:"font-bold",children:P})]})]}),e("div",{className:"overflow-x-auto investment-table-wrapper",children:a("table",{className:"investment-table w-full table-hover whitespace-nowrap border",children:[e("thead",{children:a("tr",{className:"investment-header",children:[e("th",{className:"p-2 border",children:"SL"}),e("th",{className:"p-2 border",children:"Invoice"}),e("th",{className:"p-2 border",children:"Date"}),e("th",{className:"p-2 border",children:"Type"}),e("th",{className:"p-2 border",children:"Investor"}),e("th",{className:"p-2 border",children:"To"}),e("th",{className:"p-2 border",children:"Amount In"}),e("th",{className:"p-2 border",children:"Note"})]})}),e("tbody",{children:i.length>0?i.map((t,r)=>a("tr",{children:[e("td",{className:"p-2 border",children:r+1}),e("td",{className:"p-2 border",children:e(G,{to:`/pages/accounts/transaction/invoice/${t.id}`,className:"text-cyan-500 print:text-black",children:t.transaction_invoice})}),e("td",{className:"p-2 border",children:t.transaction_date}),e("td",{className:"p-2 border",children:t.transaction_type}),e("td",{className:"p-2 border",children:t.transaction_by}),e("td",{className:"p-2 border",children:t.transaction_to}),e("td",{className:"p-2 border font-bold text-right",children:Number(t.amount_in||0).toFixed(2)}),e("td",{className:"p-2 border whitespace-normal",children:t.transaction_notes})]},`${t.id}-${r}`)):e("tr",{children:e("td",{className:"p-4 border text-center",colSpan:8,children:"No investment details found"})})}),e("tfoot",{children:a("tr",{className:"investment-footer",children:[e("td",{className:"p-2 border text-right",colSpan:6,children:"Total"}),e("td",{className:"p-2 border text-right",children:P}),e("td",{className:"p-2 border"})]})})]})}),a("div",{className:"grid grid-cols-2 gap-10 mt-16",children:[e("div",{children:e("div",{className:"border-t border-black pt-2 text-center",children:"Prepared By"})}),e("div",{children:e("div",{className:"border-t border-black pt-2 text-center",children:"Authorized Signature"})})]})]})]}),e("style",{children:`
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
                        `})]})]})};export{X as default};
