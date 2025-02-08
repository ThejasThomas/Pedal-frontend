import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/UI/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/UI/select";
import { SalesChart } from "../../../components/admin/dashboardComponents/SalesChart";
import { TopSellingItems } from "../../../components/admin/dashboardComponents/TopSellingProducts";
import { axiosInstance } from "../../../api/axiosInstance";

export const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [timeFilter, setTimeFilter] = useState("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/admin/fetchDashboard?timeFilter=${timeFilter}`
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFilter]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }
  console.log("tooo", dashboardData.salesChart);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Total Customers", value: dashboardData.totalCustomers },
          {
            title: "Total Sales",
            value: `Rs.${dashboardData.totalSales.toFixed(2)}`,
          },
          { title: "Total Orders", value: dashboardData.totalOrders },
          { title: "Total Products", value: dashboardData.totalProducts },
        ].map((metric, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4">
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px] text-white bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-700 focus:ring focus:ring-blue-500">
            <SelectValue placeholder="Select time filter" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border border-gray-700 rounded-lg">
            <SelectItem value="week" className="hover:bg-gray-700 px-4 py-2">
              Week
            </SelectItem>
            <SelectItem value="month" className="hover:bg-gray-700 px-4 py-2">
              Month
            </SelectItem>
            <SelectItem value="year" className="hover:bg-gray-700 px-4 py-2">
              Year
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sales Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={dashboardData.salesChart} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TopSellingItems
          title="Best Selling Products"
          items={dashboardData.bestProducts}
        />
        <TopSellingItems
          title="Best Selling Categories"
          items={dashboardData.bestCategories}
        />
      </div>
    </div>
  );
};
