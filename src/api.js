import axios from "axios"

const API = axios.create({ baseURL: "http://localhost:5000/api" })

useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/api/seafood`)
    .then(res => res.json())
    .then(data => console.log(data))
}, [])


export default API 
