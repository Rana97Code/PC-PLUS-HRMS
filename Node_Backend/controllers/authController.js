const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const upload = multer();

const router = express.Router();

const createToken = (user_email) => {
    return jwt.sign(
        { user_email },
        process.env.JWT_SECRET,
        { expiresIn: "200m" }
    );
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

        const existingUser = await User.findOne({
            where: { user_email }
        });

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
            confirm_password: hashedPassword
        });

        const access_token = createToken(newUser.user_email);

        return res.json({
            access_token,
            token_type: "bearer",
            user_email: newUser.user_email
        });

    } catch (error) {
        return res.status(400).json({
            detail: error.message
        });
    }
});

router.post("/pcplus/api/auth", upload.none(), async (req, res) => {
    try {
        const body = req.body || {};
        const query = req.query || {};

        // console.log("AUTH BODY:", body);
        // console.log("AUTH QUERY:", query);

        const user_email =
            body.username ||
            body.user_email ||
            body.email ||
            query.username ||
            query.user_email ||
            query.email;

        const user_password =
            body.password ||
            body.user_password ||
            query.password ||
            query.user_password;

        if (!user_email || !user_password) {
            return res.status(400).json({
                detail: "Email and password are required"
            });
        }

        const user = await User.findOne({
            where: { user_email }
        });

        if (!user) {
            return res.status(401).json({
                detail: "Incorrect username or password"
            });
        }

        const validPassword = await bcrypt.compare(
            user_password,
            user.user_password
        );

        if (!validPassword) {
            return res.status(401).json({
                detail: "Incorrect username or password"
            });
        }

        const access_token = createToken(user.user_email);

        return res.json({
            access_token,
            token_type: "bearer",
            user_email: user.user_email
        });

    } catch (error) {
        return res.status(400).json({
            detail: error.message
        });
    }
});

router.post("/pcplus/api/signin", async (req, res) => {
    try {
        const {
            user_email,
            user_password
        } = req.body;

        const user = await User.findOne({
            where: { user_email }
        });

        if (!user) {
            return res.status(401).json({
                detail: "Incorrect username or password"
            });
        }

        const validPassword = await bcrypt.compare(
            user_password,
            user.user_password
        );

        if (!validPassword) {
            return res.status(401).json({
                detail: "Incorrect username or password"
            });
        }

        const access_token = createToken(user.user_email);

        return res.json({
            access_token,
            user_email: user.user_email,
            token_type: "bearer"
        });

    } catch (error) {
        return res.status(400).json({
            detail: error.message
        });
    }
});

module.exports = router;