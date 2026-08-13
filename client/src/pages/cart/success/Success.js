import React, { Fragment } from "react";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import MetaData from "../../../components/MetaData";
import styles from "./Success.module.scss";

/**
 * Payment success screen, styled as a torn paper receipt with an
 * ink-stamp confirmation mark. Pass real order data in via props once
 * this is wired up after checkout — sensible sample data is used
 * as a fallback so the component still renders on its own.
 */
const Success = ({
    orderId = "8231-AJ90",
    amount = 2450,
    currency = "₹",
    paymentMethod = "UPI",
    date = new Date(),
    onViewOrder,
    onContinueShopping,
}) => {
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));

    const formattedAmount = Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <Fragment>
            <MetaData title={"Payment successful"} />
            <Navbar />
            <div className={styles.page}>
                <div className={styles.receipt}>
                    <div className={styles.stampWrap}>
                        <svg
                            className={styles.stamp}
                            viewBox="0 0 120 120"
                            aria-hidden="true"
                        >
                            <path
                                id="stampArcTop"
                                d="M12 70 A48 48 0 0 1 108 70"
                                fill="none"
                            />
                            <circle className={styles.stampRing} cx="60" cy="60" r="52" />
                            <path
                                className={styles.stampTick}
                                d="M35 62l16 16 34-34"
                                fill="none"
                                strokeWidth="7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <text className={styles.stampLabel}>
                                <textPath
                                    href="#stampArcTop"
                                    startOffset="50%"
                                    textAnchor="middle"
                                >
                                    APPROVED
                                </textPath>
                            </text>
                        </svg>
                    </div>

                    <h1 className={styles.heading}>Payment received</h1>
                    <p className={styles.sub}>
                        A confirmation has been sent to your email.
                    </p>

                    <p className={styles.amount}>
                        <span className={styles.currency}>{currency}</span>
                        {formattedAmount}
                    </p>

                    <div className={styles.divider} role="presentation" />

                    <dl className={styles.meta}>
                        <div className={styles.metaRow}>
                            <dt>Order</dt>
                            <dd>#{orderId}</dd>
                        </div>
                        <div className={styles.metaRow}>
                            <dt>Paid via</dt>
                            <dd>{paymentMethod}</dd>
                        </div>
                        <div className={styles.metaRow}>
                            <dt>Date</dt>
                            <dd>{formattedDate}</dd>
                        </div>
                    </dl>

                    <div className={styles.divider} role="presentation" />

                    <div className={styles.actions}>
                        <button className={styles.primary} onClick={onViewOrder}>
                            View order
                        </button>
                        <button
                            className={styles.secondary}
                            onClick={onContinueShopping}
                        >
                            Continue shopping
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default Success;