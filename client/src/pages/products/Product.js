import React from "react";
import { useAlert } from "react-alert";
import { AiFillStar } from "react-icons/ai";
import { MdOutlineFavoriteBorder, MdOutlineShoppingBag } from "react-icons/md";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addItemToCart } from "../../actions/cartActions";

import styles from "./Products.module.scss";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const addToCart = () => {
    dispatch(addItemToCart(product._id, 1));
    alert.success("Item Added to Cart");
  };

  return (
    <div className="col-md-4">
      <div className={styles.product}>
        <div className={styles.imageWrapper}>
          <Link to={`/product/${product?._id}`}>
            <img
              src={product?.images?.[0]?.url}
              alt={product?.name}
              className={styles.productImage}
            />
          </Link>

          {/* Quick actions – appear on hover */}
          <div className={styles.actions}>
            <button
              onClick={addToCart}
              className={styles.actionBtn}
              aria-label="Add to cart"
              title="Add to cart"
            >
              <MdOutlineShoppingBag size={20} />
            </button>
            <Link
              to={`/product/${product?._id}`}
              className={styles.actionBtn}
              aria-label="View product"
              title="View product"
            >
              <AiOutlineEye size={20} />
            </Link>
            <button
              className={styles.actionBtn}
              aria-label="Add to wishlist"
              title="Add to wishlist"
            >
              <MdOutlineFavoriteBorder size={20} />
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <Link to={`/product/${product?._id}`} className={styles.nameLink}>
            <h3 className={styles.name}>{product?.name}</h3>
          </Link>

          <div className={styles.meta}>
            <div className={styles.rating}>
              <AiFillStar size={16} />
              <span>{product?.ratings?.toFixed(1) ?? "0.0"}</span>
              <span className={styles.reviews}>
                ({product?.numOfReviews ?? 0})
              </span>
            </div>
            <div className={styles.price}>${product?.price}</div>
          </div>

          <button onClick={addToCart} className={styles.addBtn}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;