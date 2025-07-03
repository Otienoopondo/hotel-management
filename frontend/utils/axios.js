import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token based on user type (client, staff, admin)
instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;

      let token;
      if (path.includes("/client")) {
        token = localStorage.getItem("clientToken");
      } else if (path.includes("/staff")) {
        token = localStorage.getItem("staffToken");
      } else if (path.includes("/admin")) {
        token = localStorage.getItem("adminToken");
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional global error handler
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;
