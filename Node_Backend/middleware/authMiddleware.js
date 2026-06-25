const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getCurrentActiveUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                detail: "Could not validate credentials"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            where: {
                user_email: decoded.user_email
            }
        });

        if (!user) {
            return res.status(401).json({
                detail: "Could not validate credentials"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            detail: "Could not validate credentials"
        });
    }
};

module.exports = {
    getCurrentActiveUser
};