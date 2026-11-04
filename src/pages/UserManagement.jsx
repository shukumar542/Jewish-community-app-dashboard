import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Pagination } from "../components/Pagination";
import RecentUsersTable from "../components/RecentUserTable/RecentUserTable";
import { useGetAllUsersQuery } from "../redux/api/profileApi";

const STATUS_FILTERS = [
  { label: "All Users", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue]);


  const { data, isLoading } = useGetAllUsersQuery({
    status: activeStatus,
    page: currentPage,
    limit: 10,
    ...(search && { search }),
  });

  
  const users = data?.data?.users || [];
  const totalPages = data?.meta?.pagination?.totalPages || 1;

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Users Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor all platform users
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 mb-10 border p-2 rounded-md border-[#e1e2e6]">
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              size={20}
              className="text-gray-400 group-focus-within:text-slate-600 transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Search by user..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="block w-full pl-12 pr-4 py-2 bg-[#E8ECEF] border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl transition-all outline-none"
          />
        </div>
        <div className="flex gap-5">
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleStatusFilter(value)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg ${
                activeStatus === value
                  ? "bg-[#F7B115] text-white"
                  : "bg-[#E8ECEF] text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <RecentUsersTable users={users} isLoading={isLoading} />

      <div className="mt-5">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}