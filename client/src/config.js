import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://aiecommerce-ahhg.onrender.com/" || "",
});
