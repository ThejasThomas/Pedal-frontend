import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { axiosInstance } from "../../api/axiosInstance"
import Pagination from "../../utils/pagination"

const WalletPage = () => {
  const [walletData, setWalletData] = useState(null)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  const user = useSelector((store) => store.user.users)

  useEffect(() => {
    fetchWalletData(currentPage)
    loadRazorpayScript()
  }, [currentPage])

  const loadRazorpayScript = () => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setIsScriptLoaded(true)
    script.onerror = () => {
      toast.error("Failed to load payment system")
      setIsScriptLoaded(false)
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }

  const fetchWalletData = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/user/wallet/${user._id}?page=${page}`)
      setWalletData(response.data.wallet)
      setTotalPages(response.data.totalPages)
      setCurrentPage(response.data.currentPage)
    } catch (error) {
      toast.error("Failed to fetch wallet data")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleAddFunds = async (e) => {
    e.preventDefault()
    if (!isScriptLoaded) {
      toast.error("Payment system not loaded. Please refresh.")
      return
    }

    const enteredAmount = Number.parseFloat(amount)

    if (!enteredAmount || enteredAmount <= 0) {
      toast.error("Enter a valid amount")
      return
    }
    if (enteredAmount > 10000) {
      toast.error("You cannot add more than ₹10,000 at a time")
      return
    }
    const options = {
      key: "rzp_test_ZOhN3ZFy8RT4rn", 
      amount: Number.parseFloat(amount) * 100,
      currency: "INR",
      name: "PEDALQUEST",
      description: "Add funds to wallet",
      handler: async (response) => {
        if (response.razorpay_payment_id) {
          try {
            const addFundsResponse = await axiosInstance.post(`/user/walletadd/`, {
              userId: user._id,
              amount: Number.parseFloat(amount),
              paymentId: response.razorpay_payment_id,
            })
            setWalletData(addFundsResponse.data)
            setAmount("")
            toast.success(`${amount} rupees added successfully`)
            fetchWalletData(currentPage)
          } catch (error) {
            toast.error("Failed to add funds to wallet")
          }
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      theme: {
        color: "#3399cc",
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
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
            type="number"
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
            disabled={!isScriptLoaded}
          >
            {isScriptLoaded ? "Add Funds" : "Loading..."}
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
                        className={`font-medium ${
                          transaction.transactionType === "credit" ? "text-green-600" : "text-red-600"
                        }`}
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
            <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
          </div>
        ) : (
          <p className="text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  )
}

export default WalletPage

