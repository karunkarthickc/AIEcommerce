import React, { Fragment } from "react";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartActions";

import styles from "./Cart.module.scss";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";

const Cart = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { cartItems } = useSelector((state) => state.cart);

    const removeCartItemHandler = (id) => {
        dispatch(removeItemFromCart(id));
        alert.success("Item Remove from Cart Success");
    };

    const increaseQty = (id, quantity, stock) => {
        const newQty = quantity + 1;

        if (newQty > stock) return;

        dispatch(addItemToCart(id, newQty));
    };

    const decreaseQty = (id, quantity) => {
        const newQty = quantity - 1;

        if (newQty <= 0) return;

        dispatch(addItemToCart(id, newQty));
    };

    const checkoutHandler = () => {
        history.push("/login?redirect=shipping");
    };

    const unitCount = cartItems.reduce(
        (acc, item) => acc + Number(item.quantity),
        0
    );
    const estTotal = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );

    return (
        <Fragment>
            <MetaData title={"Cart"} />
            <Navbar />
            <div className={styles.cart}>
                <div className="container">
                    <div className={styles.eyebrow}>Your Cart</div>
                    <h1 className={styles.heading}>Shopping Bag</h1>
                    <p className={styles.subheading}>
                        Review your items before checkout.
                    </p>

                    <div className={styles.grid}>
                        {/* Item list */}
                        <div className={styles.panel}>
                            <div className={styles.list_head}>
                                <h2>Items</h2>
                                <span className={styles.count}>
                                    {cartItems.length}{" "}
                                    {cartItems.length === 1 ? "item" : "items"}
                                </span>
                            </div>

                            <div>
                                {cartItems.map((item, index) => (
                                    <div
                                        className={styles.item_row}
                                        key={item.product}
                                    >
                                        <span className={styles.idx}>
                                            {String(index + 1).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                        <div className={styles.thumb}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                            />
                                        </div>

                                        <div className={styles.meta}>
                                            <Link
                                                to={`/product/${item.product}`}
                                            >
                                                {item.name}
                                            </Link>
                                            <span className={styles.unit}>
                                                ${item.price.toFixed(2)} each
                                            </span>
                                        </div>

                                        <div className={styles.qty_cell}>
                                            <div className={styles.stepper}>
                                                <button
                                                    type="button"
                                                    aria-label={`Decrease quantity of ${item.name}`}
                                                    onClick={() =>
                                                        decreaseQty(
                                                            item.product,
                                                            item.quantity
                                                        )
                                                    }
                                                >
                                                    &minus;
                                                </button>

                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    readOnly
                                                />

                                                <button
                                                    type="button"
                                                    aria-label={`Increase quantity of ${item.name}`}
                                                    onClick={() =>
                                                        increaseQty(
                                                            item.product,
                                                            item.quantity,
                                                            item.stock
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.price_cell}>
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </div>

                                        <div className={styles.remove_cell}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeCartItemHandler(
                                                        item.product
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Receipt summary */}
                        <div className={styles.receipt_wrap}>
                            <div className={styles.receipt}>
                                <div className={styles.receipt_head}>
                                    <div className={styles.r_eyebrow}>
                                        Order Summary
                                    </div>
                                    <h2>Receipt</h2>
                                </div>

                                <div className={styles.r_row}>
                                    <span>Subtotal</span>
                                    <span>
                                        {unitCount}{" "}
                                        {unitCount === 1 ? "unit" : "units"}
                                    </span>
                                </div>
                                <div className={styles.r_row}>
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div
                                    className={`${styles.r_row} ${styles.total}`}
                                >
                                    <span>Est. Total</span>
                                    <span>${estTotal.toFixed(2)}</span>
                                </div>

                                <button
                                    type="button"
                                    className={styles.checkout_btn}
                                    onClick={checkoutHandler}
                                >
                                    Proceed to Checkout
                                </button>

                                <div className={styles.r_note}>
                                    Taxes calculated at next step
                                </div>

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

export default Cart;