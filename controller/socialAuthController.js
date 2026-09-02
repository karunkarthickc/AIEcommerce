const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const findOrCreateSocialUser = async ({
    provider,
    providerId,
    name,
    email,
    avatarUrl,
}) => {
    let user = await User.findOne({ authProvider: provider, providerId });

    if (user) {
        return user;
    }

    user = await User.findOne({ email });

    if (user) {
        if (user.authProvider === "local") {
            user.authProvider = provider;
            user.providerId = providerId;
            if (!user.avatar.url && avatarUrl) {
                user.avatar = { public_id: "", url: avatarUrl };
            }
            await user.save({ validateBeforeSave: false });
            return user;
        }

        if (user.authProvider !== provider) {
            throw new ErrorHandler(
                `An account with this email already exists. Please sign in with ${user.authProvider}.`,
                400
            );
        }

        return user;
    }

    return User.create({
        name,
        email,
        authProvider: provider,
        providerId,
        avatar: { public_id: "", url: avatarUrl || "" },
    });
};

// Google auth => /api/v1/auth/google
exports.googleAuth = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return next(new ErrorHandler("Google token is required", 400));
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
        return next(new ErrorHandler("Google login is not configured", 503));
    }

    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const user = await findOrCreateSocialUser({
        provider: "google",
        providerId: payload.sub,
        name: payload.name,
        email: payload.email,
        avatarUrl: payload.picture,
    });

    sendToken(user, 200, res);
});

// Facebook auth => /api/v1/auth/facebook
exports.facebookAuth = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return next(new ErrorHandler("Facebook token is required", 400));
    }

    if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
        return next(new ErrorHandler("Facebook login is not configured", 503));
    }

    const appTokenUrl = new URL("https://graph.facebook.com/debug_token");
    appTokenUrl.searchParams.set("input_token", token);
    appTokenUrl.searchParams.set(
        "access_token",
        `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
    );

    const debugResponse = await fetch(appTokenUrl);
    const debugData = await debugResponse.json();

    if (!debugData.data?.is_valid) {
        return next(new ErrorHandler("Invalid Facebook token", 401));
    }

    const profileUrl = new URL("https://graph.facebook.com/me");
    profileUrl.searchParams.set(
        "fields",
        "id,name,email,picture.type(large)"
    );
    profileUrl.searchParams.set("access_token", token);

    const profileResponse = await fetch(profileUrl);
    const profile = await profileResponse.json();

    if (!profile.email) {
        return next(
            new ErrorHandler(
                "Facebook account must have an email address to sign in",
                400
            )
        );
    }

    const user = await findOrCreateSocialUser({
        provider: "facebook",
        providerId: profile.id,
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.picture?.data?.url,
    });

    sendToken(user, 200, res);
});
