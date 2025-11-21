import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Badge, Dropdown, Spin } from "antd";
import api from "../../config/axios";

const NotificationBell = ({ account }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/notification/unread-list");
      const data = response.data.data || [];
      setNotifications(data.reverse());
      setUnreadCount(data.filter((item) => !item.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (id, read) => {
    if (!read) {
      try {
        await api.get(`/user/notification/mark-as-read?notificationId=${id}`);
        setNotifications((prevList) =>
          prevList.map((item) =>
            item.id === id ? { ...item, read: true } : item
          )
        );
        setUnreadCount((prevCount) => (prevCount - 1 >= 0 ? prevCount - 1 : 0));
      } catch (error) {
        console.error("Error updating read status:", error);
      }
    }
  };

  useEffect(() => {
    if (account?.user) {
      fetchNotifications();
    //   const interval = setInterval(fetchNotifications, 3000);
    //   return () => clearInterval(interval);
    }
  }, [account]);

  // 1. Style cho khung chứa tổng thể (Không cuộn ở đây)
  const containerStyle = {
    minWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
    border: "1px solid #f3f4f6",
    overflow: "hidden", // Để bo góc không bị nội dung che mất
  };

  // 2. Style cho Header "Thông báo" (Cố định)
  const headerStyle = {
    padding: "16px",
    borderBottom: "1px solid #f3f4f6",
    fontWeight: "bold",
    fontSize: "16px",
    color: "#111827",
    backgroundColor: "#fff", // Nền trắng để che nội dung khi cuộn
  };

  // 3. Style cho khu vực danh sách (Cuộn ở đây)
  const listContainerStyle = {
    maxHeight: 400, // Giới hạn chiều cao
    overflowY: "auto", // Cho phép cuộn dọc
    padding: "8px",
  };

  const notificationItemStyle = (read) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "12px 16px",
    marginBottom: 4,
    cursor: read ? "default" : "pointer",
    backgroundColor: read ? "transparent" : "#effdf5",
    borderRadius: 8,
    transition: "all 0.2s ease",
  });

  // Nội dung menu dropdown
  const menuContent = (
    <div style={containerStyle}>
      {/* Phần Header cố định */}
      <div style={headerStyle}>Thông báo</div>

      {/* Phần danh sách có thể cuộn */}
      <div style={listContainerStyle}>
        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>
            Không có thông báo nào
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationAsRead(item.id, item.read)}
              style={notificationItemStyle(item.read)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = item.read ? "#f9fafb" : "#dcfce7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = item.read ? "transparent" : "#effdf5";
              }}
            >
              {!item.read && (
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: item.read ? "500" : "700",
                    color: "#111827",
                    fontSize: "14px",
                    marginBottom: 2,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#4b5563",
                    lineHeight: "1.4",
                    overflowWrap: "break-word",
                  }}
                >
                  {item.content}
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return account?.user ? (
    <Dropdown
      overlay={menuContent}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
      trigger={["click"]}
    >
      <div style={{ cursor: "pointer", display: "inline-block" }}>
        <Badge
          count={unreadCount}
          size="small"
          offset={[-5, 5]}
          style={{
            backgroundColor: "#ef4444",
            boxShadow: "0 0 0 2px #fff",
            fontSize: "10px",
            minWidth: "16px",
            height: "16px",
            lineHeight: "16px",
          }}
        >
          <button
            style={{
              padding: "10px",
              backgroundColor: "transparent",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Bell style={{ height: 24, width: 24, color: "#1f2937" }} strokeWidth={2} />
          </button>
        </Badge>
      </div>
    </Dropdown>
  ) : null;
};

export default NotificationBell;