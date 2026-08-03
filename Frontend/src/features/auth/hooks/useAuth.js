//* Hook layer

import { register, login, getMe, logout } from "../services/auth.api"
import { useContext } from "react"
import { AuthContext } from "../auth.context"


export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    async function registerHandler({ username, email, password }) {
        setLoading(true);
        const data = await register({ username, email, password })
        setUser(data.user)
        setLoading(false)
    }


    async function loginHandler({ username, email, password }) {
        setLoading(true);
        const data = await login({ username, email, password })
        setUser(data.user)
        setLoading(false)
    }

    async function getMeHandler() {
        setLoading(true);
        const data = await getMe()
        setUser(data.user)
        setLoading(false)
    }

    async function logoutHandler(){
        setLoading(true)
        const data = await logout()
        setUser(null)
        setLoading(false)
    }

    return (
        {user, loading, registerHandler, loginHandler, getMeHandler, logoutHandler }
    )
}