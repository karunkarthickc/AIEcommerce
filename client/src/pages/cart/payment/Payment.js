import React, { Fragment, useEffect, useState } from "react";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";
import styles from "./Payment.module.scss";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";

import { clearErrors, createOrder } from "../../../actions/orderActions";
import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";
import MetaData from "../../../components/MetaData";
import { axiosInstance } from "../../../config";

const options = {
    style: {
        base: {
            fontSize: "16px",
            fontFamily: '"Inter", sans-serif',
            color: "#14171a",
            "::placeholder": { color: "#5c6259" },
        },
        invalid: {
            color: "#b23a2e",
        },
    },
};

// Safely read + validate orderInfo so a missing/corrupt sessionStorage value
// never throws during render.
const readOrderInfo = () => {
    try {
        const raw = sessionStorage.getItem("orderInfo");
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.totalPrice === "undefined") return null;

        return parsed;
    } catch (err) {
        console.error("[Payment] Failed to parse orderInfo from sessionStorage:", err);
        return null;
    }
};

const Payment = ({ history }) => {
    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const [submitting, setSubmitting] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { error } = useSelector((state) => state.newOrder);

    const orderInfo = readOrderInfo();

    useEffect(() => {
        if (error) {
            console.error("[Payment] newOrder error from redux store:", error);
            alert.error(error);
            dispatch(clearErrors());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, alert, error]);

    // Fallback: no valid order info to charge. Redirect instead of crashing.
    useEffect(() => {
        if (!orderInfo) {
            alert.error("We couldn't find your order details. Please confirm your order again.");
            history.push("/order/confirm");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderInfo]);

    // Fallback: not logged in (e.g. cross-origin cookie wasn't sent, session
    // expired, or user hit /payment directly). Redirect instead of crashing
    // deeper in submitHandler when user.name/user.email is accessed.
    useEffect(() => {
        if (!user) {
            alert.error("Please log in to continue with payment.");
            history.push("/login");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Nothing safe to render yet — bail out quietly instead of crashing.
    // The effects above will redirect on the next tick.
    if (!orderInfo || !user) {
        return null;
    }

    const order = {
        orderItems: cartItems,
        shippingInfo,
        itemsPrice: orderInfo.itemsPrice,
        shippingPrice: orderInfo.shippingPrice,
        taxPrice: orderInfo.taxPrice,
        totalPrice: orderInfo.totalPrice,
    };

    const paymentData = { amount: Math.round(Number(orderInfo.totalPrice) * 100) };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (submitting) return;
        setSubmitting(true);

        const payBtn = document.querySelector("#pay_btn");
        if (payBtn) payBtn.disabled = true;

        try {
            if (!stripe || !elements) {
                alert.error("Payment form isn't ready yet. Please wait a moment and try again.");
                return;
            }

            const config = { headers: { "Content-Type": "application/json" } };

            const res = await axiosInstance.post("/api/v1/payment/process", paymentData, config);
            const clientSecret = res?.data?.client_secret;

            if (!clientSecret) {
                alert.error("Couldn't start payment. Please try again.");
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user?.name || "",
                        email: user?.email || "",
                    },
                },
            });

            if (result.error) {
                alert.error(result.error.message);
            } else if (result.paymentIntent?.status === "succeeded") {
                order.paymentInfo = {
                    id: result.paymentIntent.id,
                    status: result.paymentIntent.status,
                };
                dispatch(createOrder(order));
                history.push("/success");
            } else {
                alert.error("There is some issue while payment processing");
            }
        } catch (err) {
            console.error("[Payment] submitHandler caught error:", err);

            const status = err?.response?.status;

            if (status === 401) {
                // Session expired / cookie not sent — send them to log back in
                // instead of leaving a broken form on screen.
                alert.error("Your session has expired. Please log in again to complete payment.");
                history.push("/login");
                return;
            }

            const message =
                err?.response?.data?.message || err?.message || "Payment failed. Please try again.";
            alert.error(message);
        } finally {
            setSubmitting(false);
            const btn = document.querySelector("#pay_btn");
            if (btn) btn.disabled = false;
        }
    };

    return (
        <Fragment>
            <MetaData title={"Payment"} />
            <Navbar />
            <div className={styles.payment}>
                <div className="container">
                    <div className={styles.eyebrow}>Checkout</div>
                    <h1 className={styles.heading}>Payment</h1>
                    <p className={styles.subheading}>Enter your card details to complete the order.</p>

                    <CheckoutSteps shipping confirmOrder payment />

                    <div className={styles.payment_container}>
                        <form onSubmit={submitHandler} className={styles.panel}>
                            <div className={styles.form_head}>
                                <h2>Card Info</h2>
                            </div>

                            <div className={styles.from_group}>
                                <label htmlFor="card_num_field">Card Number</label>
                                <div className={styles.stripe_field}>
                                    <CardNumberElement id="card_num_field" options={options} />
                                </div>
                            </div>

                            <div className={styles.from_group}>
                                <label htmlFor="card_exp_field">Card Expiry</label>
                                <div className={styles.stripe_field}>
                                    <CardExpiryElement id="card_exp_field" options={options} />
                                </div>
                            </div>

                            <div className={styles.from_group}>
                                <label htmlFor="card_cvc_field">Card CVC</label>
                                <div className={styles.stripe_field}>
                                    <CardCvcElement id="card_cvc_field" options={options} />
                                </div>
                            </div>

                            <button
                                id="pay_btn"
                                type="submit"
                                className={styles.submit_btn}
                                disabled={submitting}
                            >
                                {submitting ? "Processing..." : `Pay - $${orderInfo.totalPrice}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default Payment;