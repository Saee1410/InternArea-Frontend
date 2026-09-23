import axios from "axios";

const API_URL = "http://localhost:8000/api/french-language";
//const API_URL = "https://internarea-4g9n.onrender.com/api/french-language";

// ==========================================
// SEND FRENCH LANGUAGE OTP
// ==========================================

export const sendFrenchOTP = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API_URL}/send`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};


// ==========================================
// VERIFY FRENCH LANGUAGE OTP
// ==========================================

export const verifyFrenchOTP = async (otp) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API_URL}/verify`,
        {
            otp,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};
