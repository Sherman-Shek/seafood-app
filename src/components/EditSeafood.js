import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom" 
import { useDropzone } from "react-dropzone"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { message } from "antd"


function EditSeafood() {
    const { t, i18n } = useTranslation()
    const { id } = useParams(); // 获取 URL 里的 ID
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage()

    const [form, setForm] = useState({ name: "", price: "", category: "" })
    const [imageUrl, setImageUrl] = useState("")

    // 輔助函數：幫你判斷要顯示什麼文字
    const displayLang = (field) => {
        if (!field) return "";
        if (typeof field === 'object') {
            // 如果是新數據(物件)，根據當前語言顯示，如果沒有該語言就默認顯示英文
            return field[i18n.language] || field.en;
        }
        // 如果是舊數據(字串)，直接顯示
        return field;
    }

    // 1. 页面加载时，获取旧数据回显
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/seafood/${id}`)
                const data = res.data
                setForm({
                    name: data.name,
                    price: data.price,
                    category: data.category,
                    unit: data.unit || { en: "", zh: "" } // 确保 unit 字段存在，避免 undefined 错误
                })
                setImageUrl(data.image)
            } catch (err) {
                console.error("Error fetching product:", err)
            }
        }
        fetchProduct()
    }, [id])

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
        const token = localStorage.getItem("token")
        e.preventDefault();
        const payload = { ...form, price: Number(form.price), image: imageUrl };

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/seafood/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
        if (res.ok) {
            messageApi.success("Updated Successfully!")
            navigate("/")
        }
    }

    // ... onDrop 图片上传函数可以直接复用之前的 ...
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0]
        const formData = new FormData()
        formData.append("image", file)

        fetch(`${process.env.REACT_APP_API_URL}/api/seafood/upload`, {
            method: "POST",
            body: formData
        })
            .then(async res => {
                if (!res.ok) {
                    // ✨ 如果报错，尝试读取后端返回的错误文字
                    const errorText = await res.text();
                    throw new Error(`server error ${res.status} - ${errorText}`);
                }
                return res.json();
            })
            .then(json => {
                setImageUrl(json.imageUrl);
            })
            .catch(err => {
                messageApi.error("Failed to upload image! Please try again.")
                console.error("FETCH ERROR:", err.message);
            })
    }
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div>
            {contextHolder}
            <h2>{t("editSeafoodTitle")}</h2>

            <div {...getRootProps()} style={{ border: "2px dashed black", padding: "20px" }}>
                <input {...getInputProps()} />
                <p>{t("dragAndDrop")} 👇</p>
            </div>

            {imageUrl && (
                <div style={{ marginBottom: "20px" }}>
                    <p>{t("imagePreview")}</p>
                    <img
                        // 如果 imageUrl 包含 http 說明是雲端地址，否則加上後端地址
                        src={imageUrl.startsWith("http") ? imageUrl : `http://localhost:5001${imageUrl}`}
                        alt={"Preview"}
                        width="200"
                        style={{ borderRadius: "8px" }}
                    />
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>{t("productNameZh")}</label>
                <input
                    name="name_zh"
                    placeholder={displayLang(product.name)}
                    value={form.name?.zh || ""}
                    onChange={handleChange}
                />
                <p />
                <label>{t("productNameEn")}</label>
                <input
                    name="name_en"
                    placeholder={displayLang(form.name)}
                    value={form.name?.en || ""}
                    onChange={handleChange}
                />
                <p />
                <label>{t("price")}</label>
                <input
                    name="price"
                    type="number"
                    placeholder={displayLang(form.price)}
                    value={form.price}
                    onChange={handleChange}
                />
                <p />
                <label>{t("categoryZh")}</label>
                <input
                    name="category_zh"
                    placeholder={displayLang(form.categoryZh)}
                    value={form.category?.zh || ""}
                    onChange={handleChange}
                />
                <p />
                <label>{t("categoryEn")}</label>
                <input
                    name="category_en"
                    placeholder={displayLang(form.categoryEn)}
                    value={form.category?.en || ""}
                    onChange={handleChange}
                    
                />
                <p />
                <button type="submit">{t("update")}</button>
            </form>
        </div>
    )
}
export default EditSeafood