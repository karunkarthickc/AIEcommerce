import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import styles from "./NewProduct.module.scss";
import { clearErrors, newProduct } from "../../../actions/productAction";
import { NEW_PRODUCT_RESET } from "../../../constants/productsConstants";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import Navbar from "../../../components/admin/navbar/Navbar";
import MetaData from "../../../components/MetaData";

const NewProduct = ({ history }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState("");
    const [type, setType] = useState("");
    const [imagesPreview, setImagesPreview] = useState([]);
    const [images, setImages] = useState([]);
const [imageUrl, setImageUrl] = useState("");

const addImageUrl = () => {
    if (imageUrl.trim() === "") return;
    setImages((oldArray) => [...oldArray, imageUrl.trim()]);
    setImageUrl("");
};

const removeImageUrl = (url) => {
    setImages((oldArray) => oldArray.filter((img) => img !== url));
};

    const categories = [
        "Eid Collection",
        "New Collection",
        "Featured",
        "Footwear",
        "Accessories",
        "Clothing",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Other",
    ];
    const types = ["Men", "Women", "Kids"];

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector(
        (state) => state.newProduct
    );

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            history.push("/admin/products");
            alert.success("Product created successfully");
            dispatch({ type: NEW_PRODUCT_RESET });
        }
    }, [dispatch, alert, error, success, history]);

const submitHandler = (e) => {
    e.preventDefault();

    const productData = {
        name,
        price,
        description,
        category,
        stock,
        seller,
        type,
        images, // <-- make sure this line exists
    };

    console.log("Submitting:", productData); // temporary debug log

    dispatch(newProduct(productData));
};
    const onChange = (e) => {
        const files = Array.from(e.target.files);

        setImagesPreview([]);
        setImages([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((oldArray) => [
                        ...oldArray,
                        reader.result,
                    ]);
                    setImages((oldArray) => [...oldArray, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    return (
        <div className={styles.new_product}>
            <MetaData title={"Add Product"} />
            <div className="row g-0">
                <div className="col-md-2">
                    <Sidebar />
                </div>
                <div className="col-md-10">
                    <Navbar />
                    <div className={styles.content}>
                        <header className={styles.pageHeader}>
                            <p className={styles.eyebrow}>Catalog</p>
                            <h1>Add product</h1>
                            <p className={styles.subhead}>
                                Fill in the details below to list a new product.
                            </p>
                        </header>

                        <form onSubmit={submitHandler} className={styles.form}>
                            <section className={`${styles.section} ${styles.basicSection}`}>
                                <h2>Basic details</h2>
                                <div className={styles.field}>
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Classic Leather Sneakers"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="description_field">Description</label>
                                    <textarea
                                        id="description_field"
                                        rows="4"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="What makes this product worth buying?"
                                    ></textarea>
                                </div>
                                <div className={styles.row2}>
                                    <div className={styles.field}>
                                        <label htmlFor="category_field">Category</label>
                                        <select
                                            id="category_field"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="type_field">Type</label>
                                        <select
                                            id="type_field"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                        >
                                            {types.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </section>

               <section className={`${styles.section} ${styles.imagesSection}`}>
    <h2>Images</h2>
    <div className={styles.field}>
        <label htmlFor="image_url_field">Image URL</label>
        <div className={styles.urlInputRow}>
            <input
                type="text"
                id="image_url_field"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
            />
            <button type="button" onClick={addImageUrl} className={styles.submitBtn}>
                Add
            </button>
        </div>
    </div>

    {images.length > 0 && (
        <div className={styles.previewGrid}>
            {images.map((img) => (
                <div key={img} className={styles.previewItem}>
                    <img src={img} alt="Product preview" />
                    <button
                        type="button"
                        onClick={() => removeImageUrl(img)}
                        className={styles.removeBtn}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    )}
</section>

                            <section className={`${styles.section} ${styles.pricingSection}`}>
                                <h2>Pricing &amp; inventory</h2>
                                <div className={styles.row2}>
                                    <div className={styles.field}>
                                        <label htmlFor="price_field">Price</label>
                                        <input
                                            type="text"
                                            id="price_field"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="stock_field">Stock</label>
                                        <input
                                            type="number"
                                            id="stock_field"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="seller_field">Seller name</label>
                                    <input
                                        type="text"
                                        id="seller_field"
                                        value={seller}
                                        onChange={(e) => setSeller(e.target.value)}
                                    />
                                </div>
                            </section>

                            <div className={styles.formFooter}>
                                <button type="submit" className={styles.submitBtn} disabled={loading}>
                                    {loading ? <ButtonLoader /> : "Add product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewProduct;