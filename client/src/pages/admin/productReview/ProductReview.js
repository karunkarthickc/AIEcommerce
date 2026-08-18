import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { Table } from "react-bootstrap";
import { AiOutlineDelete, AiFillStar, AiOutlineStar, AiOutlineMessage } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
    clearErrors,
    deleteReview,
    getProductReviews,
} from "../../../actions/productAction";
import Navbar from "../../../components/admin/navbar/Navbar";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import MetaData from "../../../components/MetaData";
import { DELETE_REVIEW_RESET } from "../../../constants/productsConstants";
import styles from "./ProductReview.module.scss";

const Stars = ({ rating }) => (
    <span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) =>
            n <= Math.round(rating) ? (
                <AiFillStar key={n} size={14} />
            ) : (
                <AiOutlineStar key={n} size={14} />
            )
        )}
    </span>
);

const ProductReview = () => {
    const [productId, setProductId] = useState("");
    const [searched, setSearched] = useState(false);

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, reviews } = useSelector((state) => state.productReviews);
    const { isDeleted, error: deleteError } = useSelector(
        (state) => state.review
    );

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (productId !== "") {
            dispatch(getProductReviews(productId));
        }

        if (isDeleted) {
            alert.success("Review deleted successfully");
            dispatch({ type: DELETE_REVIEW_RESET });
        }
    }, [dispatch, alert, error, productId, isDeleted, deleteError]);

    const deleteReviewHandler = (id) => {
        dispatch(deleteReview(id, productId));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setSearched(true);
        dispatch(getProductReviews(productId));
    };

    return (
        <div className={styles.review}>
            <MetaData title={"Product Review"} />
            <div className="row g-0">
                <div className="col-md-2">
                    <Sidebar />
                </div>
                <div className="col-md-10">
                    <Navbar />
                    <div className={styles.content}>
                        <header className={styles.pageHeader}>
                            <p className={styles.eyebrow}>Moderation</p>
                            <h1>Product reviews</h1>
                            <p className={styles.subhead}>
                                Look up a product by ID to manage its customer reviews.
                            </p>
                        </header>

                        <form onSubmit={submitHandler} className={styles.searchBar}>
                            <input
                                type="text"
                                id="productId_field"
                                placeholder="Enter product ID"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                            />
                            <button id="search_button" type="submit">
                                Search
                            </button>
                        </form>

                        {searched && (
                            <div className={styles.tableCard}>
                                {reviews && reviews.length > 0 ? (
                                    <Table responsive className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Review ID</th>
                                                <th>Rating</th>
                                                <th>Comment</th>
                                                <th>Name</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reviews.map((review) => (
                                                <tr key={review?._id}>
                                                    <td>
                                                        <span className={styles.idText}>{review?._id}</span>
                                                    </td>
                                                    <td>
                                                        <Stars rating={review.rating} />
                                                    </td>
                                                    <td className={styles.commentCell}>{review.comment}</td>
                                                    <td>{review.name}</td>
                                                    <td>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.delete}`}
                                                            onClick={() => deleteReviewHandler(review._id)}
                                                            aria-label="Delete review"
                                                        >
                                                            <AiOutlineDelete size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className={styles.emptyState}>
                                        <AiOutlineMessage size={32} />
                                        <p>No reviews found</p>
                                        <span>Check the product ID and try again.</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReview;