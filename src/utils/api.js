import axiosInstance from './axios';

export const registerUser = (data) => axiosInstance.post('/auth/register', data);
export const verifyOTP = (data) => axiosInstance.post('/auth/verify', data);
export const loginWhatsApp = (data) => axiosInstance.post('/auth/login_whatsapp', data);
export const verifyWhatsApp = (data) => axiosInstance.post('/auth/verify_whatsapp', data);
export const getUserInfo = () => axiosInstance.get('/auth/get_info');
export const getBrands = () => axiosInstance.get('/brands/get');
export const getCategories = () => axiosInstance.get('/categories');
export const getProductsByCategory = (slug) => axiosInstance.get(`/products/getbycat/${slug}`);
export const getProductBySlug = (slug) => axiosInstance.get(`/products/slug/${slug}`);
export const searchProducts = (name) => axiosInstance.get(`/products/getbyname?name=${name}`);
export const addToCart = (data) => axiosInstance.post('/cart/add', data);
export const updateCart = (data) => axiosInstance.post('/cart/update', data);
export const removeFromCart = (id) => axiosInstance.post('/cart/remove_item', { item_id: id });
export const clearCart = () => axiosInstance.delete('/cart/delete');