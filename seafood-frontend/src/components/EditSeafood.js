import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 假设你用了路由
import { useDropzone } from "react-dropzone";

function EditSeafood() {
    const { id } = useParams(); // 获取 URL 里的 ID
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", price: "", category: "" });
    const [imageUrl, setImageUrl] = useState("");

    // 1. 页面加载时，获取旧数据回显
    useEffect(() => {
        fetch(`http://localhost:5001/api/seafood/${id}`)
            .then(res => res.json())
            .then(data => {
                setForm({
                    name: data.name,
                    price: data.price,
                    category: data.category
                });
                setImageUrl(data.image); // 回显旧图片
            });
    }, [id]);

    const handleUpdate = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            price: Number(form.price),
            image: imageUrl
        };

        // 2. 发送 PUT 请求更新
        fetch(`http://localhost:5001/api/seafood/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(() => {
                alert("更新成功！");
                navigate("/"); // 跳回列表页
            })
            .catch(err => console.error("Fail!:", err));
    };

    // ... onDrop 图片上传函数可以直接复用之前的 ...
    const onDrop = (acceptedFiles) => {

        const file = acceptedFiles[0]

        const formData = new FormData()
        formData.append("image", file)

        fetch("http://localhost:5001/api/seafood/upload", {
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
            });
    }
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form, price: Number(form.price), image: imageUrl };

        fetch(`http://localhost:5001/api/seafood/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(() => {
                alert("Updated Successfully!");
                navigate("/");
            });
    };

    return (
        // ... JSX 部分基本与 AddSeafood 一致 ...
        // 只需要把按钮文字改成 "Update Seafood"
        <div>
            <h2>Edit Seafood</h2>

            <div {...getRootProps()} style={{ border: "2px dashed black", padding: "20px" }}>
                <input {...getInputProps()} />
                <p>拖图片到这里 👇</p>
            </div>

            {imageUrl && (
                <img
                    src={`http://localhost:5001${imageUrl}`}
                    width="200"
                />
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
    );
}
export default EditSeafood;