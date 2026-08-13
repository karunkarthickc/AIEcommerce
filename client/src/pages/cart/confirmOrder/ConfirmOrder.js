import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import MetaData from "../../../components/MetaData";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";

import styles from "./ConfirmOrder.module.scss";

const ConfirmOrder = ({ history }) => {
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 200 ? 0 : 25;
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice,
        };
        sessionStorage.setItem("orderInfo", JSON.stringify(data));
        history.push("/payment");
    };

    return (
        <Fragment>
            <MetaData title={"Confirm Order"} />
            <Navbar />
            <div className={styles.confirm}>
                <div className="container">
                    <div className={styles.eyebrow}>Checkout</div>
                    <h1 className={styles.heading}>Confirm Order</h1>
                    <p className={styles.subheading}>Review everything before you pay.</p>

                    <CheckoutSteps shipping confirmOrder />

                    <div className={styles.grid}>
                        <div className={styles.panel}>
                            <div className={styles.list_head}>
                                <h2>Shipping Info</h2>
                            </div>
                            <div className={styles.shipping_info}>
                                <p><span>Name</span>{user && user.name}</p>
                                <p><span>Phone</span>{shippingInfo.phoneNo}</p>
                                <p>
                                    <span>Address</span>
                                    {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
                                </p>
                            </div>

                            <div className={styles.list_head}>
                                <h2>Items</h2>
                                <span className={styles.count}>
                                    {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                                </span>
                            </div>

                            <div>
                                {cartItems.map((item, index) => (
                                    <div className={styles.item_row} key={item.product}>
                                        <span className={styles.idx}>
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <div className={styles.thumb}>
                                            <img src={item.image} alt={item.name} />
                                        </div>

                                        <div className={styles.meta}>
                                            <Link to={`/products/${item.product}`}>{item.name}</Link>
                                            <span className={styles.unit}>
                                                {item.quantity} &times; ${item.price.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className={styles.price_cell}>
                                            ${(item.quantity * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.receipt_wrap}>
                            <div className={styles.receipt}>
                                <div className={styles.receipt_head}>
                                    <div className={styles.r_eyebrow}>Order Summary</div>
                                    <h2>Receipt</h2>
                                </div>

                                <div className={styles.r_row}>
                                    <span>Subtotal</span>
                                    <span>${itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className={styles.r_row}>
                                    <span>Shipping</span>
                                    <span>${shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className={styles.r_row}>
                                    <span>Tax</span>
                                    <span>${taxPrice.toFixed(2)}</span>
                                </div>
                                <div className={`${styles.r_row} ${styles.total}`}>
                                    <span>Total</span>
                                    <span>${totalPrice}</span>
                                </div>

                                <button
                                    id="checkout_btn"
                                    className={styles.checkout_btn}
                                    onClick={processToPayment}
                                   
                                >
                                    Proceed to Payment
                                </button>

                                <div className={styles.barcode} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default ConfirmOrder;