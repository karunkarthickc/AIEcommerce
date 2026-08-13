import React, { Fragment } from "react";
import ProfileLink from "../../components/profileLinks/ProfileLink";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import { BsEmojiSmile, BsPhone } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import styles from "./Profile.module.scss";
import Loader from "../../components/loader/Loader";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";

const Profile = () => {
    const { user, loading } = useSelector((state) => state.auth);

    return (
        <Fragment>
            <MetaData title={"Profile"} />
            <Navbar />
            <div className={styles.profile}>
                <div className="container">
                    <div className={styles.eyebrow}>Account</div>
                    <h1 className={styles.heading}>My Profile</h1>
                    <p className={styles.subheading}>
                        Your details on file.
                    </p>

                    <div className="row g-3">
                        <div className="col-md-3">
                            <ProfileLink />
                        </div>
                        <div className="col-md-9">
                            {loading ? (
                                <Loader />
                            ) : (
                                <div className={styles.panel}>
                                    <div className={styles.list_head}>
                                        <h2>Profile Details</h2>
                                        <Link to="/me/update" className={styles.edit_link}>
                                            <AiOutlineEdit size={15} />
                                            Edit
                                        </Link>
                                    </div>

                                    <div className={styles.body}>
                                        <div className={styles.avatar_col}>
                                            {/* <div className={styles.image}>
                                                {user && (
                                                    <img
                                                        src={user.avatar.url}
                                                        alt={user?.name}
                                                    />
                                                )}
                                            </div> */}
                                        </div>

                                        <div className={styles.info_col}>
                                            <div className={styles.field_row}>
                                                <span className={styles.field_icon}>
                                                    <BsEmojiSmile size={16} />
                                                </span>
                                                <span className={styles.field_label}>Name</span>
                                                <span className={styles.field_value}>
                                                    {user?.name}
                                                </span>
                                            </div>
                                            <div className={styles.field_row}>
                                                <span className={styles.field_icon}>
                                                    <AiOutlineMail size={16} />
                                                </span>
                                                <span className={styles.field_label}>Email</span>
                                                <span className={styles.field_value}>
                                                    {user?.email}
                                                </span>
                                            </div>
                                            <div className={styles.field_row}>
                                                <span className={styles.field_icon}>
                                                    <BsPhone size={16} />
                                                </span>
                                                <span className={styles.field_label}>Phone</span>
                                                <span className={styles.field_value}>
                                                    {user?.phone}
                                                </span>
                                            </div>
                                            <div className={styles.field_row}>
                                                <span className={styles.field_icon}>
                                                    <GrLocation size={16} />
                                                </span>
                                                <span className={styles.field_label}>Address</span>
                                                <span className={styles.field_value}>
                                                    {user?.address}
                                                </span>
                                            </div>
                                            <div className={styles.field_row}>
                                                <span className={styles.field_icon}>
                                                    <BsEmojiSmile size={16} />
                                                </span>
                                                <span className={styles.field_label}>Role</span>
                                                <span className={styles.field_value}>
                                                    {user?.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default Profile;