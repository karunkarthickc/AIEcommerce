import React from "react";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";
import styles from "./Fashion.module.scss";

const TITLES = {
    mens: "Men's Fashion",
    womens: "Women's Fashion",
    kids: "Kids's Fashion",
};

const Fashion = ({ products, type }) => {
    const scrollRef = React.useRef(null);
    const [atStart, setAtStart] = React.useState(true);
    const [atEnd, setAtEnd] = React.useState(false);

    const title = TITLES[type] ?? "Fashion";

    const updateEdges = React.useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setAtStart(el.scrollLeft <= 4);
        setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    }, []);

    React.useEffect(() => {
        updateEdges();
        const el = scrollRef.current;
        el?.addEventListener("scroll", updateEdges, { passive: true });
        window.addEventListener("resize", updateEdges);
        return () => {
            el?.removeEventListener("scroll", updateEdges);
            window.removeEventListener("resize", updateEdges);
        };
    }, [updateEdges, products]);

    const scroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = direction === "left" ? -320 : 320;
        el.scrollBy({ left: amount, behavior: "smooth" });
    };

    return (
        <section className={styles.fashion}>
            <div className="container mt-5 mb-5">
                <div className={styles.header}>
                    <h4>{title}</h4>
                    <Link to="/products" className={styles.seeAll}>
                        See all
                    </Link>
                </div>

                <div className={styles.carousel}>
                    <button
                        type="button"
                        aria-label="Scroll left"
                        className={`${styles.arrow} ${styles.arrowLeft}`}
                        onClick={() => scroll("left")}
                        disabled={atStart}
                    >
                        <BsArrowLeftShort />
                    </button>

                    <div className={styles.track} ref={scrollRef}>
                        {products?.map((product) => (
                            <Link
                                to={`/product/${product?._id}`}
                                className={styles.card}
                                key={product?._id}
                            >
                                <div className={styles.imageWrap}>
                                    <img
                                        src={product?.images[0].url}
                                        alt={product?.name}
                                        loading="lazy"
                                    />
                                </div>
                                <div className={styles.info}>
                                    <p className={styles.name}>{product?.name}</p>
                                    <p className={styles.price}>
                                        ₹{Number(product?.price).toFixed(2)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <button
                        type="button"
                        aria-label="Scroll right"
                        className={`${styles.arrow} ${styles.arrowRight}`}
                        onClick={() => scroll("right")}
                        disabled={atEnd}
                    >
                        <BsArrowRightShort />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Fashion;