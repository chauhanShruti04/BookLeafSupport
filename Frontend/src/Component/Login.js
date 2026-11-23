import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../util/ApiList";
import Swal from "sweetalert2";

const Login = () => {
    const [fields, setFields] = useState({
        email: "",
        password: "",
        role: "author"
    });

    const [error, setError] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                email: fields.email || "",
                password: fields.password || ""
            };

            const response = await fetch(loginAPI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.status) {
                localStorage.setItem("token", result.result.token);
                await Swal.fire({
                    icon: "success",
                    title: "Login Successful!",
                    text: result.message,
                    confirmButtonText: "Continue"
                });

                if (result.result.role === "author") {
                    navigate("/author/dashboard");
                } else if (result.result.role === "admin") {
                    navigate("/admin/dashboard");
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: result.message
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong. Please try again."
            });
        }
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleLogin}>
                <div className="login-header">
                    <h1>BookLeaf</h1>
                    <h2>Login</h2>
                    <p>Author Support Portal</p>
                </div>
                <label>Email Address</label>
                <input
                    type="text"
                    name="email"
                    placeholder="Enter Email Address"
                    onChange={handleChange}
                    value={fields.email}
                />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    value={fields.password}
                />

                {/* <label>Select Role</label>
                <select value={fields.role} name="role" onChange={handleChange}>
                    <option value="author">Author</option>
                    <option value="admin">Admin</option>
                </select> */}

                <button type="submit">Submit</button>

                <p className="signup-text">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")}>
                        Sign Up
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;