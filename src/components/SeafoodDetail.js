import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"


function SeafoodDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const { addToCart } = useContext(CartContext)

  useEffect(() => {
    fetch(`http://localhost:5001/api/seafood/${id}`)
      .then(res => res.json())
      .then(data => setItem(data))
  }, [id])

  if (!item) return <p>Loading...</p>

  return (
    <div style={{ padding: "40px" }}>
      <h2>Seafood Detail</h2>

      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        ← Back
      </button>

      <h1>{item.name}</h1>

      <img
        src={item.image}
        alt={""}
        style={{
          width: "300px",
          cursor: "pointer",
          transition: "0.3s"
        }}
      />

      <p>{item.description}</p>

      <h2>${item.price}</h2>

      <div>
        <h3>{item.name}</h3>
        <button onClick={() => addToCart(item)}>
          Add To Cart
        </button>
      </div>

    </div>


  )
}

export default SeafoodDetail