import React from "react";
import { Link } from "react-router-dom";
import styles from "./Category.module.scss";

const categories = [
    {
      
          image:
    "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=600&h=800&q=80",
        title: "Men's Fashion",
        
    },
    {
        image:
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&h=800&q=80",
        title: "Women's Fashion",
       
    },
    {
        image:
            "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&h=800&q=80",
        title: "Kid's Fashion",
      
    },
    {
        image:
            "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=600&h=800&q=80",
        title: "Accessories",
        
    },
];

const Category = () => {
    return (
        <div className={styles.category}>
            <div className="container mb-5 mt-5">
                <div className="row g-4">
                    {categories.map((item, index) => (
                        <div className="col-6 col-md-3" key={index}>
                            <Link to={item.link} className={styles.item}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    loading="lazy"
                                />

                                <div className={styles.overlay}>
                                    <h4>{item.title}</h4>

                                    <span className={styles.shopNow}>
                                        Shop Now{" "}
                                        <i className="bi bi-arrow-right" />
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Category;