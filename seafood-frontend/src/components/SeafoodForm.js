import React, { useState } from "react"

function SeafoodForm({ onAdd }) {
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

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch("http://localhost:5001/api/seafood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        console.log("ADDED:", data)
        onAdd(data)

        // 清空表单
        setForm({ name: "", price: "", description: "" })
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Seafood 🦞</h2>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />

      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <button type="submit">Add</button>
    </form>
  )
}

export default SeafoodForm