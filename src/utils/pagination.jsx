const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === number ? "bg-blue-600 text-white" : "bg-gray-700 text-white"} hover:bg-blue-600 transition`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default Pagination;
  