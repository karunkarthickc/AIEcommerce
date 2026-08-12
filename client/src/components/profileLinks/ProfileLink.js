import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";
import styles from "./ProfileLink.module.scss";
import { AiOutlineEdit, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdFavoriteBorder } from "react-icons/md";
import { logout } from "../../actions/userActions";
import { useAlert } from "react-alert";

const ProfileLink = () => {
    const { user, loading } = useSelector((state) => state.auth);

    const alert = useAlert();
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(logout());
        alert.success("Logged out successfully.");
    };

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <div className={styles.profile_links}>
                        <div className={styles.id_card}>
                            {/* {user && <img src={user.avatar.url} alt={user?.name} />} */}
                            <h4>{user?.name}</h4>
                            <p>{user?.email}</p>
                        </div>

                        <div className={styles.divider}>
                            <span>Account</span>
                        </div>

                        <div className={styles.links}>
                            <Link to="/me">
                                <AiOutlineUser size={19} />
                                Profile
                            </Link>
                            <Link to="/me/update">
                                <AiOutlineEdit size={19} />
                                Edit Profile
                            </Link>
                            <Link to="/me/password">
                                <RiLockPasswordLine size={19} />
                                Password
                            </Link>
                            <Link to="/orders/me">
                                <MdFavoriteBorder size={19} />
                                My Orders
                            </Link>
                            <button onClick={logoutHandler}>
                                <AiOutlineLogout size={19} />
                                Logout
                            </button>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProfileLink;