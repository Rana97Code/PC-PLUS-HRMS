const express = require("express");
const path = require("path");
const multer = require("multer");
const User = require("../models/User");
const { getCurrentActiveUser } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/images"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });


router.get("/pcplus/api/my_profile", getCurrentActiveUser, async (req, res) => {
    return res.json({
        user_name: req.user.user_name,
        user_email: req.user.user_email,
        user_role: req.user.user_role || 0
    });
});

router.get("/pcplus/api/me", getCurrentActiveUser, async (req, res) => {
    return res.json({
        user_name: req.user.user_name,
        user_email: req.user.user_email,
        user_role: req.user.user_role || 0
    });
});

router.get("/pcplus/api/get_me/:user_email", getCurrentActiveUser, async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                user_email: req.params.user_email
            }
        });

        if (!user) {
            return res.status(404).json({
                detail: "User not found"
            });
        }

        return res.json(user);

    } catch (error) {
        return res.status(422).json({
            detail: "Unit not found"
        });
    }
});

router.put(
    "/pcplus/api/update_user/:user_id",
    getCurrentActiveUser,
    upload.any(),
    async (req, res) => {
        try {
            console.log("UPDATE BODY:", req.body);
            console.log("UPDATE FILES:", req.files);

            const user = await User.findByPk(req.params.user_id);

            if (!user) {
                return res.status(404).json({
                    detail: "User not found"
                });
            }

            user.user_name = req.body.user_name;
            user.user_email = req.body.user_email;
            user.user_phone = req.body.user_phone;

            if (req.body.user_password) {
                user.user_password = req.body.user_password;
                user.confirm_password = req.body.user_password;
            }

            const uploadedFile = req.files && req.files.length > 0
                ? req.files[0]
                : null;

            if (uploadedFile) {
                user.user_img = uploadedFile.filename;
            }

            await user.save();

            return res.json({
                message: "Successfully Updated",
                user_id: user.id,
                user_img: user.user_img,
                image_url: user.user_img
                    ? `http://localhost:3000/uploads/images/${user.user_img}`
                    : null
            });

        } catch (error) {
            return res.status(400).json({
                detail: `Update failed: ${error.message}`
            });
        }
    }
);

const uploadWithGeneratedName = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, "../uploads/images"));
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const fileName = `user_${req.params.user_id}_${Date.now()}${ext}`;
            cb(null, fileName);
        }
    })
});

router.put(
    "/pcplus/api/file_upload/:user_id",
    getCurrentActiveUser,
    uploadWithGeneratedName.single("user_img"),
    async (req, res) => {
        try {
            const user = await User.findByPk(req.params.user_id);

            if (!user) {
                return res.status(404).json({
                    detail: "User not found"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    detail: "Image file is required"
                });
            }

            user.user_img = req.file.filename;

            await user.save();

            return res.json({
                message: "Successfully uploaded",
                filename: req.file.filename,
                image_url: `/uploads/images/${req.file.filename}`
            });

        } catch (error) {
            return res.status(400).json({
                detail: error.message
            });
        }
    }
);

module.exports = router;