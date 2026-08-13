import React, { Fragment } from "react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { BsInstagram, BsYoutube } from "react-icons/bs";
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from "react-icons/md";
import styles from "./Contact.module.scss";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";
import loginImage from "../../assets/contact.png";

const Contact = () => {
  const contacts = [
    {
      icon: <MdPhone size={26} color="#0d6efd" />,
      bg: "rgba(13, 110, 253, 0.1)",
      text1: "Phone",
      text2: "+880 1348-4434",
    },
    {
      icon: <MdEmail size={26} color="#198754" />,
      bg: "rgba(25, 135, 84, 0.1)",
      text1: "Email",
      text2: "support@ShopX.com",
    },
    {
      icon: <MdLocationOn size={26} color="#dc3545" />,
      bg: "rgba(220, 53, 69, 0.1)",
      text1: "Address",
      text2: "123 Gulshan Avenue, Dhaka 1212",
    },
    {
      icon: <MdAccessTime size={26} color="#fd7e14" />,
      bg: "rgba(253, 126, 20, 0.1)",
      text1: "Working Hours",
      text2: "Mon - Sat: 9:00 AM - 8:00 PM",
    },
  ];

  const socialLinks = [
    {
      icon: <FaFacebook size={20} />,
      url: "https://facebook.com/ShopX",
      label: "Facebook",
    },
    {
      icon: <BsInstagram size={20} />,
      url: "https://instagram.com/ShopX",
      label: "Instagram",
    },
    {
      icon: <BsYoutube size={20} />,
      url: "https://youtube.com/@ShopX",
      label: "YouTube",
    },
    {
      icon: <FaTwitter size={20} />,
      url: "https://twitter.com/ShopX",
      label: "Twitter",
    },
    {
      icon: <FaLinkedin size={20} />,
      url: "https://linkedin.com/company/ShopX",
      label: "LinkedIn",
    },
  ];

  const companyInfo = {
    title: "Information About Us",
    description:
      "ShopX is a leading online marketplace dedicated to bringing you quality products at affordable prices. Founded in 2018, we have served over 50,000 happy customers across Bangladesh. Our mission is to make shopping simple, fast, and enjoyable.",
    highlights: [
      "50,000+ Happy Customers",
      "Fast Nationwide Delivery",
      "24/7 Customer Support",
      "100% Authentic Products",
    ],
  };

  return (
    <Fragment>
      <MetaData title={"Contact"} />
      <Navbar />
      <div className={styles.contact}>
         {/* Contact Form Section */}
        <div className={styles.contact_form}>
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <h3>Get In Touch</h3>
                <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>

                <form className={styles.form}>
                  <div className={styles.form_group}>
                    <label htmlFor="name_field">Name</label>
                    <input
                      type="text"
                      id="name_field"
                      placeholder="Enter your name..."
                    />
                  </div>
                  <div className={styles.form_group}>
                    <label htmlFor="email_field">Email</label>
                    <input
                      type="email"
                      id="email_field"
                      placeholder="Enter your email..."
                    />
                  </div>
                  <div className={styles.form_group}>
                    <label htmlFor="subject_field">Subject</label>
                    <input
                      type="text"
                      id="subject_field"
                      placeholder="Enter subject..."
                    />
                  </div>
                  <div className={styles.form_group}>
                    <label htmlFor="message_field">Message</label>
                    <textarea
                      id="message_field"
                      placeholder="Enter your message..."
                      rows="5"
                    ></textarea>
                  </div>
                  <div className={styles.form_group}>
                    <button type="submit">Send Message</button>
                  </div>
                </form>
              </div>

              <div className="col-lg-6">
                <div className={styles.contact_img}>
                  <img
                    src={loginImage}
                    alt="Contact us illustration"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page Title */}
        <div className={styles.contact_title}>
          <div className="container">
            <h3>Contact Us</h3>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className={styles.contact_info}>
          <div className="container">
            <div className="row g-4 g-lg-5">
              {/* About Us */}
              <div className="col-lg-6">
                <div className={styles.about}>
                  <h4>{companyInfo.title}</h4>
                  <p>{companyInfo.description}</p>

                  <ul className="list-unstyled mt-3">
                    {companyInfo.highlights.map((item, index) => (
                      <li key={index}>✓ {item}</li>
                    ))}
                  </ul>

                  <div className={styles.social}>
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Ways */}
              <div className="col-lg-6">
                <div className={styles.contact_ways}>
                  <h4>Contact Way</h4>
                  <div className="row g-3">
                    {contacts.map((contact, index) => (
                      <div className="col-sm-6" key={index}>
                        <div className={styles.way_card}>
                          <div
                            className={styles.icon_wrap}
                            style={{ background: contact.bg }}
                          >
                            {contact.icon}
                          </div>
                          <div className={styles.info}>
                            <p>{contact.text1}</p>
                            <p>{contact.text2}</p>
                          </div>
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

export default Contact;