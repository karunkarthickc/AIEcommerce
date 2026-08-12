import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import styles from "./Footer.module.scss";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className={styles.footer}>
            <div className={styles.footer_info}>
                <div className="container">
                    <div className="row g-3">
                        {/* About Us */}
                        <div className="col-md-3">
                            <div className={styles.about_us}>
                                <h5>About Us</h5>
                                <div>
                                    <p>
                                        ShopX is your trusted online destination for quality products 
                                        at fair prices. We focus on seamless shopping, fast delivery, 
                                        and excellent customer support so you can shop with confidence.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Information */}
                        <div className="col-md-3">
                            <div className={styles.information}>
                                <h5>Information</h5>
                                <div>
                                    <li>About Us</li>
                                    <li>Contact Us</li>
                                    <li>FAQs</li>
                                    <li>Privacy Policy</li>
                                    <li>Refund Policy</li>
                                    <li>Cookie Policy</li>
                                </div>
                            </div>
                        </div>

                        {/* Customer Service */}
                        <div className="col-md-3">
                            <div className={styles.information}>
                                <h5>Customer Service</h5>
                                <div>
                                    <li>My Account</li>
                                    <li>Support Center</li>
                                    <li>Terms & Conditions</li>
                                    <li>Returns & Exchanges</li>
                                    <li>Shipping & Delivery</li>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="col-md-3">
                            <div className={styles.newsletter}>
                                <h5>ShopX Newsletter</h5>
                                <div>
                                    <p>
                                        Subscribe to get exclusive deals, new arrivals, and style tips 
                                        delivered straight to your inbox.
                                    </p>
                                    <input type="email" placeholder="Enter your email" />
                                    <button>
                                        <AiOutlineMail />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.copyright}>
                <span>© {currentYear} ShopX. All Rights Reserved.</span>
            </div>
        </div>
    );
};

export default Footer;