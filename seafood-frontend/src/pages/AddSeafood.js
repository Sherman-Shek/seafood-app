import { useDropzone } from "react-dropzone"
import { useState } from "react"
import { useNavigate } from "react-router-dom" // ✅ 1. 引入跳转钩子

// ✅ 2. 确保接收 onAdd 参数
function AddSeafood({ onAdd }) {
    const navigate = useNavigate(); // ✅ 3. 初始化跳转

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: ""
    })

    const [imageUrl, setImageUrl] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!imageUrl) {
            alert("请先上传图片！");
            return;
        }

        const payload = {
            ...form,
            price: Number(form.price) || 0,
            image: imageUrl
        };

        fetch("http://localhost:5001/api/seafood", {
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />

                <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                />

                <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                />

                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Add Seafood
                </button>
            </form>
        </div>
    )
}

export default AddSeafood