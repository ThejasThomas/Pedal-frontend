import React, { useState, useEffect } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { axiosInstance } from "../../api/axiosInstance"

const WalletPage = () => {
  const [walletData, setWalletData] = useState(null)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const user = useSelector((store) => store.user.users)

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/user/wallet/${user._id}`)
      setWalletData(response.data)
    } catch (error) {
      toast.error("Failed to fetch wallet data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddFunds = async (e) => {
    e.preventDefault()
    console.log('userId',user._id);
    
    try {
      const response = await axiosInstance.post(`/user/walletadd/`, {
        userId: user._id,
        amount: Number.parseFloat(amount),
      })
      setWalletData(response.data)
      setAmount("")
      toast.success("Funds added successfully")
    } catch (error) {
      toast.error("Failed to add funds")
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Current Balance</h2>
        <p className="text-4xl font-bold text-green-600">₹{walletData?.balance?.toFixed(2)}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add Funds</h2>
        <form onSubmit={handleAddFunds} className="flex items-center">
          <input
            type=""
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="border rounded-l px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-r hover:bg-blue-600 transition duration-200"
          >
            Add Funds
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
        {walletData?.transactions?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Amount</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {walletData.transactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`font-medium ${transaction.transactionType === "credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">₹{transaction.amount.toFixed(2)}</td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`font-medium ${
                          transaction.transactionStatus === "completed"
                            ? "text-green-600"
                            : transaction.transactionStatus === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {transaction.transactionStatus.charAt(0).toUpperCase() + transaction.transactionStatus.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  )
}

export default WalletPage

