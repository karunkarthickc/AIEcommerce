import React, { useEffect } from "react";
import Navbar from "../../../components/admin/navbar/Navbar";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { AiOutlineShoppingCart, AiOutlineUser, AiOutlineInbox, AiOutlineWarning } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Dashboard.module.scss";
import Loader from "../../../components/loader/Loader";
import { getAdminProducts } from "../../../actions/productAction";
import { allUsers } from "../../../actions/userActions";
import { allOrders } from "../../../actions/orderActions";
import MetaData from "../../../components/MetaData";

const Dashboard = () => {
    const dispatch = useDispatch();

    const { orders } = useSelector((state) => state.allOrders);
    const { users } = useSelector((state) => state.allUsers);
    const { loading, products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getAdminProducts());
    }, [dispatch]);
    useEffect(() => {
        dispatch(allOrders());
    }, [dispatch]);
    useEffect(() => {
        dispatch(allUsers());
    }, [dispatch]);

    const stockout = products?.filter((item) => item.stock === 0) ?? [];
    const hasStockAlert = stockout.length > 0;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    const statCards = [
        {
            key: "users",
            label: "Users",
            value: users?.length ?? 0,
            icon: <AiOutlineUser />,
            to: "/admin/users",
            linkText: "View all users",
            accent: "users",
        },
        {
            key: "orders",
            label: "Orders",
            value: orders?.length ?? 0,
            icon: <AiOutlineShoppingCart />,
            to: "/admin/orders",
            linkText: "View all orders",
            accent: "orders",
        },
        {
            key: "products",
            label: "Products",
            value: products?.length ?? 0,
            icon: <AiOutlineInbox />,
            to: "/admin/products",
            linkText: "View all products",
            accent: "products",
        },
        {
            key: "stockout",
            label: "Stock out",
            value: stockout.length,
            icon: <AiOutlineWarning />,
            to: "/admin/products",
            linkText: "Review low stock",
            accent: "stockout",
        },
    ];

    return (
        <div className={styles.dashboard}>
            <MetaData title={"Dashboard"} />
            <div className="row g-0">
                <div className="col-md-2">
                    <Sidebar />
                </div>
                <div className="col-md-10">
                    <Navbar />
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className={styles.content}>
                            <header className={styles.pageHeader}>
                                <div>
                                    <p className={styles.eyebrow}>Dashboard</p>
                                    <h1>{greeting}, Admin.</h1>
                                    <p className={styles.subhead}>
                                        Here's the state of your store — {today}.
                                    </p>
                                </div>
                                {hasStockAlert && (
                                    <div className={styles.alertPill}>
                                        <span className={styles.pulseDot} />
                                        {stockout.length} product{stockout.length > 1 ? "s" : ""} out of stock
                                    </div>
                                )}
                            </header>

                            <div className={styles.statGrid}>
                                {statCards.map((card) => (
                                    <Link
                                        to={card.to}
                                        key={card.key}
                                        className={`${styles.statCard} ${styles[card.accent]}`}
                                    >
                                        <div className={styles.statTop}>
                                            <span className={styles.iconChip}>{card.icon}</span>
                                            <span className={styles.statLabel}>{card.label}</span>
                                        </div>
                                        <div className={styles.statValue}>
                                            {String(card.value).padStart(2, "0")}
                                        </div>
                                        <div className={styles.statFooter}>
                                            <span>{card.linkText}</span>
                                            <span className={styles.arrow} aria-hidden="true">→</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;