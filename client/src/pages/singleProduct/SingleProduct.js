import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import { useParams } from "react-router-dom";
import {
    clearErrors,
    getProductDetails,
    newReview,
} from "../../actions/productAction";
import Loader from "../../components/loader/Loader";
import {
    AiOutlineCloseCircle,
    AiOutlineMinus,
    AiOutlinePlus,
} from "react-icons/ai";
import styles from "./SingleProduct.module.scss";
import { addItemToCart } from "../../actions/cartActions";
import { NEW_REVIEW_RESET } from "../../constants/productsConstants";
import ListReview from "../reviews/ListReview";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import MetaData from "../../components/MetaData";

const SingleProduct = ({ match }) => {
    const [quantity, setQuantity] = useState(1);
    const [preview, setPreview] = useState(0);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const [show, setShow] = useState(false);

    const scrollRef = React.useRef(null);

    const dispatch = useDispatch();
    const alert = useAlert();

    let { id } = useParams();

    // image thumbline
    const scroll = (direction) => {
        const { current } = scrollRef;

        if (direction === "left") {
            current.scrollLeft -= 300;
        } else {
            current.scrollLeft += 300;
        }
    };

    const { loading, error, product } = useSelector(
        (state) => state.productDetails
    );
    const { user } = useSelector((state) => state.auth);
    const { error: reviewError, success } = useSelector(
        (state) => state.newReview
    );

    const increaseQty = () => {
        const count = document.querySelector(".count");

        if (count.valueAsNumber >= product.stock) return;

        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    };

    const decreaseQty = () => {
        const count = document.querySelector(".count");

        if (count.valueAsNumber <= 1) return;

        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    };

    useEffect(() => {
        dispatch(getProductDetails(id));

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Reivew posted successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }
    }, [dispatch, alert, id, error, reviewError, success]);

    const addToCart = () => {
        dispatch(addItemToCart(id, quantity));
        alert.success("Item Added to Cart");
    };

    const handleShow = () => {
        setShow(show ? false : true);
    };
    const reviewHandler = () => {
        const formData = new FormData();

        formData.set("rating", rating);
        formData.set("comment", comment);
        formData.set("productId", match.params.id);

        dispatch(newReview(formData));
        setShow(false);
    };

    return (
        <Fragment>
            <MetaData title={"Product Details"} />
            <Navbar />
            <div className={styles.product_details}>
                {loading ? (
                    <Loader />
                ) : (
                    <div className={styles.container}>
                        <div className={styles.layout}>
                            {/* ---------- gallery ---------- */}
                            <div className={styles.gallery}>
                                {product.images && (
                                    <>
                                        <div className={styles.preview_image}>
                                            <img
                                                src={
                                                    product?.images[preview]
                                                        .url
                                                }
                                                alt={product?.name}
                                            />
                                            <span className={styles.frame_tag}>
                                                {preview + 1} /{" "}
                                                {product.images.length}
                                            </span>
                                        </div>

                                        <div className={styles.filmstrip_row}>
                                            <button
                                                type="button"
                                                className={styles.arrow_btn}
                                                onClick={() => scroll("left")}
                                                aria-label="Scroll thumbnails left"
                                            >
                                                <BsArrowLeftShort />
                                            </button>

                                            <div
                                                className={styles.filmstrip}
                                                ref={scrollRef}
                                            >
                                                {product?.images.map(
                                                    (image, index) => (
                                                        <button
                                                            type="button"
                                                            key={image._id}
                                                            className={`${
                                                                styles.frame
                                                            } ${
                                                                index ===
                                                                preview
                                                                    ? styles.frame_active
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                setPreview(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={image.url}
                                                                alt=""
                                                            />
                                                        </button>
                                                    )
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                className={styles.arrow_btn}
                                                onClick={() => scroll("right")}
                                                aria-label="Scroll thumbnails right"
                                            >
                                                <BsArrowRightShort />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* ---------- info card ---------- */}
                            <div className={styles.info_card}>
                                <h1 className={styles.title}>
                                    {product?.name}
                                </h1>

                                <div className={styles.rating_row}>
                                    <div className={styles.stars}>
                                        <div
                                            className={styles.stars_fill}
                                            style={{
                                                width: `${
                                                    (product.ratings / 5) *
                                                    100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className={styles.review_count}>
                                        {product.numOfReviews} review
                                        {product.numOfReviews === 1 ? "" : "s"}
                                    </span>
                                </div>

                                <p className={styles.price}>
                                    <span className={styles.currency}>$</span>
                                    {product?.price}
                                </p>

                                <p className={styles.description}>
                                    {product?.description}
                                </p>

                                <div className={styles.divider} />

                                <div className={styles.purchase_row}>
                                    <div className={styles.stock_counter}>
                                        <button
                                            type="button"
                                            className="minus"
                                            onClick={decreaseQty}
                                            aria-label="Decrease quantity"
                                        >
                                            <AiOutlineMinus />
                                        </button>

                                        <input
                                            className="count"
                                            type="number"
                                            value={quantity}
                                            readOnly
                                        />

                                        <button
                                            type="button"
                                            className="plus"
                                            onClick={increaseQty}
                                            aria-label="Increase quantity"
                                        >
                                            <AiOutlinePlus />
                                        </button>
                                    </div>

                                    <p className={styles.stock_status}>
                                        <span
                                            className={`${styles.status_dot} ${
                                                product.stock > 0
                                                    ? styles.in_stock
                                                    : styles.out_stock
                                            }`}
                                        />
                                        {product.stock > 0
                                            ? "In stock"
                                            : "Out of stock"}
                                    </p>
                                </div>

                                <div className={styles.button_row}>
                                    <button
                                        className={styles.btn_primary}
                                        disabled={product.stock === 0}
                                        onClick={addToCart}
                                    >
                                        Add to cart
                                    </button>
                                    <button className={styles.btn_secondary}>
                                        Buy now
                                    </button>
                                </div>

                                {/* ---------- maker's stamp ---------- */}
                                <div className={styles.stamp_row}>
                                    <div className={styles.stamp}>
                                        <span className={styles.stamp_ring}>
                                            {product?.seller
                                                ?.slice(0, 2)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <div className={styles.stamp_text}>
                                        <span className={styles.stamp_label}>
                                            Sold by
                                        </span>
                                        <strong>{product.seller}</strong>
                                    </div>
                                </div>

                                <div className={styles.perforation} />

                                {/* ---------- review action ---------- */}
                                <div className={styles.review_action}>
                                    {user ? (
                                        <button
                                            className={styles.btn_ghost}
                                            onClick={handleShow}
                                        >
                                            Write a review
                                        </button>
                                    ) : (
                                        <p className={styles.login_notice}>
                                            Log in to write a review.
                                        </p>
                                    )}
                                </div>

                                {show && (
                                    <div className={styles.review_form_backdrop}>
                                        <div className={styles.review_form}>
                                            <div
                                                className={
                                                    styles.review_form_head
                                                }
                                            >
                                                <h5>Write your review</h5>
                                                <AiOutlineCloseCircle
                                                    onClick={() =>
                                                        setShow(false)
                                                    }
                                                    className={styles.close_icon}
                                                    size={22}
                                                />
                                            </div>

                                            <Rating
                                                name="simple-controlled"
                                                value={rating}
                                                onChange={(event, newValue) => {
                                                    setRating(newValue);
                                                }}
                                            />

                                            <textarea
                                                name="review"
                                                id="review"
                                                placeholder="What did you think of this item?"
                                                className={styles.review_textarea}
                                                value={comment}
                                                onChange={(e) =>
                                                    setComment(e.target.value)
                                                }
                                            ></textarea>

                                            <button
                                                className={styles.btn_primary}
                                                onClick={reviewHandler}
                                            >
                                                Submit review
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {product.reviews && product.reviews.length > 0 && (
                            <div className={styles.reviews_section}>
                                <ListReview reviews={product.reviews} />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </Fragment>
    );
};

export default SingleProduct;