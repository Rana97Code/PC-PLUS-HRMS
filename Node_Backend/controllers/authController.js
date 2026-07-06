const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const { User, Role, Permission } = require("../models/auth");


const upload = multer();
const router = express.Router();

const createToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            user_email: user.user_email,
            user_role: user.user_role,
            role_key: user.Role?.role_key || null
        },
        process.env.JWT_SECRET,
        { expiresIn: "200m" }
    );
};

const formatUserResponse = (user) => {
    const permissions = user.Role?.Permissions?.map((p) => p.permission_key) || [];

    return {
        id: user.id,
        user_name: user.user_name,
        user_phone: user.user_phone,
        user_email: user.user_email,
        user_img: user.user_img,
        user_role: user.user_role,
        role_name: user.Role?.role_name || null,
        role_key: user.Role?.role_key || null,
        permissions
    };
};

router.post("/pcplus/api/create_user", async (req, res) => {
    try {
        const {
            user_name,
            user_phone,
            user_email,
            user_password,
            office_token
        } = req.body;

        if (office_token !== process.env.OFFICE_VERIFY_TOKEN) {
            return res.status(403).json({
                detail: "Invalid office verification token"
            });
        }

        const existingUser = await User.findOne({ where: { user_email } });

        if (existingUser) {
            return res.status(400).json({
                detail: "This user email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(user_password, 10);
        const newUser = await User.create({
            user_name,
            user_phone,
            user_email,
            user_password: hashedPassword,
            confirm_password: hashedPassword,
            user_role: 2
        });

        return res.json({
            message: "User created successfully",
            user_email: newUser.user_email
        });

    } catch (error) {
        return res.status(400).json({ detail: error.message });
    }
});

router.post("/pcplus/api/auth", upload.none(), async (req, res) => {
    try {
        const body = req.body || {};

        const user_email =
            body.username ||
            body.user_email ||
            body.email;

        const user_password =
            body.password ||
            body.user_password;

        if (!user_email || !user_password) {
            return res.status(400).json({
                detail: "Email and password are required"
            });
        }

        const user = await User.findOne({
            where: { user_email },
            include: [
                {
                    model: Role,
                    include: [Permission]
                }
            ]
        });

        if (!user) {
            return res.status(401).json({
                detail: "Incorrect username or password"
            });
        }

        const validPassword = await bcrypt.compare(user_password, user.user_password);

        if (!validPassword) {
            return res.status(401).json({
                detail: "Incorrect username or password"
            });
        }

        const access_token = createToken(user);
        // console.log(formatUserResponse(user));

        return res.json({
            access_token,
            token_type: "bearer",
            user: formatUserResponse(user)
        });
    } catch (error) {
        return res.status(400).json({ detail: error.message });
    }
});

router.post("/pcplus/api/signin", async (req, res) => {
    try {
        const { user_email, user_password } = req.body;

        const user = await User.findOne({
            where: { user_email },
            include: [
                {
                    model: Role,
                    include: [Permission]
                }
            ]
        });

        if (!user) {
            return res.status(401).json({
                detail: "Incorrect username or password"
            });
        }

        const validPassword = await bcrypt.compare(user_password, user.user_password);

        if (!validPassword) {
            return res.status(401).json({
                detail: "Incorrect username or password"
            });
        }

        const access_token = createToken(user);

        return res.json({
            access_token,
            token_type: "bearer",
            user: formatUserResponse(user)
        });

    } catch (error) {
        return res.status(400).json({ detail: error.message });
    }
});

module.exports = router;