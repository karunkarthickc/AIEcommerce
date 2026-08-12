const jwt = require("jsonwebtoken");
const User = require("../models/user");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.optionalAuth = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
        } catch {
            req.user = null;
        }
    }

    next();
});
