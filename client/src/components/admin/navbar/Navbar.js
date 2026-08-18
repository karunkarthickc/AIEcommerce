import React from "react";
import { AiOutlineSearch, AiOutlineBell } from "react-icons/ai";
import styles from "./Navbar.module.scss";

const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={styles.search}>
                <AiOutlineSearch size={16} />
                <input type="text" placeholder="Search orders, products, users…" />
            </div>

            <div className={styles.right}>
                <button className={styles.iconBtn} aria-label="Notifications">
                    <AiOutlineBell size={18} />
                </button>
                <div className={styles.profile}>
                    <span className={styles.avatar}>A</span>
                    <div className={styles.profileText}>
                        <span className={styles.name}>Admin</span>
                        <span className={styles.role}>Administrator</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;