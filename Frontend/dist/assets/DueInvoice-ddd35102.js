import{f as u,a as x,r as i,b as e,j as t,L as g}from"./index-b3ab9e8c.js";import{a as v}from"./axios-9eb6bd93.js";const w=()=>{var d;const{source_type:n,source_id:c,due_type:o}=u();x(a=>a.auth);const m=i.useRef(null),[r,h]=i.useState(null),[p,l]=i.useState(!1),b=async()=>{try{l(!0);const a=await v.get(`/due/invoice/${n}/${c}/${o}`);h(a.data)}catch(a){console.log(a)}finally{l(!1)}};i.useEffect(()=>{b()},[n,c,o]);const N=()=>{window.print()};return p?e("div",{className:"panel text-center py-10",children:"Loading invoice..."}):r?t("div",{children:[t("div",{className:"panel flex items-center justify-between flex-wrap gap-4 text-black no-print",children:[e("h2",{className:"text-xl font-bold",children:"Due Invoice"}),t("div",{className:"flex gap-3",children:[e(g,{to:"/pages/accounts/due",className:"btn btn-secondary",children:"← Back"}),e("button",{type:"button",onClick:N,className:"btn btn-primary",children:"Print Invoice"})]})]}),e("div",{className:"pt-5",children:t("div",{ref:m,className:"invoice-print-area bg-white text-black p-8 rounded shadow",children:[t("div",{className:"flex justify-between items-start border-b pb-6 mb-6",children:[t("div",{className:"flex items-center gap-4",children:[e("img",{src:"/assets/images/auth/logo.jpeg",alt:"Company Logo",className:"w-36 h-24 object-contain"}),t("div",{children:[e("h1",{className:"text-2xl font-bold",children:"PC PLUS SOLUTION LTD"}),e("p",{className:"text-sm",children:"House-34, Block-A, Road-18, Banani, Dhaka, Bangladesh"}),e("p",{className:"text-sm",children:"Email: info@pcplusbd.com"}),e("p",{className:"text-sm",children:"Phone: +880 1772-699434"})]})]}),t("div",{className:"text-right",children:[e("h2",{className:"text-3xl font-bold uppercase",style:{color:"#0064C8"},children:"Due Invoice"}),t("p",{className:"text-sm mt-2",children:[e("strong",{children:"Invoice No:"})," ",r.invoice_no]}),t("p",{className:"text-sm",children:[e("strong",{children:"Date:"})," ",String(r.invoice_date||"").slice(0,10)]})]})]}),t("div",{className:"grid grid-cols-2 gap-8 mb-8",children:[t("div",{className:"border rounded p-4",children:[e("h3",{className:"font-bold text-lg mb-3 border-b pb-2",style:{color:"#0064C8"},children:"Due Info"}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Invoice No:"})," ",r.invoice_no]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Party Name:"})," ",r.party_name]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Due Type:"})," ",r.due_label]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Source:"})," ",r.source_type]})]}),t("div",{className:"border rounded p-4",children:[e("h3",{className:"font-bold text-lg mb-3 border-b pb-2",style:{color:"#0064C8"},children:"Summary"}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Total Due:"})," ",Number(r.total_due||0).toFixed(2)]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Total Paid:"})," ",Number(r.paid_amount||0).toFixed(2)]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Remaining Due:"})," ",Number(r.remaining_due||0).toFixed(2)]}),t("p",{className:"text-sm mb-2",children:[e("strong",{children:"Status:"})," ",r.status]})]})]}),e("div",{className:"overflow-x-auto print-table-wrapper",children:t("table",{className:"invoice-table w-full border border-gray-300 text-sm",children:[e("thead",{children:t("tr",{className:"invoice-table-head",children:[e("th",{className:"border p-2",children:"SL"}),e("th",{className:"border p-2",children:"Date"}),e("th",{className:"border p-2",children:"Invoice"}),e("th",{className:"border p-2",children:"Type"}),e("th",{className:"border p-2",children:"Total Due"}),e("th",{className:"border p-2",children:"Paid"}),e("th",{className:"border p-2",children:"Remaining"}),e("th",{className:"border p-2",children:"Status"}),e("th",{className:"border p-2",children:"Note"})]})}),e("tbody",{children:(d=r.details)==null?void 0:d.map((a,s)=>t("tr",{children:[e("td",{className:"border p-2 text-center",children:s+1}),e("td",{className:"border p-2",children:String(a.date||"").slice(0,10)}),e("td",{className:"border p-2",children:a.invoice}),e("td",{className:"border p-2",children:a.type}),e("td",{className:"border p-2 text-right",children:Number(a.total_due||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(a.paid_amount||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(a.remaining_due||0).toFixed(2)}),e("td",{className:"border p-2",children:a.status}),e("td",{className:"border p-2 whitespace-normal",children:a.note})]},s))}),e("tfoot",{children:t("tr",{className:"invoice-table-foot",children:[e("td",{className:"border p-2 text-right",colSpan:4,children:"Total"}),e("td",{className:"border p-2 text-right",children:Number(r.total_due||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(r.paid_amount||0).toFixed(2)}),e("td",{className:"border p-2 text-right",children:Number(r.remaining_due||0).toFixed(2)}),e("td",{className:"border p-2"}),e("td",{className:"border p-2"})]})})]})}),t("div",{className:"grid grid-cols-2 gap-10 mt-16",children:[e("div",{children:e("div",{className:"border-t border-black pt-2 text-center",children:"Prepared By"})}),e("div",{children:e("div",{className:"border-t border-black pt-2 text-center",children:"Authorized Signature"})})]})]})}),e("style",{children:`
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

                        @page {
                            size: A4 landscape;
                            margin: 8mm;
                        }
                    }
                `})]}):e("div",{className:"panel text-center py-10",children:"Invoice not found"})};export{w as default};
