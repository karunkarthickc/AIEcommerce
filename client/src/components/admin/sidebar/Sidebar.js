import React from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineDashboard, MdOutlineFavoriteBorder } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";
import { FiPlusSquare } from "react-icons/fi";
import { HiTemplate } from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";

import styles from "./Sidebar.module.scss";

const NAV_SECTIONS = [
    {
        label: "Main",
        items: [
            { to: "/admin", label: "Dashboard", icon: MdOutlineDashboard, end: true },
        ],
    },
    {
        label: "List",
        items: [
            { to: "/admin/products", label: "Products", icon: HiTemplate },
            { to: "/admin/orders", label: "Orders", icon: MdOutlineFavoriteBorder },
            { to: "/admin/users", label: "Users", icon: BiUserCircle },
            { to: "/admin/reviews", label: "Reviews", icon: AiFillStar },
        ],
    },
    {
        label: "Service",
        items: [
            { to: "/admin/products/new", label: "Add Product", icon: FiPlusSquare },
        ],
    },
];

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <span className={styles.mark}>S</span>
                <span className={styles.brandName}>ShopX</span>
            </div>

            <nav className={styles.nav}>
                {NAV_SECTIONS.map((section) => (
                    <div key={section.label} className={styles.section}>
                        <span className={styles.sectionLabel}>{section.label}</span>
                        <ul>
                            {section.items.map(({ to, label, icon: Icon, end }) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        end={end}
                                        className={({ isActive }) =>
                                            isActive ? styles.active : undefined
                                        }
                                    >
                                        <Icon size={19} />
                                        <span>{label}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;