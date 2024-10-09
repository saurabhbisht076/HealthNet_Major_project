import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-xl">HealthNet</h1>
                <div>
                    <Link to="/login" className="text-white px-4">Login</Link>
                    <Link to="/register" className="text-white px-4">Register</Link>
                    <Link to="/dashboard" className="text-white px-4">Dashboard</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;