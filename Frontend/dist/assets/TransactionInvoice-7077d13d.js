import{f as A,r,U as F,u as R,s as j,c as B,a as t,j as e,L as P}from"./index-662d3983.js";import{Z as L}from"./react-to-print-98b2a91c.js";const O=()=>{const u=A(),s=r.useContext(F),N=s.headers,x=s.base_url,i=R(),c=r.useRef(null),[n,v]=r.useState(""),[l,g]=r.useState(""),[f,y]=r.useState(""),[d,T]=r.useState(0),[m,w]=r.useState(0),[h,_]=r.useState(0),[p,k]=r.useState(0),[b,C]=r.useState(0),[I,S]=r.useState([]);r.useEffect(()=>{i(j("Transaction Invoice"))},[i]),r.useEffect(()=>{B.get(`${x}/transaction/transaction_invoice/${u.id}`,{headers:N}).then(a=>{const o=a.data;v(o.invoice_no),g(o.invoice_date),y(o.created_by),S(o.items||[]),T(o.total_amount_in||0),w(o.total_amount_out||0),_(o.total_cost||0),k(o.total_due||0),C(o.total_return||0)}).catch(a=>{console.error("Error fetching transaction invoice:",a)})},[]);const D=L({contentRef:c,documentTitle:`Transaction-Invoice-${n}`});return t("div",{children:[t("div",{className:"panel flex items-center justify-between flex-wrap gap-4 text-black no-print",children:[e("h2",{className:"text-xl font-bold",children:"Transaction Invoice"}),t("div",{className:"flex gap-3",children:[e(P,{to:"/pages/accounts/transaction",className:"btn btn-secondary",children:"← Back"}),e("button",{type:"button",onClick:D,className:"btn btn-primary",children:"Print Invoice"})]})]}),e("div",{className:"pt-5",children:t("div",{ref:c,className:"invoice-print-area bg-white text-black p-8 rounded shadow",children:[t("div",{className:"flex justify-between items-start border-b pb-6 mb-6",children:[t("div",{className:"flex items-center gap-4",children:[e("img",{src:"/assets/images/auth/logo.jpeg",alt:"Company Logo",className:"w-36 h-24 object-contain"}),t("div",{children:[e("h1",{className:"text-2xl font-bold",children:"PC PLUS SOLUTION LTD"}),e("p",{className:"text-sm",children:"House-34, Block-A, Road-18, Banani, Dhaka, Bangladesh"}),e("p",{className:"text-sm",children:"Email: info@pcplusbd.com"}),e("p",{className:"text-sm",children:"Phone: +880 1772-699434"})]})]}),t("div",{className:"text-right",children:[e("h2",{className:"text-3xl font-bold uppercase",style:{color:"#0064C8"},children:"Transaction Invoice"}),t("p",{className:"text-sm mt-2",children:[e("strong",{children:"Invoice No:"})," ",n]}),t("p",{className:"text-sm",children:[e("strong",{children:"Date:"})," ",l]})]})]}),t("div",{className:"grid grid-cols-2 gap-8 mb-8",children:[t("div",{className:"border rounded p-4",children:[e("h3",{className:"font-bold text-lg mb-3 border-b pb-2",style:{color:"#0064C8"},children:"Transaction Info"}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Invoice No:"})," ",n]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Invoice Date:"})," ",l]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Created By:"})," ",f]})]}),t("div",{className:"border rounded p-4",children:[e("h3",{className:"font-bold text-lg mb-3 border-b pb-2",style:{color:"#0064C8"},children:"Summary"}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Total Amount Credit:"})," ",d]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Total Amount Debit:"})," ",m]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Total Cost:"})," ",h]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Total Due:"})," ",p]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Total Return:"})," ",b]})]})]}),e("div",{className:"overflow-x-auto print-table-wrapper",children:t("table",{className:"invoice-table w-full border border-gray-300 text-sm",children:[e("thead",{children:t("tr",{className:"invoice-table-head",children:[e("th",{className:"border p-2",children:"SL"}),e("th",{className:"border p-2",children:"Date"}),e("th",{className:"border p-2",children:"Type"}),e("th",{className:"border p-2",children:"By"}),e("th",{className:"border p-2",children:"To"}),e("th",{className:"border p-2",children:"Amount Credit"}),e("th",{className:"border p-2",children:"Amount Debit"}),e("th",{className:"border p-2",children:"Cost"}),e("th",{className:"border p-2",children:"Due"}),e("th",{className:"border p-2",children:"Return"}),e("th",{className:"border p-2",children:"Note"})]})}),e("tbody",{children:I.map((a,o)=>t("tr",{children:[e("td",{className:"border p-2 text-center",children:o+1}),e("td",{className:"border p-2",children:a.transaction_date}),e("td",{className:"border p-2",children:a.transaction_type}),e("td",{className:"border p-2",children:a.transaction_by}),e("td",{className:"border p-2",children:a.transaction_to}),e("td",{className:"border p-2 text-right",children:Number(a.amount_in||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(a.amount_out||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(a.cost||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(a.due_amount||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(a.return_amount||0).toFixed(2)}),e("td",{className:"border p-2 whitespace-normal",children:a.transaction_notes})]},o))}),e("tfoot",{children:t("tr",{className:"invoice-table-foot",children:[e("td",{className:"border p-2 text-right",colSpan:5,children:"Total"}),e("td",{className:"border p-2 text-right",children:Number(d||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(m||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(h||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(p||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(b||0).toFixed(2)}),e("td",{className:"border p-2"})]})})]})}),t("div",{className:"grid grid-cols-2 gap-10 mt-16",children:[e("div",{children:e("div",{className:"border-t border-black pt-2 text-center",children:"Prepared By"})}),e("div",{children:e("div",{className:"border-t border-black pt-2 text-center",children:"Authorized Signature"})})]})]})}),e("style",{children:`
                :root {
                    --invoice-theme-bg: #0064C8;
                    --invoice-theme-text: #ffffff;
                }

                .dark {
                    --invoice-theme-bg: #1E40AF;
                    --invoice-theme-text: #ffffff;
                }

                .invoice-table-head th,
                .invoice-table-foot td {
                    background-color: var(--invoice-theme-bg) !important;
                    color: var(--invoice-theme-text) !important;
                }

                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    body {
                        background: white !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .invoice-print-area {
                        width: 100% !important;
                        max-width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        background: white !important;
                        color: black !important;
                    }

                    .print-table-wrapper {
                        overflow: visible !important;
                    }

                    .invoice-table {
                        width: 100% !important;
                        table-layout: fixed !important;
                        border-collapse: collapse !important;
                        font-size: 9px !important;
                    }

                    .invoice-table th,
                    .invoice-table td {
                        padding: 4px !important;
                        word-break: break-word !important;
                        white-space: normal !important;
                    }

                    .invoice-table-head th,
                    .invoice-table-foot td {
                        background-color: var(--invoice-theme-bg) !important;
                        color: var(--invoice-theme-text) !important;
                    }

                    @page {
                        size: A4 landscape;
                        margin: 8mm;
                    }
                }
            `})]})};export{O as default};
