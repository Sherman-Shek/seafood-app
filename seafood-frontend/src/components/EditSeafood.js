import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom" // 假设你用了路由
import { useDropzone } from "react-dropzone"
import { useTranslation } from "react-i18next"
import axios from "axios"

function EditSeafood() {
    const { i18n } = useTranslation()
    const { id } = useParams(); // 获取 URL 里的 ID
    const navigate = useNavigate()

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
        alert("Updated Successfully!");
        navigate("/");
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
                throw new Error(`服务器错误: ${res.status} - ${errorText}`);
            }
            return res.json();
        })
        .then(json => {
            setImageUrl(json.imageUrl);
        })
        .catch(err => {
            console.error("FETCH ERROR:", err.message);
        })
}
const { getRootProps, getInputProps } = useDropzone({ onDrop });

return (
    // ... JSX 部分基本与 AddSeafood 一致 ...
    // 只需要把按钮文字改成 "Update Seafood"
    <div>
        <h2>Edit Seafood</h2>

        <div {...getRootProps()} style={{ border: "2px dashed black", padding: "20px" }}>
            <input {...getInputProps()} />
            <p>Drag and Drop here 👇</p>
        </div>

        {imageUrl && (
            <div style={{ marginBottom: "20px" }}>
                <p>Preview: </p>
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
            <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                }
            />

            <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                }
            />

            <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                }
            />

            <button type="submit">Update</button>
        </form>
    </div>
)
}
export default EditSeafood