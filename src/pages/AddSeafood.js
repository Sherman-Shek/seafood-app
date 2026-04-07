import { useDropzone } from "react-dropzone"
import { useState } from "react"

function AddSeafood() {

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: ""
    })

    const [imageUrl, setImageUrl] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. 检查图片是否已上传
        if (!imageUrl) {
            alert("请先上传图片！");
            return;
        }

        // 2. 构建提交对象
        const payload = {
            ...form,  // 展开 form 中的 name, price, category
            price: Number(form.price) || 0,  // 确保 price 是数字，如果输入非法则默认为 0
            image: imageUrl // 合并图片地址
        };

        fetch("http://localhost:5001/api/seafood", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                alert("Added successfully!");

                // ✨ 新增：提交成功后重置表单和图片
                setForm({ name: "", price: "", category: "" });
                setImageUrl("");
            })
            .catch(err => console.error("Added fail:", err));
    };

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

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return (
        <div>
            <h2>Upload Image</h2>

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

                <button type="submit">Add Seafood</button>
            </form>

        </div>
    )
}

export default AddSeafood