
import { useMemo, useState } from "react";
import { Table, Modal, Input, Tag, Button, message } from "antd";
import {
  SearchOutlined,
  ExpandOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const initialEvents = [
  {
    _id: "1",
    name: "John Smith",
    email: "john@example.com",
    phoneNumber: "+880 1840560614",
    location: "123 Main St, New York",
    publishedAt: "2025-01-15T09:00:00",
    status: "active",
    title: "Bar Mitzvah of Eliyahu Goldstein",
    category: "Wedding",
    image:
      "https://images.unsplash.com/photo-1519225421980-888cb5c46c4f?w=600",
    date: "August 3, 2025",
    time: "9:00 AM",
    venue: "Temple Beth Shalom, Brooklyn",
    description:
      "Join us as Eliyahu reads from the Torah and becomes a full member of the Jewish community. A festive kiddush luncheon follows the service.",
    boyName: "Eliyahu Goldstein",
    fatherName: "Rabbi Menachem Goldstein",
    sonOfRabbi: "Rabbi Yisroel Goldstein",
    sonInLaw: "Rabbi Chaim Weiss",
  },
  {
    _id: "2",
    name: "John Smith",
    email: "john@example.com",
    phoneNumber: "+880 1840560614",
    location: "123 Main St, New York",
    publishedAt: "2025-01-15T09:00:00",
    status: "rejected",
    title: "Wedding Celebration",
    category: "Wedding",
    image:
      "https://images.unsplash.com/photo-1519225421980-888cb5c46c4f?w=600",
    date: "August 10, 2025",
    time: "6:00 PM",
    venue: "New York City",
    description: "A special wedding celebration with family and friends.",
    boyName: "David Cohen",
    fatherName: "Michael Cohen",
    sonOfRabbi: "Rabbi David",
    sonInLaw: "Jacob Weiss",
  },
  {
    _id: "3",
    name: "John Smith",
    email: "john@example.com",
    phoneNumber: "+880 1840560614",
    location: "123 Main St, New York",
    publishedAt: "2025-01-15T09:00:00",
    status: "active",
    title: "Family Celebration",
    category: "Celebration",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
    date: "August 15, 2025",
    time: "7:00 PM",
    venue: "Brooklyn, New York",
    description: "A family gathering to celebrate a special occasion.",
    boyName: "Daniel Smith",
    fatherName: "Robert Smith",
    sonOfRabbi: "Rabbi Abraham",
    sonInLaw: "Samuel Cohen",
  },
  {
    _id: "4",
    name: "John Smith",
    email: "john@example.com",
    phoneNumber: "+880 1840560614",
    location: "123 Main St, New York",
    publishedAt: "2025-01-15T09:00:00",
    status: "pending",
    title: "Bar Mitzvah Celebration",
    category: "Wedding",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
    date: "August 20, 2025",
    time: "10:00 AM",
    venue: "Brooklyn, New York",
    description: "A traditional Bar Mitzvah celebration.",
    boyName: "Ethan Smith",
    fatherName: "James Smith",
    sonOfRabbi: "Rabbi Aaron",
    sonInLaw: "Benjamin Weiss",
  },
  {
    _id: "5",
    name: "John Smith",
    email: "john@example.com",
    phoneNumber: "+880 1840560614",
    location: "123 Main St, New York",
    publishedAt: "2025-01-15T09:00:00",
    status: "rejected",
    title: "Community Event",
    category: "Community",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
    date: "August 25, 2025",
    time: "5:00 PM",
    venue: "New York City",
    description: "A community event for family and friends.",
    boyName: "Noah Cohen",
    fatherName: "David Cohen",
    sonOfRabbi: "Rabbi Joseph",
    sonInLaw: "Daniel Weiss",
  },
];

const statusStyles = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-600",
};

const statusLabels = {
  active: "Active",
  pending: "Pending",
  rejected: "Reject",
};

const EventDetailsModal = ({ event, onClose, onUpdate }) => {
  if (!event) return null;

  return (
    <Modal
      open={!!event}
      onCancel={onClose}
      footer={null}
      centered
      width={390}
      destroyOnHidden
      styles={{
        body: { padding: 0 },
        content: { padding: 0, overflow: "hidden", borderRadius: 12 },
      }}
    >
      <div className="max-h-[85vh] overflow-y-auto bg-white p-3">
        <img
          src={event.image}
          alt={event.title}
          className="h-24 w-full rounded-md object-cover"
        />

        <div className="mt-3">
          <span className="inline-block rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
            {event.category}
          </span>

          <h2 className="mt-2 text-base font-bold leading-snug text-gray-900">
            {event.title}
          </h2>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5">
            <CalendarOutlined className="text-amber-500" />
            <div className="text-[11px] text-gray-700">
              <p>{event.date}</p>
              <p>{event.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5">
            <EnvironmentOutlined className="text-amber-500" />
            <p className="text-[11px] text-gray-700">{event.venue}</p>
          </div>
        </div>

        <h3 className="mb-2 mt-4 text-xs font-bold text-gray-900">
          About This Event
        </h3>
        <p className="text-[11px] leading-relaxed text-gray-600">
          {event.description}
        </p>

        <h3 className="mb-2 mt-3 text-xs font-bold text-gray-900">
          Bar Mitzvah Boy
        </h3>

        <div className="space-y-2">
          <DetailItem label="Boy's Name" value={event.boyName} />
          <DetailItem label="Father's Name" value={event.fatherName} />
          <DetailItem label="Son of Rabbi" value={event.sonOfRabbi} />
          <DetailItem label="Son-in-law of Rabbi" value={event.sonInLaw} />
        </div>

        {event.status === "pending" ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              className="!h-9 !border-amber-500 !bg-amber-500 !text-xs !font-semibold"
              onClick={() => onUpdate(event._id, "active")}
            >
              Approve
            </Button>

            <Button
              danger
              icon={<CloseOutlined />}
              className="!h-9 !text-xs !font-semibold"
              onClick={() => onUpdate(event._id, "rejected")}
            >
              Reject
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex justify-end">
            <Tag color={event.status === "active" ? "green" : "red"}>
              {statusLabels[event.status]}
            </Tag>
          </div>
        )}
      </div>
    </Modal>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex items-center gap-2 rounded-lg border border-gray-100 p-2">
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500">
      <UserOutlined className="text-xs" />
    </div>

    <div className="min-w-0">
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="break-words text-[11px] font-medium text-gray-800">
        {value || "—"}
      </p>
    </div>
  </div>
);

const EventManagement = () => {
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesFilter =
        filter === "all" || event.status === filter;

      const query = search.toLowerCase();

      const matchesSearch = [
        event.title,
        event.name,
        event.email,
        event.phoneNumber,
        event.location,
        event.venue,
      ].some((value) => value?.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [events, filter, search]);

  const handleUpdateStatus = (id, status) => {
    setEvents((previous) =>
      previous.map((event) =>
        event._id === id ? { ...event, status } : event
      )
    );

    setSelectedEvent(null);
    message.success(
      status === "active"
        ? "Event approved successfully"
        : "Event rejected successfully"
    );
  };

  const columns = [
    {
      title: "#",
      key: "avatar",
      width: 55,
      render: (_, record) => (
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            record.name
          )}&background=E5E7EB&color=374151`}
          alt={record.name}
          className="h-7 w-7 rounded-full"
        />
      ),
    },
    {
      title: "User",
      key: "user",
      width: 140,
      render: (_, record) => (
        <div>
          <p className="text-[11px] font-medium text-gray-800">
            {record.name}
          </p>
          <p className="text-[10px] text-gray-500">{record.email}</p>
        </div>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 135,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 160,
    },
    {
      title: "Event Published Date",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 150,
      render: (value) =>
        new Date(value).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
            statusStyles[status]
          }`}
        >
          {statusLabels[status]}
        </span>
      ),
    },
    {
      title: "Details",
      key: "details",
      width: 75,
      align: "center",
      render: (_, record) => (
        <button
          type="button"
          onClick={() => setSelectedEvent(record)}
          aria-label={`View ${record.title}`}
          className="text-gray-800 transition hover:text-amber-500"
        >
          <ExpandOutlined />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full space-y-4 bg-white p-4 md:p-6">
      <div>
        <h1 className="text-lg font-bold text-gray-900">
          Events Management
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          View, search, and manage all Events
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 md:flex-row md:items-center md:justify-between">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!h-9 !w-full md:!max-w-sm"
        />

        <div className="flex flex-wrap gap-2">
          {[
            { label: "All Events", value: "all" },
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
            { label: "Reject", value: "rejected" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                filter === item.value
                  ? "bg-[#F7B115] text-white"
                  : "border border-gray-100 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <Table
          columns={columns}
          dataSource={filteredEvents}
          rowKey="_id"
          pagination={false}
          scroll={{ x: 850 }}
          size="small"
          locale={{ emptyText: "No events found" }}
          rowClassName="text-xs"
        />
      </div>

      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onUpdate={handleUpdateStatus}
      />
    </div>
  );
};

export default EventManagement;
