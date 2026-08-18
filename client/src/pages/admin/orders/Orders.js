import React, { useEffect } from "react";
import {
    allOrders,
    clearErrors,
    deleteOrder,
} from "../../../actions/orderActions";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Orders.module.scss";
import Loader from "../../../components/loader/Loader";
import { Table } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { DELETE_ORDER_RESET } from "../../../constants/orderConstants";
import Navbar from "../../../components/admin/navbar/Navbar";
import MetaData from "../../../components/MetaData";

const statusStyleKey = (status) => {
    const normalized = status?.toLowerCase();
    if (normalized === "delivered") return "badgeDelivered";
    if (normalized === "shipped") return "badgeShipped";
    if (normalized === "processing") return "badgeProcessing";
    return "badgeDefault";
};

const Orders = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector((state) => state.allOrders);
    const { isDeleted } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(allOrders());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("Order deleted successfully");
            history.push("/admin/orders");
            dispatch({ type: DELETE_ORDER_RESET });
        }
    }, [dispatch, alert, error, isDeleted, history]);

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    };

    const formatAmount = (amount) =>
        typeof amount === "number"
            ? amount.toLocaleString("en-US", { style: "currency", currency: "INR" })
            : amount;

    return (
        <div className={styles.orders}>
            <MetaData title={"Order"} />
            <div className="row g-0">
                <div className="col-md-2">
                    <Sidebar />
                </div>
                <div className="col-md-10">
                    <Navbar />
                    <div className={styles.content}>
                        <header className={styles.pageHeader}>
                            <div>
                                <p className={styles.eyebrow}>Fulfillment</p>
                                <h1>All orders</h1>
                                <p className={styles.subhead}>
                                    {orders?.length ?? 0} order{orders?.length === 1 ? "" : "s"} placed
                                </p>
                            </div>
                        </header>

                        <div className={styles.tableCard}>
                            {loading ? (
                                <Loader />
                            ) : orders?.length ? (
                                <Table responsive className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Items</th>
                                            <th>Amount</th>
                                            <th>City</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order?._id}>
                                                <td>
                                                    <span className={styles.idText}>{order?._id}</span>
                                                </td>
                                                <td>{order?.orderItems?.length}</td>
                                                <td className={styles.amountCell}>
                                                    {formatAmount(order?.totalPrice)}
                                                </td>
                                                <td>{order?.shippingInfo?.city}</td>
                                                <td>
                                                    <span
                                                        className={`${styles.badge} ${styles[statusStyleKey(order?.orderStatus)]}`}
                                                    >
                                                        {order?.orderStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className={styles.actions}>
                                                        <Link
                                                            to={`/admin/order/${order._id}`}
                                                            className={`${styles.actionBtn} ${styles.view}`}
                                                            aria-label="View order"
                                                        >
                                                            <AiOutlineEye size={16} />
                                                        </Link>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.delete}`}
                                                            onClick={() => deleteOrderHandler(order._id)}
                                                            aria-label="Delete order"
                                                        >
                                                            <AiOutlineDelete size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <div className={styles.emptyState}>
                                    <AiOutlineShoppingCart size={32} />
                                    <p>No orders yet</p>
                                    <span>Orders placed by customers will show up here.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;