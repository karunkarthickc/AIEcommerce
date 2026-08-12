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
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error]);

    const order = { orderItems: cartItems, shippingInfo };

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice;
        order.shippingPrice = orderInfo.shippingPrice;
        order.taxPrice = orderInfo.taxPrice;
        order.totalPrice = orderInfo.totalPrice;
    }

    const paymentData = { amount: Math.round(orderInfo.totalPrice * 100) };

    const submitHandler = async (e) => {
        e.preventDefault();
        document.querySelector("#pay_btn").disabled = true;

        let res;
        try {
            const config = { headers: { "Content-Type": "application/json" } };

            res = await axiosInstance.post("/api/v1/payment/process", paymentData, config);
            const clientSecret = res.data.client_secret;

            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: { name: user.name, email: user.email },
                },
            });

            if (result.error) {
                alert.error(result.error.message);
                document.querySelector("#pay_btn").disabled = false;
            } else if (result.paymentIntent.status === "succeeded") {
                order.paymentInfo = {
                    id: result.paymentIntent.id,
                    status: result.paymentIntent.status,
                };
                dispatch(createOrder(order));
                history.push("/success");
            } else {
                alert.error("There is some issue while payment processing");
            }
        } catch (error) {
            document.querySelector("#pay_btn").disabled = false;
            alert.error(error.response.data.message);
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