import axios from "axios";

const api = axios.create({
    baseURL: "https://jobportall.infinityfreeapp.com/api",
    headers: {
        Accept: "application/json",
    },
});

export default api;