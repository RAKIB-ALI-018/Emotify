//** 2. State Management Layer 
// Responsibility: Store and manage application data. This layer decides: 
// * What data exists
// * When data changes
// * Who can access the data
import { useState } from 'react'
import { createContext } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}