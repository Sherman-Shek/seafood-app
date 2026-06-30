import { useDropzone } from "react-dropzone"
import { useState } from "react"
import { useNavigate } from "react-router-dom" // ✅ 1. 引入跳转钩子
import { Button, Row, Col, Form, Input, message } from "antd"
import { useTranslation } from "react-i18next"

// ✅ 2. 确保接收 onAdd 参数
function AddSeafood({ onAdd }) {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate() // ✅ 3. 初始化跳转
    const [messageApi, contextHolder] = message.useMessage()

    const [form, setForm] = useState({
        name: { en: "", zh: "" },
        price: "",
        category: { en: "", zh: "" },
        unit: { en: "", zh: "" }
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
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!imageUrl) {
            messageApi.error("Please upload a picture!")
            return
        }

        const payload = {
            ...form,
            name: { zh: nameZh, en: nameEn },
            price: Number(form.price) || 0,
            category: category,
            image: imageUrl,
            unit: {
                zh: unitZh,
                en: unitEn
            }
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/seafood`, productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            messageApi.success("Added Successfully!");
        } catch (err) {
            console.error(err);
        }
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
        //  關鍵：Cloudinary返回的圖片URL
        setImageUrl(data.secure_url)
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            {contextHolder}
            <h2>{t("addProductTitle")}</h2>

            {/* 圖片上傳區域 */}
            <div {...getRootProps()} style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: 'center',
                marginBottom: '20px',
                cursor: 'pointer'
            }}>
                <input {...getInputProps()} />
                <p>{t("dragAndDrop")}</p>
            </div>

            {/* 圖片預覽 */}
            {imageUrl && (
                <div style={{ marginBottom: '20px' }}>
                    <p>{t("preview")}</p>
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
                <label>{t("product_name_en")}</label>
                <input
                    type="text"
                    name="name_en"
                    placeholder={t("product_name_en_placeholder")}
                    value={form.name.en}
                    onChange={handleChange}
                    required
                />
                <label>{t("product_name_zh")}</label>
                <input
                    type="text"
                    name="name_zh"
                    placeholder={t("product_name_zh_placeholder")}
                    value={form.name.zh}
                    onChange={handleChange}
                    required
                />
                <label>{t("price")}</label>
                <input
                    name="price"
                    type="number"
                    placeholder={t("price_placeholder")}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                />

                <input
                    name="category"
                    placeholder={t("category_placeholder")}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                />

                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {t("addProductButton")}
                </button>
            </form>
        </div>
    )
}

export default AddSeafood