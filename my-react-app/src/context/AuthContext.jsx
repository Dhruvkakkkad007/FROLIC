import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

const normalizeUser = (userData) => {
    if (!userData) {
        return null;
    }

    return {
        ...userData,
        isAdmin: Boolean(userData.isAdmin),
        isCoordinator: Boolean(userData.isCoordinator),
        role: userData.role || (userData.isAdmin ? 'admin' : userData.isCoordinator ? 'coordinator' : 'user')
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        await authService.login(credentials);
        const userData = normalizeUser(await authService.getMe());
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        await authService.register(userData);
        const loginCredentials = {
            EmailAddress: userData.EmailAddress,
            UserPassword: userData.UserPassword
        };
        return await login(loginCredentials);
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
            const userData = normalizeUser(await authService.getMe());
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
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
