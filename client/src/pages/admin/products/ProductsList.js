import React, { useEffect } from "react";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { Table } from "react-bootstrap";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ProductsList.module.scss";
import {
    clearErrors,
    deleteProduct,
    getAdminProducts,
} from "../../../actions/productAction";
import Loader from "../../../components/loader/Loader";
import { Link } from "react-router-dom";

import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlineInbox } from "react-icons/ai";
import { DELETE_PRODUCT_RESET } from "../../../constants/productsConstants";
import Navbar from "../../../components/admin/navbar/Navbar";
import MetaData from "../../../components/MetaData";

const ProductsList = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector((state) => state.products);
    const { error: deleteError, isDeleted } = useSelector(
        (state) => state.product
    );

    useEffect(() => {
        dispatch(getAdminProducts());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("Product deleted successfully");
            history.push("/admin/products");
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
    }, [dispatch, alert, error, deleteError, isDeleted, history]);

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    };

    const formatPrice = (price) =>
        typeof price === "number"
            ? price.toLocaleString("en-US", { style: "currency", currency: "INR" })
            : price;

    return (
        <div className={styles.products}>
            <MetaData title={"All Products"} />
            <div className="row g-0">
                <div className="col-md-2">
                    <Sidebar />
                </div>
                <div className="col-md-10">
                    <Navbar />
                    <div className={styles.content}>
                        <header className={styles.pageHeader}>
                            <div>
                                <p className={styles.eyebrow}>Catalog</p>
                                <h1>All products</h1>
                                <p className={styles.subhead}>
                                    {products?.length ?? 0} product{products?.length === 1 ? "" : "s"} in your store
                                </p>
                            </div>
                            <Link to="/admin/products/new" className={styles.addBtn}>
                                + Add product
                            </Link>
                        </header>

                        <div className={styles.tableCard}>
                            {loading ? (
                                <Loader />
                            ) : products?.length ? (
                                <Table responsive className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>ID</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product?._id}>
                                                <td>
                                                    <div className={styles.productCell}>
                                                        <img
                                                            className={styles.thumb}
                                                            src={product?.images[0]?.url}
                                                            alt={product?.name}
                                                        />
                                                        <span className={styles.productName}>
                                                            {product?.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={styles.idText}>{product?._id}</span>
                                                </td>
                                                <td className={styles.priceCell}>
                                                    {formatPrice(product?.price)}
                                                </td>
                                                <td>
                                                    {product?.stock === 0 ? (
                                                        <span className={`${styles.badge} ${styles.badgeOut}`}>
                                                            Out of stock
                                                        </span>
                                                    ) : product?.stock <= 5 ? (
                                                        <span className={`${styles.badge} ${styles.badgeLow}`}>
                                                            {product.stock} left
                                                        </span>
                                                    ) : (
                                                        <span className={`${styles.badge} ${styles.badgeOk}`}>
                                                            {product.stock} in stock
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className={styles.actions}>
                                                        <Link
                                                            to={`/admin/product/details/${product._id}`}
                                                            className={`${styles.actionBtn} ${styles.view}`}
                                                            aria-label="View product"
                                                        >
                                                            <AiOutlineEye size={16} />
                                                        </Link>
                                                        <Link
                                                            to={`/admin/product/${product._id}`}
                                                            className={`${styles.actionBtn} ${styles.edit}`}
                                                            aria-label="Edit product"
                                                        >
                                                            <AiOutlineEdit size={16} />
                                                        </Link>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.delete}`}
                                                            onClick={() => deleteProductHandler(product._id)}
                                                            aria-label="Delete product"
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
                                    <AiOutlineInbox size={32} />
                                    <p>No products yet</p>
                                    <span>Products you add will show up here.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsList;