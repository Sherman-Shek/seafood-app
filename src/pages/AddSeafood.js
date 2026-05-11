import { useDropzone } from "react-dropzone"
import { useState } from "react"
import { useNavigate } from "react-router-dom" 
import { Button, Row, Col, Form, Input } from "antd"

// ✅ 2. 确保接收 onAdd 参数
function AddSeafood({ onAdd }) {
    const navigate = useNavigate(); // ✅ 3. 初始化跳转

    const [form, setForm] = useState({
        name: { en: "", zh: "" },
        price: "",
        category: { en: "", zh: "" }
    })

    const [imageUrl, setImageUrl] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target

        // 處理需要分語言的欄位 (例如 name_en, name_zh)
        if (name.includes("_")) {
            const [field, lang] = name.split("_"); // 分割出 name 和 en
            setForm(prev => ({
                ...prev,
                [field]: { ...prev[field], [lang]: value }
            }))
        } else {
            // 處理價格、圖片等不分語言的欄位
            setForm(prev => ({ ...prev, [name]: value }))
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        if (!imageUrl) {
            alert("Please upload picture！")
            return
        }

        const payload = {
            ...form,
            price: Number(form.price) || 0,
            image: imageUrl
        };

        fetch(`${process.env.REACT_APP_API_URL}/api/seafood`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}` // ✅ 就放这里

            },
            body: JSON.stringify(payload)
        })
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text()
                    throw new Error(text)
                }
                return res.json()
            })
            .then(result => {
                console.log("Success:", result);

                // ✅ 4. 关键：通知父组件列表增加了新成员
                // 如果后端返回的是新创建的对象，直接传给 onAdd
                if (onAdd) onAdd(result);

                alert("Added successfully!");

                // ✅ 5. 跳转到产品列表页面
                navigate("/");
            })
            .catch(err => console.error("Added fail:", err));
    }

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0]

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ml_default")

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dwhhusuhf/image/upload",
            {
                method: "POST",
                body: formData
            }
        )
        const data = await res.json()
        //  关键：Cloudinary返回的图片URL
        setImageUrl(data.secure_url)
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h2>Add New Seafood</h2>

            {/* 图片上传区域 */}
            <div {...getRootProps()} style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: 'center',
                marginBottom: '20px',
                cursor: 'pointer'
            }}>
                <input {...getInputProps()} />
                <p>Drag and Drop</p>
            </div>

            {/* 图片预览 */}
            {imageUrl && (
                <div style={{ marginBottom: '20px' }}>
                    <p>Preview: </p>
                    <img
                        src={imageUrl}
                        width="200"
                        alt="preview"
                    />
                </div>
            )}
            <Form layout="vertical"
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>Product Name (English)</label>
                <input
                    type="text"
                    name="name_en"
                    placeholder="Product Name"
                    value={form.name.en}
                    onChange={handleChange}
                    required
                />
                <label>產品名稱 (中文)</label>
                <input
                    type="text"
                    name="name_zh"
                    placeholder="產品名稱"
                    value={form.name.zh}
                    onChange={handleChange}
                    required
                />

                <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    required
                />
                <label>Category (English)</label>
                <input
                    type="text"
                    name="category_en"
                    placeholder="Category"
                    value={form.category.en}
                    onChange={handleChange}
                />
                <label>分類 (中文)</label>
                <input
                    type="text"
                    name="category_zh"
                    placeholder="分類"
                    value={form.category.zh}
                    onChange={handleChange}
                />
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="產地 (Origin - ZH)" name={['origin', 'zh']} rules={[{ required: true }]}>
                            <Input placeholder="例如：日本空運" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Origin (EN)" name={['origin', 'en']} rules={[{ required: true }]}>
                            <Input placeholder="e.g., Japan Air Freight" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="單位 (Unit - ZH)" name={['unit', 'zh']} rules={[{ required: true }]}>
                            <Input placeholder="例如：每斤 / 每隻" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Unit (EN)" name={['unit', 'en']} rules={[{ required: true }]}>
                            <Input placeholder="e.g., per kg / per pc" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="處理建議 (Cooking - ZH/EN)" name={['cookingMethod', 'zh']}>
                    <Input.TextArea placeholder="例如：清蒸、椒鹽" />
                </Form.Item>

                <Button type="primary"
                    htmlType="submit"
                    block
                    style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
                >Add Seafood</Button>
            </Form>
        </div >
    )
}

export default AddSeafood