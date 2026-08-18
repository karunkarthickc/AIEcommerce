import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    clearErrors,
    getProductDetails,
    updateProduct,
} from "../../../actions/productAction";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { UPDATE_PRODUCT_RESET } from "../../../constants/productsConstants";

import styles from "./UpdateProduct.module.scss";
import Navbar from "../../../components/admin/navbar/Navbar";
import MetaData from "../../../components/MetaData";

const UpdateProduct = ({ history }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState("");
    const [type, setType] = useState("");
    const [images, setImages] = useState([]);

    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

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
    let { id } = useParams();

    const { error, product } = useSelector((state) => state.productDetails);
    const {
        loading,
        error: updateError,
        isUpdated,
    } = useSelector((state) => state.product);

    useEffect(() => {
        if (product && product._id !== id) {
            dispatch(getProductDetails(id));
        } else {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setSeller(product.seller);
            setStock(product.stock);
            setType(product.type);
            setOldImages(product.images);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            history.push("/admin/products");
            alert.success("Product updated successfully");
            dispatch({ type: UPDATE_PRODUCT_RESET });
        }
    }, [dispatch, alert, error, isUpdated, history, updateError, product, id]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("price", price);
        formData.set("description", description);
        formData.set("category", category);
        formData.set("stock", stock);
        formData.set("seller", seller);
        formData.set("type", type);

        images.forEach((image) => {
            formData.append("images", image);
        });

        dispatch(updateProduct(product._id, formData));
    };

    const onChange = (e) => {
        const files = Array.from(e.target.files);

        setImagesPreview([]);
        setImages([]);
        setOldImages([]);

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
            <MetaData title={"Update Products"} />
            <div className="row g-0">
                <div className="col-md-2">
                    <Sidebar />
                </div>
                <div className="col-md-10">
                    <Navbar />
                    <div className={styles.content}>
                        <header className={styles.pageHeader}>
                            <p className={styles.eyebrow}>Catalog</p>
                            <h1>Update product</h1>
                            <p className={styles.subhead}>
                                Editing details for {product?.name || "this product"}.
                            </p>
                        </header>

                        <form onSubmit={submitHandler} className={styles.form}>
                            <section className={styles.section}>
                                <h2>Basic details</h2>
                                <div className={styles.field}>
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="description_field">Description</label>
                                    <textarea
                                        id="description_field"
                                        rows="6"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </section>

                            <section className={styles.section}>
                                <h2>Organization</h2>
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

                            <section className={styles.section}>
                                <h2>Pricing &amp; inventory</h2>
                                <div className={styles.row2}>
                                    <div className={styles.field}>
                                        <label htmlFor="price_field">Price</label>
                                        <input
                                            type="text"
                                            id="price_field"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
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

                            <section className={styles.section}>
                                <h2>Images</h2>
                                <label htmlFor="customFile" className={styles.dropzone}>
                                    <AiOutlineCloudUpload size={26} />
                                    <span>Click to replace images</span>
                                    <small>Uploading new images replaces the current set</small>
                                    <input
                                        type="file"
                                        name="product_images"
                                        id="customFile"
                                        onChange={onChange}
                                        multiple
                                        className={styles.fileInput}
                                    />
                                </label>

                                {(oldImages?.length > 0 || imagesPreview.length > 0) && (
                                    <div className={styles.previewGrid}>
                                        {oldImages?.map((img) => (
                                            <img key={img.url} src={img.url} alt="Current product" />
                                        ))}
                                        {imagesPreview.map((img) => (
                                            <img src={img} key={img} alt="New preview" />
                                        ))}
                                    </div>
                                )}
                            </section>

                            <div className={styles.formFooter}>
                                <button type="submit" className={styles.submitBtn} disabled={loading}>
                                    {loading ? <ButtonLoader /> : "Update product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;