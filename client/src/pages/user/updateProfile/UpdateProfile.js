import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
    clearErrors,
    loadUser,
    updateProfile,
} from "../../../actions/userActions";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import MetaData from "../../../components/MetaData";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import { UPDATE_PROFILE_RESET } from "../../../constants/userConstants";
import styles from "./UpdateProfile.module.scss";

const UpdateProfile = ({ history }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(
        "https://res.cloudinary.com/mehedi08h/image/upload/v1647280872/react-final/auth/logo_wyrs86.png"
    );

    const alert = useAlert();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { error, isUpdated, loading } = useSelector((state) => state.user);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setAddress(user.address);
            setPhone(user.phone);
            setAvatarPreview(user.avatar.url);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("User updated successfully");
            dispatch(loadUser());
            history.push("/me");
            dispatch({ type: UPDATE_PROFILE_RESET });
        }
    }, [dispatch, user, alert, error, history, isUpdated]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("address", address);
        formData.set("phone", phone);
        formData.set("avatar", avatar);
        dispatch(updateProfile(formData));
    };

    const onChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };

        reader.readAsDataURL(e.target.files[0]);
    };

    return (
        <Fragment>
            <MetaData title={"Update Profile"} />
            <Navbar />
            <div className={styles.update_profile}>
                <div className="container">
                    <div className={styles.eyebrow}>Account</div>
                    <h1 className={styles.heading}>Update Profile</h1>
                    <p className={styles.subheading}>
                        Keep your details current.
                    </p>

                    <div className="row g-3">
                        <div className="col-md-3">
                            <ProfileLink />
                        </div>
                        <div className="col-md-9">
                            <div className={styles.panel}>
                                <div className={styles.form_head}>
                                    <h2>Your Details</h2>
                                </div>

                                <form
                                    className={styles.form}
                                    onSubmit={submitHandler}
                                    encType="multipart/form-data"
                                >
                                    <div className={styles.from_group}>
                                        <label htmlFor="name_field">Name</label>
                                        <input
                                            id="name_field"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            type="text"
                                        />
                                    </div>
                                    <div className={styles.from_group}>
                                        <label htmlFor="address_field">Address</label>
                                        <input
                                            id="address_field"
                                            name="address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            type="text"
                                        />
                                    </div>
                                    <div className={styles.from_group}>
                                        <label htmlFor="phone_field">Phone</label>
                                        <input
                                            id="phone_field"
                                            name="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            type="number"
                                        />
                                    </div>

                                    {/* <div className={styles.from_group}>
                                        <label htmlFor="customFile">Avatar</label>
                                        <div className={styles.avatar_row}>
                                            <div className={styles.avatar_preview}>
                                                <img src={avatarPreview} alt="Avatar Preview" />
                                            </div>
                                            <label
                                                htmlFor="customFile"
                                                className={styles.upload_btn}
                                            >
                                                <AiOutlineCloudUpload size={17} />
                                                Choose file
                                                <input
                                                    type="file"
                                                    name="avatar"
                                                    id="customFile"
                                                    accept="image/*"
                                                    onChange={onChange}
                                                />
                                            </label>
                                        </div>
                                    </div> */}

                                    <button type="submit" className={styles.submit_btn}>
                                        {loading ? <ButtonLoader /> : "Update"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default UpdateProfile;