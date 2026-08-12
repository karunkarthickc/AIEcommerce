import React, { Fragment, useEffect } from "react";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { FcInTransit, FcPaid, FcProcess, FcShipped } from "react-icons/fc";

import styles from "./OrderDetails.module.scss";
import { clearErrors, getOrderDetails } from "../../../actions/orderActions";
import { Link } from "react-router-dom";
import { BsEmojiSmile, BsPhone } from "react-icons/bs";
import { FaCity } from "react-icons/fa";
import { GrLocation, GrStripe, GrStatusUnknown } from "react-icons/gr";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
import { AiOutlineDownload } from "react-icons/ai";
import Loader from "../../../components/loader/Loader";
import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";
import MetaData from "../../../components/MetaData";

const OrderDetails = ({ match }) => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const {
        loading,
        error,
        order = {},
    } = useSelector((state) => state.orderDetails);

    let status;

    if (order.orderStatus === "Processing") {
        status = 0;
    } else if (order.orderStatus === "On The Way") {
        status = 1;
    } else if (order.orderStatus === "Shipped") {
        status = 2;
    } else {
        status = 3;
    }

    const statusClass = (index) => {
        if (index - status < 1) return styles.done;
        if (index - status === 1) return styles.inProgress;
        return styles.undone;
    };

    const { shippingInfo, orderItems, paymentInfo, user, totalPrice } = order;

    useEffect(() => {
        dispatch(getOrderDetails(match.params.id));

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error, match.params.id]);

    const isPaid = paymentInfo && paymentInfo.status === "succeeded" ? true : false;

    return (
        <Fragment>
            <MetaData title={"Order Details"} />
            <Navbar />
            <div className={styles.order_details}>
                <div className="container">
                    <div className={styles.eyebrow}>Account</div>
                    <h1 className={styles.heading}>Order Details</h1>
                    <p className={styles.subheading}>
                        {order._id ? `Order # ${order._id}` : "Loading your order..."}
                    </p>

                    <div className="row g-3">
                        <div className="col-md-3">
                            <ProfileLink />
                        </div>
                        <div className="col-md-9">
                            <div className={styles.panel}>
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <>
                                        <div className={styles.list_head}>
                                            <h2>Order #{order._id}</h2>
                                            <button className={styles.invoice_btn}>
                                                <AiOutlineDownload size={15} />
                                                Invoice
                                            </button>
                                        </div>

                                        {/* Order status */}
                                        <div className={styles.status_section}>
                                            <div className={styles.section_label}>
                                                Order Status
                                            </div>
                                            <div className={styles.stepper}>
                                                <div className={styles.step}>
                                                    <FcProcess
                                                        className={statusClass(0)}
                                                        size={32}
                                                    />
                                                    <p>Processing</p>
                                                </div>
                                                <div
                                                    className={`${styles.connector} ${
                                                        status > 0 ? styles.filled : ""
                                                    }`}
                                                />
                                                <div className={styles.step}>
                                                    <FcInTransit
                                                        className={statusClass(1)}
                                                        size={32}
                                                    />
                                                    <p>On The Way</p>
                                                </div>
                                                <div
                                                    className={`${styles.connector} ${
                                                        status > 1 ? styles.filled : ""
                                                    }`}
                                                />
                                                <div className={styles.step}>
                                                    <FcShipped
                                                        className={statusClass(2)}
                                                        size={32}
                                                    />
                                                    <p>Shipped</p>
                                                </div>
                                                <div
                                                    className={`${styles.connector} ${
                                                        status > 2 ? styles.filled : ""
                                                    }`}
                                                />
                                                <div className={styles.step}>
                                                    <FcPaid
                                                        className={statusClass(3)}
                                                        size={32}
                                                    />
                                                    <p>Delivery</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shipping + Payment info */}
                                        <div className={styles.info_grid}>
                                            <div className={styles.info_col}>
                                                <div className={styles.section_label}>
                                                    Shipping Info
                                                </div>
                                                <div className={styles.field_row}>
                                                    <span className={styles.field_icon}>
                                                        <BsEmojiSmile size={15} />
                                                    </span>
                                                    <span className={styles.field_label}>Name</span>
                                                    <span className={styles.field_value}>
                                                        {user && user.name}
                                                    </span>
                                                </div>
                                                <div className={styles.field_row}>
                                                    <span className={styles.field_icon}>
                                                        <BsPhone size={15} />
                                                    </span>
                                                    <span className={styles.field_label}>Phone</span>
                                                    <span className={styles.field_value}>
                                                        {shippingInfo && shippingInfo.phoneNo}
                                                    </span>
                                                </div>
                                                <div className={styles.field_row}>
                                                    <span className={styles.field_icon}>
                                                        <GrLocation size={15} />
                                                    </span>
                                                    <span className={styles.field_label}>Address</span>
                                                    <span className={styles.field_value}>
                                                        {shippingInfo && shippingInfo.address}
                                                    </span>
                                                </div>
                                                <div className={styles.field_row}>
                                                    <span className={styles.field_icon}>
                                                        <FaCity size={15} />
                                                    </span>
                                                    <span className={styles.field_label}>City</span>
                                                    <span className={styles.field_value}>
                                                        {shippingInfo && shippingInfo.city}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={styles.info_col}>
                                                <div className={styles.section_label}>
                                                    Payment Info
                                                </div>
                                                <div className={styles.field_row}>
                                                    <span className={styles.field_icon}>
                                                        <RiMoneyDollarCircleLine size={15} />
                                                    </span>
                                                    <span className={styles.field_label}>Payment</span>
                                                    <span
                                                        className={`${styles.field_value} ${
                                                            isPaid ? styles.paid : styles.not_paid
                                                        }`}
                                                    >
                                                        {isPaid ? "PAID" : "NOT PAID"}
                                                    </span>
                                                </div>
                                                <div className={styles.field_row}>
                                                    <span className={styles.field_icon}>
                                                        <GrStripe size={15} />
                                                    </span>
                                                    <span className={styles.field_label}>ID</span>
                                                    <span
                                                        className={`${styles.field_value} ${styles.mono}`}
                                                    >
                                                        {paymentInfo && paymentInfo.id}
                                                    </span>
                                                </div>
                                                <div className={styles.field_row}>
                                                    <span className={styles.field_icon}>
                                                        <GiTakeMyMoney size={15} />
                                                    </span>
                                                    <span className={styles.field_label}>Total</span>
                                                    <span className={styles.field_value}>
                                                        ${totalPrice}
                                                    </span>
                                                </div>
                                                <div className={styles.field_row}>
                                                    <span className={styles.field_icon}>
                                                        <GrStatusUnknown size={15} />
                                                    </span>
                                                    <span className={styles.field_label}>Status</span>
                                                    <span className={styles.field_value}>
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order items */}
                                        <div className={styles.items_section}>
                                            <div className={styles.section_label}>
                                                Order Items
                                            </div>
                                            {orderItems &&
                                                orderItems.map((item, index) => (
                                                    <div
                                                        className={styles.item_row}
                                                        key={item.product}
                                                    >
                                                        <span className={styles.idx}>
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>

                                                        <div className={styles.thumb}>
                                                            <img src={item.image} alt={item.name} />
                                                        </div>

                                                        <div className={styles.meta}>
                                                            <Link to={`/products/${item.product}`}>
                                                                {item.name}
                                                            </Link>
                                                            <span className={styles.unit}>
                                                                {item.quantity} &times; ${item.price}
                                                            </span>
                                                        </div>

                                                        <div className={styles.price_cell}>
                                                            $
                                                            {(
                                                                item.quantity * item.price
                                                            ).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default OrderDetails;