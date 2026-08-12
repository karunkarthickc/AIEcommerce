import React, { Fragment } from "react";
import {
    FcAutomotive,
    FcCurrencyExchange,
    FcCustomerSupport,
    FcRating,
} from "react-icons/fc";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/header/Navbar";
import MetaData from "../../components/MetaData";
import styles from "./About.module.scss";

const About = () => {
    const abouts = [
        {
            icon: <FcAutomotive size={60} />,
            title: "Free Delivery",
            description:
                "Enjoy free, fast shipping on every order with no hidden fees or minimum purchase required.",
        },
        {
            icon: <FcCurrencyExchange size={60} />,
            title: "100% Cash Back",
            description:
                "Not satisfied with your purchase? Get a full refund, no questions asked, within 30 days.",
        },
        {
            icon: <FcRating size={60} />,
            title: "Quality Product",
            description:
                "Every item is carefully sourced and quality-checked so you always get the best value for your money.",
        },
        {
            icon: <FcCustomerSupport size={60} />,
            title: "24/7 Support",
            description:
                "Our friendly support team is available around the clock to help with any questions or issues.",
        },
    ];
    return (
        <Fragment>
            <MetaData title={"About"} />
            <Navbar />
            <div className={styles.about}>
                <div className={styles.about_title}>
                    <div className="container">
                        <h3>About Us</h3>
                    </div>
                </div>
                <div className={styles.about_info}>
                    <div className="container mb-5">
                        <div className="row g-3 p-3">
                            <div className="col-md-6">
                                <div className={styles.image}>
                                    <img
                                        src="https://res.cloudinary.com/mehedi08h/image/upload/v1648616684/shopx/blog_post_3_wchde0.jpg"
                                        alt="About"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className={styles.info}>
                                    <h4>
                                        The Story Behind Our Online Store
                                    </h4>
                                    <p>
                                        What started as a small idea has grown
                                        into a trusted online destination for
                                        quality products at honest prices.
                                        We're driven by a simple mission: make
                                        shopping easy, reliable, and enjoyable
                                        for every customer, every time.
                                    </p>
                                    <button>Contact Us</button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.features}>
                            <h3 className="text-center">Our Features</h3>

                            <div className="row g-3">
                                <div className="col-md-10 col-md-offset-2 mx-auto">
                                    <div className="row mt-4">
                                        {abouts.map((about, index) => (
                                            <div
                                                className="col-md-3"
                                                key={index}
                                            >
                                                <div className={styles.feature}>
                                                    <span> {about.icon}</span>
                                                    <h5>{about.title}</h5>
                                                    <p>{about.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default About;