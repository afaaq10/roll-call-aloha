/**
 * 
 * @author: Afaaq Majeed
 * 
 * @project: Roll-Call Aloha
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from './../firebase';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await loginAdmin(username, password);
        if (success) {
            onLogin();
            navigate("/");
        } else {
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-sm p-8 bg-white border border-gray-100 shadow-2xl rounded-xl">
                <h1 className="mb-8 text-[18px] font-semibold text-center text-gray-900 md:text-2xl">ALOHA ATTENDANCE</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-4 text-sm transition ease-in-out border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-4 text-sm transition ease-in-out border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 text-lg font-semibold text-white transition duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
