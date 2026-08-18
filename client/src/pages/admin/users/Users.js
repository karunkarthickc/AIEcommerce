import React, { useEffect } from "react";
import { useAlert } from "react-alert";
import { Table } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEye, AiOutlineTeam } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    allUsers,
    clearErrors,
    deleteUser,
} from "../../../actions/userActions";
import Loader from "../../../components/loader/Loader";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { DELETE_USER_RESET } from "../../../constants/userConstants";
import styles from "./Users.module.scss";
import Navbar from "../../../components/admin/navbar/Navbar";
import MetaData from "../../../components/MetaData";

const Users = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, users } = useSelector((state) => state.allUsers);
    const { isDeleted } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(allUsers());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("User deleted successfully");
            history.push("/admin/users");
            dispatch({ type: DELETE_USER_RESET });
        }
    }, [dispatch, alert, error, isDeleted, history]);

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    };

    return (
        <div className={styles.users}>
            <MetaData title={"All Users"} />
            <div className="row g-0">
                <div className="col-md-2">
                    <Sidebar />
                </div>
                <div className="col-md-10">
                    <Navbar />
                    <div className={styles.content}>
                        <header className={styles.pageHeader}>
                            <div>
                                <p className={styles.eyebrow}>Access</p>
                                <h1>All users</h1>
                                <p className={styles.subhead}>
                                    {users?.length ?? 0} account{users?.length === 1 ? "" : "s"} registered
                                </p>
                            </div>
                        </header>

                        <div className={styles.tableCard}>
                            {loading ? (
                                <Loader />
                            ) : users?.length ? (
                                <Table responsive className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>ID</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user?._id}>
                                                <td>
                                                    <div className={styles.userCell}>
                                                        <img
                                                            className={styles.avatar}
                                                            src={user?.avatar?.url}
                                                            alt={user?.name}
                                                        />
                                                        <span className={styles.userName}>{user?.name}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={styles.idText}>{user?._id}</span>
                                                </td>
                                                <td>{user?.email}</td>
                                                <td>
                                                    <span
                                                        className={`${styles.badge} ${
                                                            user?.role === "admin" ? styles.badgeAdmin : styles.badgeUser
                                                        }`}
                                                    >
                                                        {user?.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className={styles.actions}>
                                                        <Link
                                                            to={`/admin/user/details/${user._id}`}
                                                            className={`${styles.actionBtn} ${styles.view}`}
                                                            aria-label="View user"
                                                        >
                                                            <AiOutlineEye size={16} />
                                                        </Link>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.delete}`}
                                                            onClick={() => deleteUserHandler(user._id)}
                                                            aria-label="Delete user"
                                                        >
                                                            <AiOutlineDelete size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <div className={styles.emptyState}>
                                    <AiOutlineTeam size={32} />
                                    <p>No users yet</p>
                                    <span>Registered accounts will show up here.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;