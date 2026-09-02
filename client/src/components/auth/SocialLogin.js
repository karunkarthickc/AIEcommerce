import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { FaFacebookF } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { socialLogin } from "../../actions/userActions";
import ButtonLoader from "../loader/ButtonLoader";
import styles from "./SocialLogin.module.scss";

const SocialLogin = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

    const handleGoogleSuccess = (credentialResponse) => {
        if (credentialResponse.credential) {
            dispatch(socialLogin("google", credentialResponse.credential));
        }
    };

    const handleFacebookLogin = () => {
        if (!window.FB) {
            return;
        }

        window.FB.login(
            (response) => {
                if (response.authResponse?.accessToken) {
                    dispatch(
                        socialLogin("facebook", response.authResponse.accessToken)
                    );
                }
            },
            { scope: "email,public_profile" }
        );
    };

    if (!googleClientId && !facebookAppId) {
        return null;
    }

    return (
        <div className={styles.social_login}>
            <div className={styles.divider}>
                <span>or continue with</span>
            </div>

            <div className={styles.social_buttons}>
                {googleClientId && (
                    <div className={styles.google_btn_wrapper}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {}}
                            useOneTap={false}
                            theme="outline"
                            size="large"
                            width="368"
                            text="continue_with"
                            shape="rectangular"
                        />
                    </div>
                )}

                {facebookAppId && (
                    <button
                        type="button"
                        className={styles.facebook_btn}
                        onClick={handleFacebookLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ButtonLoader />
                        ) : (
                            <>
                                <FaFacebookF size={18} />
                                <span>Continue with Facebook</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SocialLogin;
