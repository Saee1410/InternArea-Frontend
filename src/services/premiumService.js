import axios from "axios";

const API_URL = "http://localhost:8000/api/premium/check";

export const checkPremium = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        API_URL,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
}