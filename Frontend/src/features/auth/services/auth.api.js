import axios from 'axios'

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export async function register({email, username, password}){
    const response = api.post('/api/auth/register',
        {email, username, password}
    )
    return response.data
}


export async function login({email, password, username}){
    const response =api.post("/api/auth/login", 
        {username, email, password}
    )
    return response.data
}


export async function getMe(){
    const response = api.get("/api/auth/get-me")

    return response.data
}

export async function logout(){
    const response = api.get("/api/auth/logout")

    return response.data
}