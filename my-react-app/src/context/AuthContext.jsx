import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        await authService.login(credentials);
        const userData = await authService.getMe();
        setUser(userData);
        return userData;
    };


    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
        }
    };

    const checkAuthStatus = async () => {
        try {
            const userData = await authService.getMe();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
