import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

function SeafoodDetail() {
    const { id } = useParams()
    const [item, setItem] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:5001/api/seafood/${id}`)
            .then(res => res.json())
            .then(data => setItem(data))
    }, [id])

    if (!item) return <div>Loading...</div>

    function SeafoodDetail({ addToCart }) {
        <button onClick={() => addToCart(item)}>
            🛒 Add to Cart
        </button>
    }

    return (

        <div style={{ padding: "20px" }}>


            <h1>{item.name}</h1>

            <button>🛒 Add to Cart</button>

            <button onClick={() => window.history.back()}>
                ⬅️ Back
            </button>

            <img
                src={`/images/${item.image}`}
                alt={item.name}
                style={{ width: "300px", borderRadius: "10px" }}
            />

            <h2>${item.price}</h2>
            <p>{item.description}</p>
        </div>
    )
}

export default SeafoodDetail