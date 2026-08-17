import React from "react";
import styles from "./Announcement.module.scss";

const Announcement = () => {
    return (
        <div className={styles.announcement}>
            <div className={styles.track}>
                <span>Free Shipping on Orders Over ₹500 — Limited Time</span>
                <span aria-hidden="true">
                    New Arrivals Just Dropped — Shop the Latest
                </span>
                <span aria-hidden="true">
                    Easy Returns Within 30 Days — Shop with Confidence
                </span>
                <span aria-hidden="true">
                    Free Shipping on Orders Over $50 — Limited Time
                </span>
                <span aria-hidden="true">
                    New Arrivals Just Dropped — Shop the Latest
                </span>
                <span aria-hidden="true">
                    Easy Returns Within 30 Days — Shop with Confidence
                </span>
            </div>
        </div>
    );
};

export default Announcement;