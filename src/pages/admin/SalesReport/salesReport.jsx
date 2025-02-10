import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/UI/card"
import { Button } from "../../../components/UI/button"
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts"
import { axiosInstance } from "../../../api/axiosInstance"
import { toast } from "sonner"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/UI/breadcrumbs"
import { saveAs } from "file-saver"

const SalesReport = () => {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterType, setFilterType] = useState("/Daily")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const limit = 15

  useEffect(() => {
    fetchSalesReport()
  }, [filterType, startDate, endDate, page])

  const fetchSalesReport = async () => {
    try {
      setLoading(true)
      const params = {
        filterType,
        page,
        limit,
      }

      if (filterType === "custom") {
        params.startDate = startDate
        params.endDate = endDate
      }

      const response = await axiosInstance.get("/admin/fetchsalesreport", { params })
      setReportData(response.data.data)
      setTotalPages(response.data.totalPages)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
      toast.error("Failed to fetch sales report")
    }
  }

  const handlePdfDownload = async () => {
    try {
      setLoading(true)

      const response = await axiosInstance.get("admin/sales/download/pdf", {
        params: { filterType, startDate, endDate },
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
        },
      })

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "SalesReport.pdf")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)

      setLoading(false)
      toast.success("PDF downloaded successfully")
    } catch (error) {
      setLoading(false)
      toast.error("Failed to download PDF")
      console.error("PDF download error:", error)
    }
  }

  const handleExcelDownload = async () => {
    try {
      const response = await axiosInstance.get("admin/sales/download/excel", {
        params: { filterType, startDate, endDate },
        responseType: "blob",
      })

      const blob = new Blob([response.data], { type: "application/xlsx" })
      saveAs(blob, "SalesReport.xlsx")
      toast.success("Excel file downloaded successfully")
    } catch (error) {
      toast.error("Failed to download Excel file")
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )

  if (error) return <div className="text-red-500 text-center">Error: {error}</div>
  if (!reportData) return null

  const { summary, timeData, orderDetails } = reportData

  const chartData = Object.entries(timeData).map(([time, data]) => ({
    time,
    revenue: data.revenue,
    orders: data.orders,
    products: data.products,
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <header>
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Sales Report</h1>
        </div>
        <div className="container mx-auto px-4 mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/home" className="text-gray-600 hover:text-black">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/Dashboard" className="text-gray-600 hover:text-black">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900">Sales Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        {filterType === "custom" && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value)
                const currentDate = new Date()
                if (selectedDate > currentDate) {
                  toast.error("Select a past date")
                } else {
                  setStartDate(e.target.value)
                }
              }}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                const selectedEndDate = new Date(e.target.value)
                const start = new Date(startDate)
                if (selectedEndDate < start) {
                  toast.error("End date cannot be earlier than the start date")
                } else {
                  setEndDate(e.target.value)
                }
              }}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </>
        )}

        <div className="flex gap-2">
          {["/Daily", "/Weekly", "/Monthly", "/Yearly", "custom"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded ${filterType === type ? "bg-black text-white" : "bg-gray-200 text-black"}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{summary.totalOrders}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">₹{summary.totalRevenue.toFixed(2)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Products Sold</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{summary.totalProducts}</CardContent>
        </Card>
      </div>

      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            <LineChart width={800} height={350} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
            </LineChart>
          </div>
        </CardContent>
      </Card> */}

      {/* Orders Table */}
      {orderDetails.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Customer</th>
                    <th className="p-2 text-left">Order Date</th>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Unit Price</th>
                    <th className="p-2 text-left">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((order) =>
                    order.products.map((item, index) => (
                      <tr key={`${order._id}-${index}`} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          {index === 0 ? order.user.firstName : ""}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {index === 0 ? new Date(order.createdAt).toLocaleDateString() : ""}
                        </td>
                        <td className="py-3 px-6 text-left">{item.productName}</td>
                        <td className="py-3 px-6 text-left">{item.quantity}</td>
                        <td className="py-3 px-6 text-left">₹{item.price.toFixed(2)}</td>
                        <td className="py-3 px-6 text-left">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-white shadow-md rounded-lg">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Sales Data</h2>
          <p className="text-gray-600 text-center">
            There are currently no sales records to display for the selected period.
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end space-x-4">
        <Button onClick={handleExcelDownload} className="bg-green-800 hover:bg-green-700 text-white">
          Download Excel
        </Button>
        <Button onClick={handlePdfDownload} className="bg-red-800 hover:bg-red-700 text-white">
          Download PDF
        </Button>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          {page > 0 && (
            <Button onClick={() => setPage(page - 1)} className="mr-2" variant="outline">
              Previous
            </Button>
          )}
          {page < totalPages - 1 && (
            <Button onClick={() => setPage(page + 1)} variant="outline">
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default SalesReport

