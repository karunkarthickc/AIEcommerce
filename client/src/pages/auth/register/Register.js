import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearErrors, register } from "../../../actions/userActions";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import MetaData from "../../../components/MetaData";
import styles from "./Register.module.scss";

const Register = ({ history }) => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(
        "https://res.cloudinary.com/mehedi08h/image/upload/v1647280872/react-final/auth/logo_wyrs86.png"
    );

    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isAuthenticated) {
            history.push("/");
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, isAuthenticated, error, history]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("password", password);
        formData.set("avatar", avatar);
        dispatch(register(formData));
    };

    const onChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    return (
        <Fragment>
            <MetaData title={"Register"} />
            <Navbar />
            <div className={styles.login}>
                <div className={styles.login_container}>
                    <div className={styles.header}>
                        <h2>Create account</h2>
                        <p>Join us and get started</p>
                    </div>

                    <form
                        onSubmit={submitHandler}
                        encType="multipart/form-data"
                        className={styles.form}
                    >
                        <div className={styles.form_group}>
                            <label htmlFor="name_field">Name</label>
                            <input
                                id="name_field"
                                type="text"
                                placeholder="Your full name"
                                name="name"
                                value={name}
                                onChange={onChange}
                                required
                                autoComplete="name"
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="email_field">Email</label>
                            <input
                                id="email_field"
                                type="email"
                                placeholder="you@example.com"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="password_field">Password</label>
                            <input
                                id="password_field"
                                type="password"
                                placeholder="••••••••"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label>Avatar</label>
                            <div className={styles.avatar_row}>
                                <div className={styles.avatar_preview}>
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                    />
                                </div>
                                <label
                                    htmlFor="customFile"
                                    className={styles.upload_btn}
                                >
                                    <AiOutlineCloudUpload size={18} />
                                    <span>Choose image</span>
                                    <input
                                        type="file"
                                        name="avatar"
                                        id="customFile"
                                        accept="image/*"
                                        onChange={onChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={styles.submit_btn}
                            disabled={loading}
                        >
                            {loading ? <ButtonLoader /> : "Create account"}
                        </button>
                    </form>

                    <p className={styles.signup}>
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default Register;