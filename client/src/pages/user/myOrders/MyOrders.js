import React, { Fragment, useEffect } from "react";
import Loader from "../../../components/loader/Loader";
import ProfileLink from "../../../components/profileLinks/ProfileLink";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import styles from "./MyOrders.module.scss";
import { clearErrors, myOrders } from "../../../actions/orderActions";
import { Link } from "react-router-dom";
import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";
import MetaData from "../../../components/MetaData";

const statusClass = (status, styles) => {
    switch (status) {
        case "Delivered":
            return styles.status_delivered;
        case "Shipped":
            return styles.status_shipped;
        case "On The Way":
        case "Processing":
            return styles.status_pending;
        default:
            return styles.status_pending;
    }
};

const MyOrders = () => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector((state) => state.myOrders);

    useEffect(() => {
        dispatch(myOrders());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error]);

    return (
        <Fragment>
            <MetaData title={"My Order"} />
            <Navbar />
            <div className={styles.orders}>
                <div className="container">
                    <div className={styles.eyebrow}>Account</div>
                    <h1 className={styles.heading}>My Orders</h1>
                    <p className={styles.subheading}>
                        Everything you've ordered, in one place.
                    </p>

                    <div className="row g-3">
                        <div className="col-md-3">
                            <ProfileLink />
                        </div>
                        <div className="col-md-9">
                            {loading ? (
                                <Loader />
                            ) : (
                                orders && (
                                    <div className={styles.panel}>
                                        {orders.length === 0 ? (
                                            <div className={styles.empty}>
                                                No orders yet.
                                            </div>
                                        ) : (
                                            <Fragment>
                                                <div className={styles.list_head}>
                                                    <h2>Order History</h2>
                                                    <span className={styles.count}>
                                                        {orders.length}{" "}
                                                        {orders.length === 1
                                                            ? "order"
                                                            : "orders"}
                                                    </span>
                                                </div>

                                                <div className={styles.table_head}>
                                                    <span>Order ID</span>
                                                    <span>Quantity</span>
                                                    <span>Amount</span>
                                                    <span>Status</span>
                                                    <span></span>
                                                </div>

                                                {orders.map((order) => (
                                                    <div
                                                        className={styles.order_row}
                                                        key={order?._id}
                                                    >
                                                        <span className={styles.order_id}>
                                                            {order?._id}
                                                        </span>
                                                        <span className={styles.qty}>
                                                            {order?.orderItems.length}
                                                        </span>
                                                        <span className={styles.amount}>
                                                            ${order?.totalPrice}
                                                        </span>
                                                        <span>
                                                            <span
                                                                className={`${styles.status} ${statusClass(
                                                                    order?.orderStatus,
                                                                    styles
                                                                )}`}
                                                            >
                                                                {order?.orderStatus}
                                                            </span>
                                                        </span>
                                                        <Link
                                                            to={`/order/${order?._id}`}
                                                            className={styles.view_button}
                                                        >
                                                            View
                                                        </Link>
                                                    </div>
                                                ))}
                                            </Fragment>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default MyOrders;