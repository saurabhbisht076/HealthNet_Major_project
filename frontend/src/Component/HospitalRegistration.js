import React, { useState } from 'react';
import axios from 'axios';

const HospitalRegistration = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [facilities, setFacilities] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://localhost/5000/api/hospitals", {
                name,
                location,
                facilities: facilities.split(',').map(facility => facility.trim()), // Convert comma-separated string to array
            });
            console.log('Hospital registered successfully:', response.data);
            // Handle successful registration (e.g., clear form or show success message)
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
        }
    };

    return (
        <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Register Hospital</h2>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hospital Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="facilities" className="block text-sm font-medium text-gray-700">Facilities (comma-separated)</label>
                <input
                    type="text"
                    id="facilities"
                    name="facilities"
                    value={facilities}
                    onChange={(e) => setFacilities(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Register Hospital
            </button>
        </form>
    );
};

export default HospitalRegistration;