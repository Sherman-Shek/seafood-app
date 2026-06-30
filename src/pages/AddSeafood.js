import { useDropzone } from "react-dropzone"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Row, Col, Form, Input, message } from "antd"
import { useTranslation } from "react-i18next"
import axios from "axios"

function AddSeafood({ onAdd }) {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage()

    const [form, setForm] = useState({
        name: { en: "", zh: "" },
        price: "",
        category: "", 
        unit: { en: "kg", zh: "公斤" } 
    })

    const [imageUrl, setImageUrl] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name.includes("_")) {
            const [field, lang] = name.split("_")
            setForm(prev => ({
                ...prev,
                [field]: { ...prev[field], [lang]: value }
            }))
        } else {
            setForm(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!imageUrl) {
            messageApi.error("Please upload a picture!")
            return
        }

        const token = localStorage.getItem("token")
        if (!token) {
            messageApi.error("Please login first!")
            return
        }

        const payload = {
            name: { zh: form.name.zh, en: form.name.en },
            price: Number(form.price) || 0,
            category: form.category,
            image: imageUrl,
            unit: {
                zh: form.unit.zh,
                en: form.unit.en
            }
        }

        try {
        
            await axios.post(`${process.env.REACT_APP_API_URL}/api/seafood`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            })
            messageApi.success("Added Successfully!")
            
            setTimeout(() => navigate(`/${i18n.language}`), 1500)
            
        } catch (err) {
            console.error(err)
            messageApi.error(err.response?.data?.error || "Failed to add product")
        }
    }

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0]

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ml_default")

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dwhhusuhf/image/upload",
                {
                    method: "POST",
                    body: formData
                }
            )
            const data = await res.json()
            setImageUrl(data.secure_url)
            messageApi.success("Image uploaded successfully!")
        } catch (error) {
            messageApi.error("Image upload failed!")
        }
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            {contextHolder}
            <h2>{t("addProductTitle") || "Add Product"}</h2>

            {/* 圖片上傳區域 */}
            <div {...getRootProps()} style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: 'center',
                marginBottom: '20px',
                cursor: 'pointer'
            }}>
                <input {...getInputProps()} />
                <p>{t("dragAndDrop") || "Drag & drop image here, or click to select"}</p>
            </div>

            {/* 圖片預覽 */}
            {imageUrl && (
                <div style={{ marginBottom: '20px' }}>
                    <p>{t("preview") || "Preview:"}</p>
                    <img
                        src={imageUrl}
                        width="200"
                        alt="preview"
                    />
                </div>
            )}
            
            <form layout="vertical"
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>{t("productNameEn") || "Name (EN)"}</label>
                <input
                    type="text"
                    name="name_en"
                    placeholder={t("productPlaceholderEn")}
                    value={form.name.en}
                    onChange={handleChange}
                    required
                />
                
                <label>{t("productNameZh") || "Name (ZH)"}</label>
                <input
                    type="text"
                    name="name_zh"
                    placeholder={t("productPlaceholderZh")}
                    value={form.name.zh}
                    onChange={handleChange}
                    required
                />
                
                <label>{t("price") || "Price"}</label>
                <input
                    name="price"
                    type="number"
                    placeholder={t("pricePlaceholder")}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                />

                <label>{t("categoryZh") || "Category"}</label>
                <input
                    name="category"
                    placeholder={t("categoryPlaceholderZh")}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                />

                <label>{t("categoryEn") || "Category"}</label>
                <input
                    name="category"
                    placeholder={t("categoryPlaceholderEn")}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                />

                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
                    {t("addProductButton") || "Submit"}
                </button>
            </form>
        </div>
    )
}

export default AddSeafood