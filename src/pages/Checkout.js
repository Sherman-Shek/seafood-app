import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, List, Typography, Divider, message, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { Modal, Radio } from 'antd'

const { Title, Text } = Typography;

function Checkout() {
    const { cart, clearCart } = useContext(CartContext);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [paymentType, setPaymentType] = useState('');

    // 模擬 QR Code 網址（你可以換成你真實的支付寶/PayMe 收款碼網址）
    const qrCodes = {
        alipay: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=YourOrderTotal",
        payme: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=YourOrderTotal"
    }

    // 最終提交訂單的邏輯
    const handleFinalSubmit = async () => {
        if (cart.length === 0) {
            message.warning(t("Your cart is empty"))
            return
        }
        setLoading(true)
        // 傳送到後端的 fetch 代碼
        const token = localStorage.getItem("token")

        // 準備訂單數據
        const orderData = {
            items: cart.map(item => ({
                productId: item._id,
                name: item.name, // 包含 {en, zh} 的物件
                price: item.price,
                qty: item.qty || 1
            })),
            shippingAddress: {
                // 這裡從之前 onFinish 暫存的 values 獲取，或直接從 Form 實例獲取
                // 假設你已經將 values 存入一個名為 customerInfo 的 state
                name: document.getElementsByName('name')[0]?.value,
                phone: document.getElementsByName('phone')[0]?.value,
                address: document.getElementsByName('address')[0]?.value,
            },
            paymentMethod: paymentType,
            totalPrice: totalPrice,
            status: "pending_payment" // 初始狀態：待付款
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            })

            if (res.ok) {
                message.success(t("Order Placed Successfully!"));
                setIsModalVisible(false);
                clearCart();
                navigate(`/${i18n.language}/orders`);
            } else {
                const err = await res.json();
                message.error("Order failed: " + err.message);
            }
        } catch (error) {
            console.error("Order Error:", error);
            message.error("Network error, please try again later.");
        } finally {
            setLoading(false);
        }
        setTimeout(() => {
            message.success(t("Order Placed Successfully!"))
            setIsModalVisible(false)
            clearCart()
            navigate(`/${i18n.language}/orders`)
            setLoading(false)
        }, 1500)
    }

    // 計算總價
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    const onFinish = (values) => {
        if (cart.length === 0) {
            message.warning(t("Your cart is empty"))
            return
        }
        setPaymentType(values.paymentMethod)
        console.log("收到的表單資訊:", values)
        if (values.paymentMethod === 'credit_card') {
            // 如果是信用卡，可以直接走原本的成功邏輯
            handleFinalSubmit(values)
        } else {
            // 如果是支付寶或 PayMe，彈出 QR Code
            setIsModalVisible(true)
        }
        //setLoading(true)
        // 這裡模擬發送訂單到後端
    }

    return (
        <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
            <Title level={2}>🚢 {t("Checkout")}</Title>
            <Row gutter={32}>
                {/* 左側：填寫資訊 */}
                <Col xs={24} md={14}>
                    <Card title={t("Shipping Information")} bordered={false} className="custom-card">
                        <Form layout="vertical" onFinish={onFinish}>
                            {/* 在 Shipping Information 下方加入 Payment Method */}
                            <Card title={t("Payment Method")} bordered={false} style={{ marginTop: '20px' }}>
                                <Form.Item name="paymentMethod" label={t("Select Payment")} initialValue="alipay" rules={[{ required: true }]}>
                                    <Radio.Group style={{ width: '100%' }}>
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Radio.Button value="alipay" style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Alipay_logo.svg"
                                                        alt="Alipay"
                                                        style={{ height: '30px' }}
                                                        onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/349/349221.png" }} // 備用圖示
                                                    />
                                                </Radio.Button>
                                            </Col>
                                            <Col span={8}>
                                                <Radio.Button value="payme" style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {/* PayMe的Logo */}
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/1/13/PayMe_Logo.png"
                                                        alt="payme"
                                                        style={{ height: '25px', marginRight: '8px' }}
                                                        onError={(e) => { e.target.style.display = 'none' }} // 如果加載失敗就隱藏圖片只顯示文字
                                                    />                                                <span style={{ fontWeight: 'bold', color: '#ff4d4f', fontSize: '18px' }}>PayMe</span>
                                                </Radio.Button>
                                            </Col>
                                            <Col span={8}>
                                                <Radio.Button value="credit_card" style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    💳 {t("Credit Card")}
                                                </Radio.Button>
                                            </Col>
                                        </Row>
                                    </Radio.Group>
                                </Form.Item>
                            </Card>

                            <Form.Item label={t("Full Name")} name="name" rules={[{ required: true }]}>
                                <Input placeholder="John Doe" />
                            </Form.Item>
                            <Form.Item label={t("Phone")} name="phone" rules={[{ required: true }]}>
                                <Input placeholder="0912-345-678" />
                            </Form.Item>
                            <Form.Item label={t("Shipping Address")} name="address" rules={[{ required: true }]}>
                                <Input.TextArea rows={3} placeholder="Address details..." />
                            </Form.Item>
                            <Divider />
                            <Button type="primary" size="large" block htmlType="submit" loading={loading}>
                                {t("Confirm and Pay")} ${totalPrice}
                            </Button>

                        </Form>
                    </Card>
                </Col>

                {/* 右側：訂單摘要 */}
                <Col xs={24} md={10}>
                    <Card title={t("Order Summary")} bordered={false}>
                        <List
                            itemLayout="horizontal"
                            dataSource={cart}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={typeof item.name === 'object' ? item.name[i18n.language] : item.name}
                                        description={`$${item.price}`}
                                    />
                                </List.Item>
                            )}
                        />
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text strong>{t("Total")}:</Text>
                            <Text strong style={{ color: '#ff4d4f', fontSize: '20px' }}>${totalPrice}</Text>
                        </div>
                    </Card>
                </Col>

                {/* 付款 QR Code Modal */}
                <Modal
                    title={`Pay with ${paymentType?.toUpperCase() || "Payment"}`}
                    open={isModalVisible}
                    onOk={() => handleFinalSubmit()} // 用戶掃碼後按確認
                    onCancel={() => setIsModalVisible(false)}
                    okText="I have paid"
                    cancelText="Cancel"
                >
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>Please scan the QR code below to pay:</p>
                        {paymentType && (
                            <img
                                src={qrCodes[paymentType]}
                                alt="Payment QR Code"
                                style={{ width: '250px', height: '250px', border: '1px solid #f0f0f0' }}
                            />
                        )}
                        <p style={{ marginTop: '10px', color: '#ff4d4f' }}>
                            Total: <span style={{ fontSize: '20px', fontWeight: 'bold' }}>${totalPrice}</span>
                        </p>
                        <small>Please include your name in the payment remark.</small>
                    </div>
                </Modal>
            </Row>
        </div>
    )
}

export default Checkout