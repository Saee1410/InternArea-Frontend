import axios from "axios";

const API_URL = "http://localhost:8000/api/resume-otp";

export const sendResumeOTP = async (email) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API_URL}/send`,
        { email },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const verifyResumeOTP = async (email, otp) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API_URL}/verify`,
        { email, otp },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};