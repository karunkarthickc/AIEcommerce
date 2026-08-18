import React, { useEffect, useState } from "react";
import {
    AiOutlineLogout,
    AiOutlineShoppingCart,
    AiOutlineUser,
} from "react-icons/ai";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { Link, Route } from "react-router-dom";
import { useAlert } from "react-alert";

import "./Navbar.scss";
import { logout } from "../../actions/userActions";
import Announcement from "../announcement/Announcement";
import Search from "./Search";
import Links from "../Links/Links";

const Navbar = () => {
    const [toggle, setToggle] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const { user, loading } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const alert = useAlert();
    const dispatch = useDispatch();

    // Sticky header
    useEffect(() => {
        const isSticky = () => {
            const header = document.querySelector(".links");
            if (!header) return;

            window.scrollY >= 150
                ? header.classList.add("is-sticky")
                : header.classList.remove("is-sticky");
        };

        window.addEventListener("scroll", isSticky);
        return () => window.removeEventListener("scroll", isSticky);
    }, []);

    const logoutHandler = () => {
        dispatch(logout());
        alert.success("Logged out successfully.");
        setDropdown(false);
    };

    return (
        <div className="nav_container">
            <Announcement />

            <nav className="navbar">
                <div className="container">
                    {/* Brand Name */}
                    <div className="brand">
                        <Link to="/">ShopX</Link>
                    </div>

                    {/* Search */}
                    {/* <div className="search">
                        <Route
                            render={({ history }) => (
                                <Search history={history} />
                            )}
                        />
                    </div> */}

                    {/* Right Side Links */}
                    <div className="nav_links">
                        <ul>
                            {/* Cart */}
                            <li className="cart">
                                <Link to="/cart">
                                    <AiOutlineShoppingCart size={24} />
                                    <span>{cartItems?.length || 0}</span>
                                </Link>
                            </li>

                            {/* Auth Section */}
                            {loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : user ? (
                                <li className="user-section">
                                    <button
                                        className="user-btn"
                                        onClick={() => setDropdown(!dropdown)}
                                    >
                                        {/* <img
                                            src={user?.avatar?.url}
                                            alt={user?.name}
                                        /> */}
                                        <span>{user?.name}</span>
                                    </button>

                                    {dropdown && (
                                        <div className="dropdown">
                                            <Link
                                                to="/me"
                                                onClick={() => setDropdown(false)}
                                            >
                                                <AiOutlineUser size={18} />
                                                Profile
                                            </Link>

                                            {user?.role === "admin" && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setDropdown(false)}
                                                >
                                                    <MdOutlineDashboard size={18} />
                                                    Dashboard
                                                </Link>
                                            )}

                                            <button
                                                className="logout-btn"
                                                onClick={logoutHandler}
                                            >
                                                <AiOutlineLogout size={18} />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ) : (
                                <li>
                                    <Link to="/login" className="login-btn">
                                        Login
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="app__navbar-menu">
                        <HiMenuAlt3 size={28} onClick={() => setToggle(true)} />

                        {toggle && (
    <motion.div
        className="mobile-menu"
        whileInView={{ x: [300, 0] }}
        transition={{ duration: 0.4, ease: "easeOut" }}
    >
        <HiX size={28} onClick={() => setToggle(false)} />
        <ul>
            <li>
                <Link to="/" onClick={() => setToggle(false)}>
                    Home
                </Link>
            </li>
            <li>
                <Link to="/products" onClick={() => setToggle(false)}>
                    Products
                </Link>
            </li>
            <li>
                <Link to="/contact" onClick={() => setToggle(false)}>
                    Contact
                </Link>
            </li>
            <li>
                <Link to="/about" onClick={() => setToggle(false)}>
                    About
                </Link>
            </li>
        </ul>

        {/* Account section */}
        <ul className="mobile-account">
            {user ? (
                <>
                    <li>
                        <Link to="/me" onClick={() => setToggle(false)}>
                            <AiOutlineUser size={18} />
                            Profile
                        </Link>
                    </li>

                    {user?.role === "admin" && (
                        <li>
                            <Link to="/admin" onClick={() => setToggle(false)}>
                                <MdOutlineDashboard size={18} />
                                Dashboard
                            </Link>
                        </li>
                    )}

                    <li>
                        <button
                            className="logout-btn"
                            onClick={() => {
                                logoutHandler();
                                setToggle(false);
                            }}
                        >
                            <AiOutlineLogout size={18} />
                            Logout
                        </button>
                    </li>
                </>
            ) : (
                <li>
                    <Link to="/login" onClick={() => setToggle(false)}>
                        <AiOutlineUser size={18} />
                        Login
                    </Link>
                </li>
            )}
        </ul>
    </motion.div>
)}
                    </div>
                </div>
            </nav>

            {/* Bottom Links */}
            <div className="links">
                <Links />
            </div>
        </div>
    );
};

export default Navbar;