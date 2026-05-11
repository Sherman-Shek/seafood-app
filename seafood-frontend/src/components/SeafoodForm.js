import { useState } from "react"

function SeafoodForm({ onAdd }) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState(null)

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append("image", file)

      // 👉 上传图片
      const uploadRes = await fetch(`${process.env.REACT_APP_API_URL}/api/seafood/upload`, {
        method: "POST",
        body: formData
      })

      const uploadData = await uploadRes.json()

      // 👉 创建商品
      const newItem = {
        name,
        price,
        description,
        image: uploadData.imageUrl
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/seafood`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(newItem)
      })

      const saved = await res.json()

      onAdd(saved)

    } catch (err) {
      console.error("ERROR:", err)
    }
  }

  return (
    <>
    </>
  )
}

export default SeafoodForm

