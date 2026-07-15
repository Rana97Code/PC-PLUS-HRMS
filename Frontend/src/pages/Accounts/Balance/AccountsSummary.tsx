import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { NavLink } from "react-router-dom";
import { DataTable, DataTableSortStatus } from "mantine-datatable";

import sortBy from "lodash/sortBy";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

import { setPageTitle } from "../../../store/themeConfigSlice";
import api from "../../../api/axios";
import { IRootState } from "../../../store";

interface BalanceData {
  previous_cost: number;
  current_cost: number;
  payable_due: number;
  receivable_due: number;
  previous_balance: number;
  current_balance: number;

  total_investment: number;
  total_income: number;
  total_cost: number;

  available_years: number[];
}

interface InvestorContribution {
  investor_name: string;
  total_amount_in: number;
  total_transaction: number;
}

interface InvestmentTransaction {
  id: number;
  transaction_date: string;
  transaction_type: string;
  transaction_title: string;
  transaction_by: string;
  transaction_to: string;
  transaction_invoice: string;
  amount_in: number;
  transaction_notes?: string;
}

interface InvestorContributionResponse {
  data: InvestorContribution[];

  summary: {
    total_investment: number;
    total_investors: number;
    total_transactions: number;
  };
}

interface InvestorDetailsResponse {
  data: InvestmentTransaction[];

  summary: {
    investor_name: string;
    total_investment: number;
    total_transaction: number;
  };
}

const PAGE_SIZES = [10, 20, 30, 50, 100];

const asArray = <T,>(value: unknown): T[] => {
  return Array.isArray(value) ? value : [];
};

const normalizeNumberArray = (value: unknown): number[] => {
  return asArray<unknown>(value)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));
};

const MONTHS = [
  { value: "", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const emptyBalance: BalanceData = {
  previous_cost: 0,
  current_cost: 0,
  payable_due: 0,
  receivable_due: 0,
  previous_balance: 0,
  current_balance: 0,

  total_investment: 0,
  total_income: 0,
  total_cost: 0,

  available_years: [],
};

const AccountsSummary = () => {
  const dispatch = useDispatch();

  const auth = useSelector((state: IRootState) => state.auth);

  const authToken = auth.token;

  const [balance, setBalance] = useState<BalanceData>(emptyBalance);

  const [investors, setInvestors] = useState<InvestorContribution[]>([]);

  const [investorRecords, setInvestorRecords] = useState<
    InvestmentTransaction[]
  >([]);

  const [availableYears, setAvailableYears] = useState<number[]>([]);

  /*
   * Dropdown values before Apply is pressed.
   */
  const [selectedYear, setSelectedYear] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("");

  /*
   * Actual filters currently applied to API.
   */
  const [appliedYear, setAppliedYear] = useState("");

  const [appliedMonth, setAppliedMonth] = useState("");

  const [selectedInvestor, setSelectedInvestor] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalYear, setModalYear] = useState("");

  const [modalMonth, setModalMonth] = useState("");

  const [loadingSummary, setLoadingSummary] = useState(false);

  const [loadingModal, setLoadingModal] = useState(false);

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  const [recordsData, setRecordsData] = useState<InvestorContribution[]>([]);

  const [search, setSearch] = useState("");

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "total_amount_in",
    direction: "desc",
  });

  const investmentPrintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(setPageTitle("Accounts Summary"));
  }, [dispatch]);

  const formatMoney = (value: number | string | null | undefined) => {
    return Number(value || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatTransactionDate = (dateValue?: string) => {
    if (!dateValue) {
      return "";
    }

    const datePart = dateValue.split("T")[0];

    const [year, month, day] = datePart.split("-");

    if (!year || !month || !day) {
      return dateValue;
    }

    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const monthIndex = Number(month) - 1;

    if (monthIndex < 0 || monthIndex > 11) {
      return dateValue;
    }

    return `${day}-${monthNames[monthIndex]}-${year}`;
  };

  const getPeriodLabel = (year: string, month: string) => {
    if (!year && !month) {
      return "All Time";
    }

    const monthName = MONTHS.find((item) => item.value === month)?.label;

    if (year && month) {
      return `${monthName} ${year}`;
    }

    return `Year ${year}`;
  };

  const createParams = (year: string, month: string) => {
    const params: {
      year?: number;
      month?: number;
    } = {};

    if (year) {
      params.year = Number(year);
    }

    if (year && month) {
      params.month = Number(month);
    }

    return params;
  };

  const loadSummary = useCallback(async () => {
    if (!authToken) {
      return;
    }

    try {
      setLoadingSummary(true);

      const params = createParams(appliedYear, appliedMonth);

      const [balanceResponse, investorResponse] = await Promise.all([
        api.get<BalanceData>("/accounts/latest-balance", {
          params,
        }),

        api.get<InvestorContributionResponse>(
          "/accounts/investor-contribution",
          {
            params,
          },
        ),
      ]);

      const balanceResult =
        balanceResponse?.data &&
        typeof balanceResponse.data === "object" &&
        !Array.isArray(balanceResponse.data)
          ? balanceResponse.data
          : emptyBalance;

      const investorPayload = investorResponse?.data;

      const safeInvestors = Array.isArray(investorPayload)
        ? investorPayload
        : asArray<InvestorContribution>(investorPayload?.data);

      setBalance({
        ...emptyBalance,
        ...balanceResult,
        previous_cost: Number(balanceResult?.previous_cost || 0),
        current_cost: Number(balanceResult?.current_cost || 0),
        payable_due: Number(balanceResult?.payable_due || 0),
        receivable_due: Number(balanceResult?.receivable_due || 0),
        previous_balance: Number(balanceResult?.previous_balance || 0),
        current_balance: Number(balanceResult?.current_balance || 0),
        total_investment: Number(balanceResult?.total_investment || 0),
        total_income: Number(balanceResult?.total_income || 0),
        total_cost: Number(balanceResult?.total_cost || 0),
        available_years: normalizeNumberArray(balanceResult?.available_years),
      });

      setAvailableYears(normalizeNumberArray(balanceResult?.available_years));

      setInvestors(safeInvestors);
    } catch (error: any) {
      console.error("Accounts summary error:", error);

      const message =
        error?.response?.data?.detail || "Failed to load accounts summary";

      alert(message);

      setInvestors([]);
    } finally {
      setLoadingSummary(false);
    }
  }, [authToken, appliedYear, appliedMonth]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const applySummaryFilter = () => {
    if (selectedMonth && !selectedYear) {
      alert("Please select a year before selecting a month.");

      return;
    }

    setAppliedYear(selectedYear);
    setAppliedMonth(selectedMonth);
    setPage(1);
  };

  const resetSummaryFilter = () => {
    setSelectedYear("");
    setSelectedMonth("");
    setAppliedYear("");
    setAppliedMonth("");
    setPage(1);
  };

  const filteredInvestors = useMemo(() => {
    const query = search.trim().toLowerCase();

    const safeInvestors = asArray<InvestorContribution>(investors);

    if (!query) {
      return safeInvestors;
    }

    return safeInvestors.filter(
      (item) =>
        item.investor_name?.toLowerCase().includes(query) ||
        item.total_amount_in?.toString().includes(query) ||
        item.total_transaction?.toString().includes(query),
    );
  }, [investors, search]);

  useEffect(() => {
    const sortedData = sortBy(filteredInvestors, sortStatus.columnAccessor);

    const finalData =
      sortStatus.direction === "desc" ? [...sortedData].reverse() : sortedData;

    const from = (page - 1) * pageSize;

    const to = from + pageSize;

    setRecordsData(finalData.slice(from, to));
  }, [filteredInvestors, sortStatus, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const fetchInvestorDetails = async (
    investorName: string,
    year: string,
    month: string,
  ) => {
    if (!investorName) {
      return;
    }

    try {
      setLoadingModal(true);

      const safeInvestorName = encodeURIComponent(investorName);

      const params = createParams(year, month);

      const response = await api.get<InvestorDetailsResponse>(
        `/accounts/investor-contribution/${safeInvestorName}`,
        {
          params,
        },
      );

      const detailsPayload = response?.data;

      const safeRecords = Array.isArray(detailsPayload)
        ? detailsPayload
        : asArray<InvestmentTransaction>(detailsPayload?.data);

      setInvestorRecords(safeRecords);
    } catch (error: any) {
      console.error("Investor details error:", error);

      alert(error?.response?.data?.detail || "Failed to load investor details");

      setInvestorRecords([]);
    } finally {
      setLoadingModal(false);
    }
  };

  const openInvestorDetails = async (investorName: string) => {
    setSelectedInvestor(investorName);

    setModalYear(appliedYear);
    setModalMonth(appliedMonth);

    setInvestorRecords([]);
    setIsModalOpen(true);

    await fetchInvestorDetails(investorName, appliedYear, appliedMonth);
  };

  const applyModalFilter = async () => {
    if (modalMonth && !modalYear) {
      alert("Please select a year before selecting a month.");

      return;
    }

    await fetchInvestorDetails(selectedInvestor, modalYear, modalMonth);
  };

  const resetModalFilter = async () => {
    setModalYear("");
    setModalMonth("");

    await fetchInvestorDetails(selectedInvestor, "", "");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvestor("");
    setInvestorRecords([]);
    setModalYear("");
    setModalMonth("");
  };

  const printInvestorDetails = useReactToPrint({
    contentRef: investmentPrintRef,

    documentTitle: `Investment-${selectedInvestor}`,
  });

  const modalTotalInvestment = useMemo(() => {
    return asArray<InvestmentTransaction>(investorRecords).reduce(
      (total, item) => total + Number(item.amount_in || 0),
      0,
    );
  }, [investorRecords]);

  return (
    <div>
      <div className="panel flex items-center justify-between flex-wrap gap-4 text-black dark:text-white print:hidden">
        <div>
          <h2 className="text-xl font-bold">Accounts Summary</h2>

          <p className="text-sm text-gray-500 mt-1">
            Investment period:{" "}
            <strong>{getPeriodLabel(appliedYear, appliedMonth)}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="form-select w-36"
            value={selectedYear}
            onChange={(event) => {
              const year = event.target.value;

              setSelectedYear(year);

              if (!year) {
                setSelectedMonth("");
              }
            }}
          >
            <option value="">All Years</option>

            {asArray<number>(availableYears).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            className="form-select w-40"
            value={selectedMonth}
            disabled={!selectedYear}
            onChange={(event) => setSelectedMonth(event.target.value)}
          >
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-primary"
            onClick={applySummaryFilter}
            disabled={loadingSummary}
          >
            {loadingSummary ? "Loading..." : "Apply Filter"}
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={resetSummaryFilter}
          >
            Reset
          </button>
        </div>
      </div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 pt-5 print:hidden">
    {/* Total Investment */}
    <div className="panel bg-white dark:bg-black py-3 px-4 min-h-[105px]">
        <h5 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Total Investment
        </h5>

        <h2 className="mt-1 text-success font-bold text-xl xl:text-2xl leading-tight break-all min-h-[50px]">
            {formatMoney(balance.total_investment)}
        </h2>

        <p className="text-xs text-gray-500">
            {getPeriodLabel(appliedYear, appliedMonth)}
        </p>
    </div>

    {/* Total Income */}
    <div className="panel bg-white dark:bg-black py-3 px-4 min-h-[105px]">
        <h5 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Total Income
        </h5>

        <h2 className="mt-1 text-info font-bold text-xl xl:text-2xl leading-tight break-all min-h-[50px]">
            {formatMoney(balance.total_income)}
        </h2>

        <p className="text-xs text-gray-500">
            {getPeriodLabel(appliedYear, appliedMonth)}
        </p>
    </div>

    {/* Total Cost */}
    <div className="panel bg-white dark:bg-black py-3 px-4 min-h-[105px]">
        <h5 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Total Cost
        </h5>

        <h2 className="mt-1 text-danger font-bold text-xl xl:text-2xl leading-tight break-all min-h-[50px]">
            {formatMoney(balance.total_cost)}
        </h2>

        <p className="text-xs text-gray-500">
            {getPeriodLabel(appliedYear, appliedMonth)}
        </p>
    </div>

    {/* Current Balance */}
    <div className="panel bg-white dark:bg-black py-3 px-4 min-h-[105px]">
        <h5 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Current Balance
        </h5>

        <h2 className="mt-1 text-primary font-bold text-xl xl:text-2xl leading-tight break-all min-h-[50px]">
            {formatMoney(balance.current_balance)}
        </h2>

        <p className="text-xs text-gray-500">
            Current Position
        </p>
    </div>

    {/* Payable Due */}
    <div className="panel bg-white dark:bg-black py-3 px-4 min-h-[105px]">
        <h5 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Payable Due
        </h5>

        <h2 className="mt-1 text-warning font-bold text-xl xl:text-2xl leading-tight break-all min-h-[50px]">
            {formatMoney(balance.payable_due)}
        </h2>

        <p className="text-xs text-gray-500">
            Outstanding Payable
        </p>
    </div>

    {/* Receivable Due */}
    <div className="panel bg-white dark:bg-black py-3 px-4 min-h-[105px]">
        <h5 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Receivable Due
        </h5>

        <h2 className="mt-1 text-success font-bold text-xl xl:text-2xl leading-tight break-all min-h-[50px]">
            {formatMoney(balance.receivable_due)}
        </h2>

        <p className="text-xs text-gray-500">
            Outstanding Receivable
        </p>
    </div>
</div>

      <div className="pt-5 print:hidden">
        <div className="panel">
          <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
            <div>
              <h5 className="font-semibold text-lg dark:text-white-light">
                Investor Contribution
              </h5>

              <p className="text-sm text-gray-500">
                {getPeriodLabel(appliedYear, appliedMonth)}
              </p>
            </div>

            <input
              type="text"
              className="h-12 w-56 border border-slate-300 px-5 rounded focus:shadow focus:outline-none dark:bg-black dark:text-white dark:border-slate-700"
              placeholder="Search investor..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="datatables">
            <DataTable
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={recordsData}
              fetching={loadingSummary}
              columns={[
                {
                  accessor: "investor_name",
                  title: "Investor Name",
                  sortable: true,

                  render: ({ investor_name }) => (
                    <button
                      type="button"
                      className="text-cyan-600 font-semibold hover:underline"
                      onClick={() => openInvestorDetails(investor_name)}
                    >
                      {investor_name}
                    </button>
                  ),
                },
                {
                  accessor: "total_amount_in",
                  title: "Total Investment",
                  sortable: true,

                  render: ({ total_amount_in }) => (
                    <span className="font-bold">
                      {formatMoney(total_amount_in)}
                    </span>
                  ),
                },
                {
                  accessor: "total_transaction",
                  title: "Total Transaction",
                  sortable: true,
                },
              ]}
              totalRecords={filteredInvestors.length}
              recordsPerPage={pageSize}
              page={page}
              onPageChange={setPage}
              recordsPerPageOptions={PAGE_SIZES}
              onRecordsPerPageChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
              sortStatus={sortStatus}
              onSortStatusChange={(status) => {
                setSortStatus(status);

                setPage(1);
              }}
              minHeight={200}
              noRecordsText="No investment records found"
              paginationText={({ from, to, totalRecords }) =>
                `Showing ${from} to ${to} of ${totalRecords} entries`
              }
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
          <div
            ref={investmentPrintRef}
            className="investment-print-area bg-white text-black rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b p-5 no-print gap-4 flex-wrap">
              <div>
                <h5 className="font-semibold text-lg">
                  Investment Details: {selectedInvestor}
                </h5>

                <p className="text-sm text-gray-500">
                  {getPeriodLabel(modalYear, modalMonth)}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  className="form-select w-32"
                  value={modalYear}
                  onChange={(event) => {
                    const year = event.target.value;

                    setModalYear(year);

                    if (!year) {
                      setModalMonth("");
                    }
                  }}
                >
                  <option value="">All Years</option>

                  {asArray<number>(availableYears).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select w-36"
                  value={modalMonth}
                  disabled={!modalYear}
                  onChange={(event) => setModalMonth(event.target.value)}
                >
                  {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="btn btn-info btn-sm"
                  onClick={applyModalFilter}
                  disabled={loadingModal}
                >
                  Filter
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={resetModalFilter}
                >
                  Reset
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={printInvestorDetails}
                >
                  Print
                </button>

                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src="/assets/images/auth/logo.jpeg"
                    alt="PC Plus Solution"
                    className="w-24 h-24 object-contain"
                  />

                  <div>
                    <h2 className="text-2xl font-bold text-[#0064C8]">
                      PC PLUS SOLUTION LTD
                    </h2>

                    <p className="text-sm">
                      House-34, Block-A, Road-18, Banani, Dhaka
                    </p>

                    <p className="text-sm">Email: info@pcplusbd.com</p>

                    <p className="text-sm">Phone: +8801772699434</p>
                  </div>
                </div>

                <div className="text-right">
                  <h3 className="text-xl font-bold text-[#0064C8]">
                    INVESTMENT DETAILS
                  </h3>

                  <p className="text-sm">
                    Investor: <strong>{selectedInvestor}</strong>
                  </p>

                  <p className="text-sm">
                    Period:{" "}
                    <strong>{getPeriodLabel(modalYear, modalMonth)}</strong>
                  </p>

                  <p className="text-sm">
                    Print Date: {new Date().toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="border rounded p-3">
                  <p className="text-sm text-gray-500">Investor</p>

                  <h4 className="font-bold">{selectedInvestor}</h4>
                </div>

                <div className="border rounded p-3">
                  <p className="text-sm text-gray-500">Total Transactions</p>

                  <h4 className="font-bold">{investorRecords.length}</h4>
                </div>

                <div className="border rounded p-3">
                  <p className="text-sm text-gray-500">Total Investment</p>

                  <h4 className="font-bold">
                    {formatMoney(modalTotalInvestment)}
                  </h4>
                </div>
              </div>

              {loadingModal ? (
                <div className="text-center py-10 font-semibold">
                  Loading...
                </div>
              ) : (
                <div className="overflow-x-auto investment-table-wrapper">
                  <table className="investment-table w-full border-collapse border">
                    <thead>
                      <tr className="investment-header">
                        <th className="p-2 border">SL</th>

                        <th className="p-2 border">Invoice</th>

                        <th className="p-2 border">Date</th>

                        <th className="p-2 border">Type</th>

                        <th className="p-2 border">Investor</th>

                        <th className="p-2 border">To</th>

                        <th className="p-2 border">Amount</th>

                        <th className="p-2 border">Note</th>
                      </tr>
                    </thead>

                    <tbody>
                      {asArray<InvestmentTransaction>(investorRecords).length >
                      0 ? (
                        asArray<InvestmentTransaction>(investorRecords).map(
                          (item, index) => (
                            <tr key={item.id}>
                              <td className="p-2 border">{index + 1}</td>

                              <td className="p-2 border">
                                <NavLink
                                  to={`/pages/accounts/transaction/invoice/${item.id}`}
                                  className="text-cyan-500 print:text-black"
                                >
                                  {item.transaction_invoice}
                                </NavLink>
                              </td>

                              <td className="p-2 border">
                                {formatTransactionDate(item.transaction_date)}
                              </td>

                              <td className="p-2 border">
                                {item.transaction_type}
                              </td>

                              <td className="p-2 border">
                                {item.transaction_by}
                              </td>

                              <td className="p-2 border">
                                {item.transaction_to}
                              </td>

                              <td className="p-2 border font-bold text-right">
                                {formatMoney(item.amount_in)}
                              </td>

                              <td className="p-2 border whitespace-normal">
                                {item.transaction_notes || "-"}
                              </td>
                            </tr>
                          ),
                        )
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-5 border text-center">
                            No investment records found
                          </td>
                        </tr>
                      )}
                    </tbody>

                    <tfoot>
                      <tr className="investment-footer">
                        <td colSpan={6} className="p-2 border text-right">
                          Total
                        </td>

                        <td className="p-2 border text-right">
                          {formatMoney(modalTotalInvestment)}
                        </td>

                        <td className="p-2 border"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              <div className="grid grid-cols-2 gap-10 mt-16">
                <div className="border-t border-black pt-2 text-center">
                  Prepared By
                </div>

                <div className="border-t border-black pt-2 text-center">
                  Authorized Signature
                </div>
              </div>
            </div>
          </div>

          <style>
            {`
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
                                    margin: 0 !important;
                                    padding: 0 !important;
                                    box-shadow: none !important;
                                    border-radius: 0 !important;
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

                                @page {
                                    size: A4 landscape;
                                    margin: 10mm;
                                }
                            }
                        `}
          </style>
        </div>
      )}
    </div>
  );
};

export default AccountsSummary;