import { useState } from "react";
import {
  Users,
  ChevronDown,
  UserCheck,
  Monitor,
  UserRoundX,
  User,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import RecentUsersTable from "../../components/RecentUserTable/RecentUserTable";
import { useGetDashboardAnalyticsQuery } from "../../redux/api/dashboardApi";
import { useGetAllUsersQuery } from "../../redux/api/profileApi";

const DashboardPage = () => {
  const currentYear = new Date().getFullYear();
  const [search, setSearch] = useState("");

  const { data } = useGetDashboardAnalyticsQuery({
    purchaseGrowthYear: currentYear,
    customerGrowthYear: currentYear,
  });


  const dashboardData = data?.data;

  const { data: userss, isLoading, isError, error } = useGetAllUsersQuery({
    status: "active", 
    page: 1,
    limit: 10,
  });

  


  return (
    <div className="min-h-screen p-8 font-sans text-slate-800 ">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Monitor and analyse your MesseMatch application
          </p>
        </div>
      </header>



      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <IndependentChartCard
          title="Monthly Customer Growth"
          type="book"
          dataKey="bookGrowth"
          chartType="area"
        />
        <IndependentChartCard
          title="Event Overview"
          type="blog"
          dataKey="blogGrowth"
          chartType="bar"
        />
      </div>

      {/* Recent Users Table */}
      <div>
        <RecentUsersTable users={userss?.data?.users} isLoading={false} />
      </div>
    </div>
  );
};

const IndependentChartCard = ({ title, type, chartType }) => {
  const STATIC_DASHBOARD_DATA = {
    2024: [
      { month: "January", count: 120 },
      { month: "February", count: 90 },
      { month: "March", count: 150 },
      { month: "April", count: 110 },
      { month: "May", count: 170 },
      { month: "June", count: 140 },
      { month: "July", count: 180 },
      { month: "August", count: 160 },
      { month: "September", count: 130 },
      { month: "October", count: 190 },
      { month: "November", count: 200 },
      { month: "December", count: 220 },
    ],
    2025: [
      { month: "January", count: 100 },
      { month: "February", count: 80 },
      { month: "March", count: 140 },
      { month: "April", count: 120 },
      { month: "May", count: 160 },
      { month: "June", count: 150 },
      { month: "July", count: 170 },
      { month: "August", count: 155 },
      { month: "September", count: 145 },
      { month: "October", count: 175 },
      { month: "November", count: 185 },
      { month: "December", count: 210 },
    ],
    2026: [
      { month: "January", count: 130 },
      { month: "February", count: 95 },
      { month: "March", count: 160 },
      { month: "April", count: 140 },
      { month: "May", count: 180 },
      { month: "June", count: 165 },
      { month: "July", count: 190 },
      { month: "August", count: 175 },
      { month: "September", count: 155 },
      { month: "October", count: 200 },
      { month: "November", count: 215 },
      { month: "December", count: 240 },
    ],
  };

  const [year, setYear] = useState(2026);

  const startYear = 2024;
  const endYear = 2050;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  const chartData =
    STATIC_DASHBOARD_DATA?.[year]?.map((item) => ({
      name: item.month.substring(0, 3),
      count: item.count,
    })) || [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative transition-all hover:shadow-md group">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-slate-800 text-lg group-hover:text-slate-900 transition-colors">
          {title}
        </h3>

        <div className="relative group/select">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 transition-all duration-200 hover:border-slate-400 hover:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-900 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 border-r border-slate-200 pr-2">
              Year
            </span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="appearance-none bg-transparent outline-none text-xs font-bold text-slate-800 cursor-pointer z-10"
            >
              {years.map((y) => (
                <option key={y} value={y} className="text-base">
                  {y}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#F7B115] group-hover/select:text-[#F7B115] transition-colors">
              <ChevronDown size={14} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        {/* {isFetching ? (
          <SkeletonChart />
        ) : ( */}
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#F7B115" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#F7B115" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#F7B115"
                strokeWidth={3}
                fill={`#F7B115`}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#F7B115" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#F7B115" }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="#F7B115"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
        {/* )} */}
      </div>
    </div>
  );
};



const SkeletonStatCard = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <div className="h-3 w-20 bg-slate-100 rounded"></div>
        <div className="h-8 w-12 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="h-12 w-12 bg-slate-100 rounded-xl"></div>
    </div>
  </div>
);

const SkeletonChart = () => {
  const heights = [45, 70, 30, 80, 55, 65];
  return (
    <div className="w-full h-full flex flex-col justify-end gap-4 animate-pulse pt-4">
      <div className="flex items-end justify-between gap-2 h-full px-2">
        {heights.map((h, i) => (
          <div
            key={i}
            className="bg-slate-100 w-full rounded-t-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="h-4 w-full bg-slate-50 rounded" />
    </div>
  );
};

export default DashboardPage;
