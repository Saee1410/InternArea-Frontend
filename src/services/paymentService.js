import axios from "axios";

const API = "http://localhost:8000/api/payment";

export const createResumeOrder = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API}/create-order`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const verifyResumePayment = async (paymentData) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API}/verify`,
        paymentData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};