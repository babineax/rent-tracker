import React, { useMemo } from 'react';
import { useFinance } from '../hooks/useFinance.js';
import { exportToCsv, exportToPdf } from '../utils/exporters.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

function FinanceDashboard() {
  const {
    filters,
    updateFilters,
    clearFilters,
    properties,
    units,
    rentRoll,
    kpis,
    monthlySeries,
    breakdownByProperty,
    breakdownByStatus,
    currencyBreakdown,
    loading,
    error,
    loadFinance
  } = useFinance();

  const monthOptions = useMemo(() => (
    [
      { value: 1, label: 'January' },
      { value: 2, label: 'February' },
      { value: 3, label: 'March' },
      { value: 4, label: 'April' },
      { value: 5, label: 'May' },
      { value: 6, label: 'June' },
      { value: 7, label: 'July' },
      { value: 8, label: 'August' },
      { value: 9, label: 'September' },
      { value: 10, label: 'October' },
      { value: 11, label: 'November' },
      { value: 12, label: 'December' }
    ]
  ), []);

  const yearOptions = useMemo(() => {
    const current = new Date().getUTCFullYear();
    const years = [];
    for (let y = current - 4; y <= current + 1; y++) years.push(y);
    return years;
  }, []);

  const filteredUnits = useMemo(() => {
    return filters.propertyId ? units.filter(u => u.property_id === filters.propertyId) : units;
  }, [units, filters.propertyId]);

  const handleExportCsv = () => {
    exportToCsv('rent_roll.csv', rentRoll);
  };

  const handleExportPdf = () => {
    exportToPdf({
      title: 'Rent Roll',
      columns: [
        { key: 'tenant_name', label: 'Tenant' },
        { key: 'property_name', label: 'Property' },
        { key: 'unit_number', label: 'Unit' },
        { key: 'rent_amount', label: 'Rent' },
        { key: 'rent_currency', label: 'Currency' },
        { key: 'due_date', label: 'Due Day' },
        { key: 'start_date', label: 'Start' },
        { key: 'end_date', label: 'End' }
      ],
      rows: rentRoll
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Finance Dashboard</h2>
            <p className="text-xs sm:text-sm text-gray-600">Monthly rent roll and KPIs</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleExportCsv} className="flex-1 sm:flex-none px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">Export CSV</button>
            <button onClick={handleExportPdf} className="flex-1 sm:flex-none px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">Export PDF</button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.propertyId}
            onChange={(e) => updateFilters({ propertyId: e.target.value, unitId: '' })}
          >
            <option value="">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.unitId}
            onChange={(e) => updateFilters({ unitId: e.target.value })}
          >
            <option value="">All Units</option>
            {filteredUnits.map((u) => (
              <option key={u.id} value={u.id}>{u.unit_number}</option>
            ))}
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.month}
            onChange={(e) => updateFilters({ month: Number(e.target.value) })}
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.year}
            onChange={(e) => updateFilters({ year: Number(e.target.value) })}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <div className="flex flex-col sm:flex-row gap-2 col-span-1 sm:col-span-2 md:col-span-1">
            <button
              onClick={() => loadFinance()}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
            <button
              onClick={() => { clearFilters(); loadFinance(); }}
              className="w-full sm:w-auto px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-500">Total Expected</div>
          <div className="text-xl sm:text-2xl font-semibold">{formatCurrency(kpis?.totalExpected || 0)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-500">Total Received</div>
          <div className="text-xl sm:text-2xl font-semibold">{formatCurrency(kpis?.totalReceived || 0)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-500">Arrears</div>
          <div className="text-xl sm:text-2xl font-semibold">{formatCurrency(kpis?.totalArrears || 0)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-500">Collection Rate</div>
          <div className="text-xl sm:text-2xl font-semibold">{(kpis?.collectionRate || 0).toFixed(0)}%</div>
        </div>
      </div>

      {/* Insights: Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly collections trend */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Expected vs Received (Last 6 months)</h3>
          </div>
          <div className="h-64 sm:h-72 md:h-80">
            {monthlySeries?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySeries} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(v) => formatCurrency(Number(v || 0))} />
                  <Legend />
                  <Line type="monotone" dataKey="expected" name="Expected" stroke="#6366F1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="received" name="Received" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data</div>
            )}
          </div>
        </div>

        {/* Expected by property (selected month) */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Expected by Property</h3>
          </div>
          <div className="h-64 sm:h-72 md:h-80">
            {breakdownByProperty?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownByProperty} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <XAxis dataKey="propertyName" hide={breakdownByProperty.length > 6} />
                  <YAxis />
                  <Tooltip formatter={(v) => formatCurrency(Number(v || 0))} />
                  <Legend />
                  <Bar dataKey="expected" name="Expected" fill="#6366F1" />
                  <Bar dataKey="received" name="Received" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data</div>
            )}
          </div>
        </div>

        {/* Payment status breakdown (selected month) */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Status</h3>
          </div>
          <div className="h-64 sm:h-72 md:h-80">
            {breakdownByStatus?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdownByStatus} dataKey="count" nameKey="status" outerRadius={90} label>
                    {breakdownByStatus.map((entry, index) => (
                      <Cell key={`cell-status-${index}`} fill={["#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data</div>
            )}
          </div>
        </div>

        {/* Currency breakdown (selected month) */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Currency Breakdown</h3>
          </div>
          <div className="h-64 sm:h-72 md:h-80">
            {currencyBreakdown?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={currencyBreakdown} dataKey="total" nameKey="currency" outerRadius={90} label>
                    {currencyBreakdown.map((entry, index) => (
                      <Cell key={`cell-curr-${index}`} fill={["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v || 0))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data</div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="p-6">Loading...</div>
        ) : error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : (
          <table className="min-w-[700px] md:min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-4 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-4 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th className="px-4 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Rent</th>
                <th className="px-4 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Due Day</th>
                <th className="px-4 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Start</th>
                <th className="px-4 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase hidden md:table-cell">End</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rentRoll.length === 0 ? (
                <tr>
                  <td className="px-4 sm:px-6 py-6 text-center text-gray-500" colSpan="7">No rows</td>
                </tr>
              ) : (
                rentRoll.map((row) => (
                  <tr key={row.lease_id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{row.tenant_name}</td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{row.property_name}</td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{row.unit_number}</td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{formatCurrency(row.rent_amount)} <span className="text-[10px] sm:text-xs text-gray-500">{row.rent_currency}</span></td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden md:table-cell">{row.due_date}</td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden md:table-cell">{formatDate(row.start_date)}</td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden md:table-cell">{formatDate(row.end_date)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FinanceDashboard;


