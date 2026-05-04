import { useEffect, useState } from "react"
import { Table, Select, Tag, message, Button, Space } from "antd"

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. 取得所有訂單
  useEffect(() => {
    fetch("http://localhost:5001/api/orders/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        message.error("載入訂單失敗")
        setLoading(false)
      })
  }, [])

  // 修改状态
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ status })
        }
      )

      const updated = await res.json()
      if (!res.ok) throw new Error(updated.message || "更新失敗")

      setOrders(prev => prev.map(o => (o._id === id ? updated : o)))
      message.success("Status Updated Successfully！")
    } catch (err) {
      message.error(err.message)
    }
  }

  // 删除
  const handleDelete = async (id) => {
    if (!window.confirm("Confirm to delete this order?")) return

    try {
      const res = await fetch(`http://localhost:5001/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (!res.ok) throw new Error("刪除失敗")
      setOrders(prev => prev.filter(o => o._id !== id))
      message.success("The order is deleted")
    } catch (err) {
      message.error(err.message)
    }
  }

  // 4. 定義表格欄位
  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      width: 100,
      render: (id) => <code>...{id.slice(-6)}</code> // 只顯示後六碼
    },
    {
      title: "User Email",
      dataIndex: ["user", "email"], // 支援深層物件
      key: "email",
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
      render: (total) => <b style={{ color: '#d4380d' }}>${total}</b>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => updateStatus(record._id, value)}
          style={{ width: 130 }}
        >
          <Select.Option value="pending"><Tag color="gold">Pending</Tag></Select.Option>
          <Select.Option value="shipped"><Tag color="blue">Shipped</Tag></Select.Option>
          <Select.Option value="completed"><Tag color="green">Completed</Tag></Select.Option>
        </Select>
      )
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            danger
            type="primary"
            size="small"
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: "20px" }}>
      <h1>👑 Admin Orders Management</h1>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  )
}

export default AdminOrders