import React, { useState, useEffect } from "react";
import { Card } from "../../../components/UI/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/UI/table";
import {
  User,
  Search,
  ChevronUp,
  ChevronDown,
  Filter,
  RefreshCw,
} from "lucide-react";
import { axiosInstance } from "../../../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../../../utils/pagination";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/fetchUserData",{
        params: { page: currentPage, limit }
      });
      setCustomers(response.data.users);
      setTotalPages(response.data.totalPages);

      console.log(response.isActive);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch customers");
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = React.useMemo(() => {
    let sortableCustomers = [...customers];
    if (sortConfig.key !== null) {
      sortableCustomers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCustomers;
  }, [customers, sortConfig]);

  const handleBlockUser = async (userId) => {
    try {
      await axiosInstance.put(`/admin/handleBlockUser/${userId}`);
      fetchCustomers();
      toast.success("User blocked successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to block user");
      toast.error("Failed to block user");
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await axiosInstance.put(`/admin/unblockUser/${userId}`);
      fetchCustomers();
      toast.success("User unblocked successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to unblock user");
      toast.error("Failed to unblock user");
    }
  };

  const filteredCustomers = sortedCustomers.filter(
    (customer) =>
      (customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeFilter === "All" ||
        (activeFilter === "Active" && !customer.isBlocked) ||
        (activeFilter === "Blocked" && customer.isBlocked))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-lg animate-pulse text-blue-400">
          Loading customers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-red-400 bg-red-900/50 p-4 rounded-lg shadow-lg font-semibold">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 to-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <User className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl font-extrabold text-white">
              Customer Management
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-3 w-full bg-white/10 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
            </div>
            <button
              onClick={fetchCustomers}
              className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {["All", "Active", "Blocked"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm transition flex items-center ${
                activeFilter === filter
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Filter size={16} className="mr-2" />
              {filter}
            </button>
          ))}
        </div>

        <Card className="rounded-xl shadow-lg bg-gray-800/50 border border-gray-700">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {["Name", "Email", "Created At", "Status"].map((header) => (
                    <TableHead
                      key={header}
                      className="cursor-pointer hover:bg-white/5 transition-colors text-blue-300 font-semibold"
                      onClick={() =>
                        handleSort(header.toLowerCase().replace(" ", ""))
                      }
                    >
                      <div className="flex items-center">
                        {header}
                        {sortConfig.key ===
                          header.toLowerCase().replace(" ", "") && (
                          <span className="ml-2">
                            {sortConfig.direction === "ascending" ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer._id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <span className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold">
                            {customer.firstName
                              ? customer.firstName.charAt(0).toUpperCase()
                              : "N/A"}
                          </span>
                        </div>
                        {customer.firstName || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-blue-200">
                      {customer.email}
                    </TableCell>
                    <TableCell className="text-blue-100">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {customer.isBlocked ? (
                        <button
                          onClick={() => {
                            const confirmation = window.confirm(
                              "Are you sure you want to unblock this user?"
                            );
                            if (confirmation) {
                              handleUnblockUser(customer._id);
                            }
                          }}
                          className="px-3 py-1 bg-green-600/20 text-green-400 rounded-md hover:bg-green-600/30 transition-colors"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const confirmation = window.confirm(
                              "Are you sure you want to block this user?"
                            );
                            if (confirmation) {
                              handleBlockUser(customer._id);
                            }
                          }}
                          className="px-3 py-1 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 transition-colors"
                        >
                          Block
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        <Pagination 
      currentPage={currentPage} 
      totalPages={totalPages} 
      handlePageChange={handlePageChange} 
    />
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default Customers;
