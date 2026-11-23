import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { registerAPI } from "../util/ApiList";

const Register = () => {
    const [fields, setFields] = useState({
        email: "",
        password: "",
        role: "author",
        name: ""
    });

    const [error, setError] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    };


    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                email: fields.email || "",
                password: fields.password || "",
                name: fields.name || "",
                role: fields.role || ""
            };

            const response = await fetch(registerAPI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok || !result.status) {
                await Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: result.message
                });
                return;
            }

            await Swal.fire({
                icon: "success",
                title: "Registration Successful!",
                text: result.message,
                confirmButtonText: "Continue"
            });

            if (result.result.role === "author") {
                navigate("/author/dashboard");
            } else if (result.result.role === "admin") {
                navigate("/admin/dashboard");
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
            <form className="login-card" onSubmit={handleRegister}>
                <div className="login-header">
                    <h1>BookLeaf</h1>
                    <h2>Login</h2>
                    <p>Author Support Portal</p>
                </div>

                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    onChange={handleChange}
                    value={fields.name}
                />
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

                <label>Select Role</label>
                <select value={fields.role} name="role" onChange={handleChange}>
                    <option value="author">Author</option>
                    <option value="admin">Admin</option>
                </select>

                <button type="submit">Submit</button>
                <p className="signup-text">
                    you have an account?{" "}
                    <span onClick={() => navigate("/")}>
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Register;