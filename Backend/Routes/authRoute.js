const express = require('express');
const router = express.Router();
const userModel = require('../Model/userSchema');
const { generateToken } = require("../util/generateToken");
const bcrypt = require('bcrypt');





router.post("/register", async (req, resp) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            return resp.status(409).json({
                status: false,
                message: "please fill the required detail",
            });
        }

        const findUser = await userModel.findOne({
            email: email.trim()
        });

        if (findUser) {
            return resp.status(409).json({
                status: false,
                message: "user already registered",
            });
        }

        // Only one admin can be created
        if (role === "admin") {
            const existingAdmin = await userModel.findOne({
                role: "admin"
            });

            if (existingAdmin) {
                return resp.status(409).json({
                    status: false,
                    message: "Only one admin account can be created",
                });
            }
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return resp.status(500).json({
                    status: false,
                    message: "Password encryption failed"
                });
            }

            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return resp.status(500).json({
                        status: false,
                        message: "Password encryption failed"
                    });
                }

                const createUser = await userModel.create({
                    name,
                    email: email.trim(),
                    password: hash,
                    role
                });

                const token = generateToken(createUser);

                return resp.status(200).json({
                    status: true,
                    message: "user created successfully",
                    result: {
                        name: createUser.name,
                        email: createUser.email,
                        role: createUser.role,
                        id: createUser._id
                    }
                });
            });
        });

    } catch (err) {
        return resp.status(500).json({
            status: false,
            message: "something went wrong",
            err: err.message
        });
    }
});


router.post("/login", async (req, resp) => {
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password?.trim()) {
            return resp.status(409).json({
                status: false,
                message: "please fill the required detail",
            })
        }
        const findUser = await userModel.findOne({ email });
        if (!findUser) {
            return resp.status(409).json({
                status: false,
                message: "user not registered",
            });
        }
        const isValidPassword = await bcrypt.compare(password, findUser.password);
        if (!isValidPassword) {
            return resp.status(409).json({
                status: false,
                message: "invalid email or password",
            });
        }
        const token = generateToken(findUser);
        // resp.cookie("token", token);
        // resp.cookie("token", token, {
        //     httpOnly: true,
        //     secure: false, // localhost HTTP
        //     sameSite: "lax",
        //     maxAge: 24 * 60 * 60 * 1000
        // });
        return resp.status(200).json({
            status: true,
            message: "login successfully",
            result: {
                name: findUser.name,
                email: findUser.email,
                role: findUser.role,
                id: findUser._id,
                token: token
            }
        })

    } catch (err) {
        return resp.status(500).json({
            status: false,
            message: "something went wrong",
            err: err.message
        });
    }
});

module.exports = router;