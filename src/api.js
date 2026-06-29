import axios from "axios"

<<<<<<< HEAD
const API = axios.create({baseURL:"http://localhost:5000/api"})

useEffect(()=>{
  fetch("http://localhost:5000/api/seafood")
    .then(res => res.json())
    .then(data => console.log(data))
},[])
=======
const API = axios.create({ baseURL: "http://localhost:5000/api" })

useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/api/seafood`)
    .then(res => res.json())
    .then(data => console.log(data))
}, [])
>>>>>>> d5204add12035393f69d20dd7d8b1fa38f64ee60


export default API 
