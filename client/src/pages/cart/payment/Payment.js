import React, { Fragment, useEffect } from "react";
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

const Payment = ({ history }) => {
    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { error } = useSelector((state) => state.newOrder);

    useEffect(() => {
        if (error) {
            console.error("[Payment] newOrder error from redux store:", error);
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error]);

    const order = { orderItems: cartItems, shippingInfo };

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    console.log("[Payment] user:", user);
    console.log("[Payment] orderInfo from sessionStorage:", orderInfo);

    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice;
        order.shippingPrice = orderInfo.shippingPrice;
        order.taxPrice = orderInfo.taxPrice;
        order.totalPrice = orderInfo.totalPrice;
    } else {
        // This is a likely cause of a blank page: totalPrice access below will throw
        // synchronously during render if orderInfo is null (e.g. sessionStorage was
        // cleared, or the user landed on /payment directly without going through
        // the order confirm step).
        console.error(
            "[Payment] orderInfo is missing from sessionStorage — accessing orderInfo.totalPrice next will throw."
        );
    }

    const paymentData = { amount: Math.round(orderInfo.totalPrice * 100) };
    console.log("[Payment] paymentData to be sent:", paymentData);

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("[Payment] submitHandler fired");
        document.querySelector("#pay_btn").disabled = true;

        let res;
        try {
            const config = { headers: { "Content-Type": "application/json" } };

            console.log("[Payment] POST /api/v1/payment/process ->", paymentData);
            res = await axiosInstance.post("/api/v1/payment/process", paymentData, config);
            console.log("[Payment] payment/process response:", res.status, res.data);

            const clientSecret = res.data.client_secret;
            console.log("[Payment] clientSecret received:", !!clientSecret);

            if (!stripe || !elements) {
                console.error("[Payment] stripe or elements not ready:", {
                    stripe: !!stripe,
                    elements: !!elements,
                });
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: { name: user.name, email: user.email },
                },
            });
            console.log("[Payment] stripe.confirmCardPayment result:", result);

            if (result.error) {
                console.error("[Payment] Stripe confirmCardPayment error:", result.error);
                alert.error(result.error.message);
                document.querySelector("#pay_btn").disabled = false;
            } else if (result.paymentIntent.status === "succeeded") {
                console.log("[Payment] paymentIntent succeeded:", result.paymentIntent);
                order.paymentInfo = {
                    id: result.paymentIntent.id,
                    status: result.paymentIntent.status,
                };
                dispatch(createOrder(order));
                history.push("/success");
            } else {
                console.warn(
                    "[Payment] paymentIntent status not succeeded:",
                    result.paymentIntent.status
                );
                alert.error("There is some issue while payment processing");
            }
        } catch (error) {
            document.querySelector("#pay_btn").disabled = false;

            // Log everything about the failure so the 401 (or whatever it is) is visible
            console.error("[Payment] submitHandler caught error:", error);
            console.error("[Payment] error.message:", error?.message);
            console.error("[Payment] error.response:", error?.response);
            console.error("[Payment] error.response?.status:", error?.response?.status);
            console.error("[Payment] error.response?.data:", error?.response?.data);
            console.error("[Payment] error.config (the request that failed):", error?.config);

            // Guard against error.response being undefined (this was likely the cause
            // of the "Uncaught (in promise)" blank-page crash: the old code assumed
            // error.response always exists).
            const message =
                error?.response?.data?.message || error?.message || "Payment failed. Please try again.";
            alert.error(message);
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

                            <button id="pay_btn" type="submit" className={styles.submit_btn}>
                                Pay{` - $${orderInfo && orderInfo.totalPrice}`}
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