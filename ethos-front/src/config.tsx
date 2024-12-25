const Config = {
    baseURL : import.meta.env.MODE === "development" ? "http://127.0.0.1:8000" : "/"
}

export default Config;