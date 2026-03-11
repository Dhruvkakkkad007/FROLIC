import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-dark">
            <Navbar />
            <main className="flex-grow pt-24 md:pt-32">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
