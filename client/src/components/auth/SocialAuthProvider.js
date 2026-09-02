import React, { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const loadFacebookSdk = (appId) => {
    if (!appId || window.FB) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        window.fbAsyncInit = () => {
            window.FB.init({
                appId,
                cookie: true,
                xfbml: false,
                version: "v19.0",
            });
            resolve();
        };

        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);
    });
};

const SocialAuthProvider = ({ children }) => {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

    useEffect(() => {
        loadFacebookSdk(facebookAppId);
    }, [facebookAppId]);

    if (googleClientId) {
        return (
            <GoogleOAuthProvider clientId={googleClientId}>
                {children}
            </GoogleOAuthProvider>
        );
    }

    return children;
};

export default SocialAuthProvider;
