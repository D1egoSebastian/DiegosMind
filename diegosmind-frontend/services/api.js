const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5161/api";

const getToken = () => localStorage.getItem("token")

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
})

const headers = () => ({
    "Content-Type": "application/json"
})

// Auth
export const login = (data) =>
    fetch(`${API_URL}/auth/login`, { method: "POST", headers: headers(), body: JSON.stringify(data) });

const REVALIDATE_TIME = 3600; // 1 hour

// Posts
export const getPosts = () =>
    fetch(`${API_URL}/post`, { next: { revalidate: REVALIDATE_TIME }, headers: headers() });

export const getPostById = (id) =>
    fetch(`${API_URL}/post/id/${id}`, { next: { revalidate: REVALIDATE_TIME }, headers: headers() });

export const getPostBySlug = (slug) =>
    fetch(`${API_URL}/post/${slug}`, { next: { revalidate: REVALIDATE_TIME }, headers: headers() });

    export const createPost = (data) =>
    fetch(`${API_URL}/post`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });

    export const updatePost = (id, data) =>
    fetch(`${API_URL}/post/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) });

    export const deletePost = (id) =>
    fetch(`${API_URL}/post/${id}`, { method: "DELETE", headers: authHeaders() });

    // Categories
export const getCategories = () =>
    fetch(`${API_URL}/categories`, { next: { revalidate: REVALIDATE_TIME }, headers: headers() });

    export const uploadImage = (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
};