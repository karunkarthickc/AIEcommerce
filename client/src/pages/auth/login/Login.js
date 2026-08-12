import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearErrors, login } from "../../../actions/userActions";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import MetaData from "../../../components/MetaData";
import styles from "./Login.module.scss";

const Login = ({ history, location }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(
        (state) => state.auth
    );

    const redirect = location.search ? location.search.split("=")[1] : "/";

    useEffect(() => {
        if (isAuthenticated) {
            history.push(redirect);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, isAuthenticated, error, history, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <Fragment>
            <MetaData title={"Login"} />
            <Navbar />
            <div className={styles.login}>
                <div className={styles.login_container}>
                    <div className={styles.header}>
                        <h2>Welcome back</h2>
                        <p>Sign in to continue</p>
                    </div>

                    <form onSubmit={submitHandler} className={styles.form}>
                        <div className={styles.form_group}>
                            <label htmlFor="email_field">Email</label>
                            <input
                                id="email_field"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className={styles.form_group}>
                            <div className={styles.label_row}>
                                <label htmlFor="password_field">Password</label>
                                <Link to="/password/forgot" className={styles.forgot}>
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password_field"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submit_btn}
                            disabled={loading}
                        >
                            {loading ? <ButtonLoader /> : "Sign in"}
                        </button>
                    </form>

                    <p className={styles.signup}>
                        Don’t have an account?{" "}
                        <Link to="/register">Create one</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default Login;