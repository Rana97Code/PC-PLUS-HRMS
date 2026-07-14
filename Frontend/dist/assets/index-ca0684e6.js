import{r,j as a,b as e}from"./index-b3ab9e8c.js";import{a as x}from"./axios-9eb6bd93.js";import{N as B}from"./index-5b5bc790.js";import{s as H}from"./sortBy-222a53d8.js";import{Z as z}from"./react-to-print-dbb284e5.js";const y=[10,20,30,50],J=()=>{const g=r.useRef(null),[v,S]=r.useState([]),[f,w]=r.useState([]),[m,p]=r.useState(1),[h,R]=r.useState(y[0]),[P,k]=r.useState(0),[u,C]=r.useState(""),[b,A]=r.useState(new Date().toISOString().slice(0,10)),[l,D]=r.useState(""),[i,I]=r.useState(new Date().toISOString().slice(0,7)),[N,_]=r.useState([]),[s,E]=r.useState(null),[o,T]=r.useState({columnAccessor:"name",direction:"asc"}),d=t=>t?new Date(t).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}):"-",O=t=>{if(!t)return!1;const n=new Date(t);return n.getHours()>10||n.getHours()===10&&n.getMinutes()>0},j=t=>t?new Date(t).getHours()<17:!1,L=async()=>{const t=await x.get("/attendance/daily",{params:{date:b,page:m,limit:h,search:u,sortBy:o.columnAccessor,sortOrder:o.direction.toUpperCase()}});w(t.data.data||[]),k(t.data.total||0)},$=async()=>{if(!l||!i)return;const t=await x.get("/attendance/monthly-report",{params:{employee_id:l,month:i}});_(t.data.data||[]),E(t.data.employee||null)};r.useEffect(()=>{L()},[m,h,b,u,o]),r.useEffect(()=>{const t=H(f,o.columnAccessor);S(o.direction==="desc"?t.reverse():t)},[f,o]);const M=z({contentRef:g,documentTitle:`Attendance-Report-${l}-${i}`});return a("div",{children:[a("div",{className:"panel flex items-center justify-between flex-wrap gap-4",children:[e("h2",{className:"text-xl font-bold text-black dark:text-white-light",children:"Daily Attendance Management"}),a("div",{className:"flex flex-wrap gap-3",children:[e("input",{type:"date",className:"form-input w-auto",value:b,onChange:t=>{A(t.target.value),p(1)}}),e("input",{type:"text",className:"form-input w-auto",placeholder:"Search employee...",value:u,onChange:t=>{C(t.target.value),p(1)}})]})]}),e("div",{className:"panel mt-5",children:e(B,{highlightOnHover:!0,className:"whitespace-nowrap table-hover",records:v,columns:[{accessor:"employee_id",title:"Employee ID",sortable:!0},{accessor:"name",title:"Employee Name",sortable:!0},{accessor:"attendance.in_time",title:"In Time",render:t=>{var n,c;return e("span",{className:`px-3 py-1 rounded font-semibold ${O((n=t.attendance)==null?void 0:n.in_time)?"bg-red-100 text-red-700":"bg-green-100 text-green-700"}`,children:d((c=t.attendance)==null?void 0:c.in_time)})}},{accessor:"attendance.out_time",title:"Out Time",render:t=>{var n,c;return e("span",{className:`px-3 py-1 rounded font-semibold ${j((n=t.attendance)==null?void 0:n.out_time)?"bg-red-100 text-red-700":"bg-blue-100 text-blue-700"}`,children:d((c=t.attendance)==null?void 0:c.out_time)})}},{accessor:"status",title:"Status",render:t=>e("span",{className:`badge ${t.attendance?"bg-success":"bg-danger"}`,children:t.attendance?"Present":"Absent"})}],totalRecords:P,recordsPerPage:h,page:m,onPageChange:p,recordsPerPageOptions:y,onRecordsPerPageChange:R,sortStatus:o,onSortStatusChange:T,minHeight:300,paginationText:({from:t,to:n,totalRecords:c})=>`Showing ${t} to ${n} of ${c} entries`})}),a("div",{className:"panel mt-5 no-print",children:[e("h3",{className:"text-lg font-bold mb-4",children:"Monthly Employee Attendance Report"}),a("div",{className:"flex flex-wrap gap-3",children:[e("input",{type:"text",className:"form-input w-auto",placeholder:"Employee ID",value:l,onChange:t=>D(t.target.value)}),e("input",{type:"month",className:"form-input w-auto",value:i,onChange:t=>I(t.target.value)}),e("button",{type:"button",className:"btn btn-primary",onClick:$,children:"Filter Report"}),e("button",{type:"button",className:"btn btn-secondary",onClick:M,children:"Print Report"})]})]}),e("div",{className:"pt-5",children:a("div",{ref:g,className:"attendance-print-area bg-white text-black p-8 rounded shadow",children:[a("div",{className:"flex justify-between items-start border-b pb-6 mb-6",children:[a("div",{className:"flex items-center gap-4",children:[e("img",{src:"/assets/images/auth/logo.jpeg",alt:"Company Logo",className:"w-36 h-24 object-contain"}),a("div",{children:[e("h1",{className:"text-2xl font-bold",children:"PC PLUS SOLUTION LTD"}),e("p",{className:"text-sm",children:"House-34, Block-A, Road-18, Banani, Dhaka, Bangladesh"}),e("p",{className:"text-sm",children:"Email: info@pcplusbd.com"}),e("p",{className:"text-sm",children:"Phone: +880 1772-699434"})]})]}),a("div",{className:"text-right",children:[e("h2",{className:"text-3xl font-bold uppercase",style:{color:"#0064C8"},children:"Attendance Report"}),a("p",{className:"text-sm mt-2",children:[e("strong",{children:"Month:"})," ",i]})]})]}),a("div",{className:"grid grid-cols-2 gap-8 mb-8",children:[a("div",{className:"border rounded p-4",children:[e("h3",{className:"font-bold text-lg mb-3 border-b pb-2",style:{color:"#0064C8"},children:"Employee Info"}),a("p",{className:"text-sm mb-2",children:[e("strong",{children:"Employee ID:"})," ",(s==null?void 0:s.employee_id)||l]}),a("p",{className:"text-sm mb-2",children:[e("strong",{children:"Name:"})," ",(s==null?void 0:s.name)||"-"]}),a("p",{className:"text-sm mb-2",children:[e("strong",{children:"Email:"})," ",(s==null?void 0:s.email)||"-"]})]}),a("div",{className:"border rounded p-4",children:[e("h3",{className:"font-bold text-lg mb-3 border-b pb-2",style:{color:"#0064C8"},children:"Summary"}),a("p",{className:"text-sm mb-2",children:[e("strong",{children:"Total Present:"})," ",N.length]})]})]}),e("div",{className:"overflow-x-auto print-table-wrapper",children:a("table",{className:"attendance-table w-full border border-gray-300 text-sm",children:[e("thead",{children:a("tr",{className:"attendance-table-head",children:[e("th",{className:"border p-2",children:"SL"}),e("th",{className:"border p-2",children:"Date"}),e("th",{className:"border p-2",children:"In Time"}),e("th",{className:"border p-2",children:"Out Time"}),e("th",{className:"border p-2",children:"Status"})]})}),e("tbody",{children:N.map((t,n)=>a("tr",{children:[e("td",{className:"border p-2 text-center",children:n+1}),e("td",{className:"border p-2",children:t.attendance_date}),e("td",{className:"border p-2",children:d(t.in_time)}),e("td",{className:"border p-2",children:d(t.out_time)}),e("td",{className:"border p-2",children:t.status})]},n))})]})}),a("div",{className:"grid grid-cols-2 gap-10 mt-16",children:[e("div",{children:e("div",{className:"border-t border-black pt-2 text-center",children:"Prepared By"})}),e("div",{children:e("div",{className:"border-t border-black pt-2 text-center",children:"Authorized Signature"})})]})]})}),e("style",{children:`
                    :root {
                        --attendance-theme-bg: #0064C8;
                        --attendance-theme-text: #ffffff;
                    }

                    .dark {
                        --attendance-theme-bg: #1E40AF;
                        --attendance-theme-text: #ffffff;
                    }

                    .attendance-table-head th {
                        background-color: var(--attendance-theme-bg) !important;
                        color: var(--attendance-theme-text) !important;
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

                        .attendance-print-area {
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

                        .attendance-table {
                            width: 100% !important;
                            table-layout: fixed !important;
                            border-collapse: collapse !important;
                            font-size: 10px !important;
                        }

                        .attendance-table th,
                        .attendance-table td {
                            padding: 5px !important;
                            word-break: break-word !important;
                            white-space: normal !important;
                        }

                        @page {
                            size: A4 portrait;
                            margin: 8mm;
                        }
                    }
                `})]})};export{J as default};
