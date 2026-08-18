// Banner.jsx
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import styles from "./Banner.module.scss";

const slides = [
  {
    eyebrow: "Spring / Summer 2022",
    headingA: "Get up to 30% off",
    headingB: "New Arrivals",
    swatch: "01 — Linen",
    cta: "Shop the collection",
    to: "/products",
    accent: "moss",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    eyebrow: "Just Landed",
    headingA: "Outerwear built",
    headingB: "for in-between weather",
    swatch: "02 — Waxed Cotton",
    cta: "Shop outerwear",
    to: "/products?category=outerwear",
    accent: "clay",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    eyebrow: "Finishing Touches",
    headingA: "Accessories that",
    headingB: "carry the look",
    swatch: "03 — Full Grain",
    cta: "Shop accessories",
    to: "/products?category=accessories",
    accent: "sun",
    image:
      "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=1200&q=80",
  },
];
const Banner = () => {
    const [active, setActive] = useState(0);
    const total = slides.length;
    const swiperRef = useRef(null);

    return (
        <div className={styles.banner}>
            <span className={styles.seasonStrip} aria-hidden="true">
                New Season — {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>

            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                pagination={false}
                navigation={{
                    prevEl: `.${styles.prev}`,
                    nextEl: `.${styles.next}`,
                }}
                autoplay={{ delay: 6000, pauseOnMouseEnter: true, disableOnInteraction: false }}
                loop
                onSwiper={(s) => (swiperRef.current = s)}
                onSlideChange={(s) => setActive(s.realIndex)}
                className={styles.swiper}
            >
                {slides.map((slide, i) => (
                    <SwiperSlide key={i}>
                        <div className={`${styles.slide} ${styles[slide.accent]}`}>
                            <div className="container">
                                <div className={styles.grid}>
                                    <div className={styles.text}>
                                        <p className={styles.eyebrow}>{slide.eyebrow}</p>
                                        <h1 className={styles.heading}>
                                            {slide.headingA} <em>{slide.headingB}</em>
                                        </h1>
                                        <Link to={slide.to} className={styles.cta}>
                                            {slide.cta}
                                            <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                                                <path d="M0 5H17M17 5L13 1M17 5L13 9" stroke="currentColor" strokeWidth="1.4"/>
                                            </svg>
                                        </Link>
                                    </div>

                                    <div className={styles.imageCol}>
                                        <div className={styles.frame}>
                                            <div className={styles.frameBack} />
                                          <div
    className={styles.frameImage}
    style={{ backgroundImage: `url(${slide.image})` }}
/>
                                            <span className={styles.swatch}>{slide.swatch}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className={`container ${styles.controls}`}>
                <div className={styles.progress}>
                    <span
                        className={styles.progressFill}
                        style={{ width: `${((active + 1) / total) * 100}%` }}
                    />
                </div>
                <div className={styles.count}>
                    <span className={styles.countCurrent}>{String(active + 1).padStart(2, "0")}</span>
                    <span className={styles.countDivider}>/</span>
                    <span className={styles.countTotal}>{String(total).padStart(2, "0")}</span>
                </div>
                <div className={styles.arrows}>
                    <button className={styles.prev} aria-label="Previous slide">←</button>
                    <button className={styles.next} aria-label="Next slide">→</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;