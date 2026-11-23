const jwt = require("jsonwebtoken");
const userModel = require("../Model/userSchema");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: false,
                message: "Please login first"
            });
        }

        const token = authHeader.split(" ")[1];

        const verifyToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel.findById(verifyToken.id)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error.message);

        return res.status(401).json({
            status: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;