import axios from "axios"

const API = axios.create({baseURL:"http://localhost:5000/api"})

useEffect(()=>{
  fetch("http://localhost:5000/api/seafood")
    .then(res => res.json())
    .then(data => console.log(data))
},[])


export default API 
