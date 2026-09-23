import axios from "axios";

const API_URL = "http://localhost:8000/api/resumes";

export const createResume = async (resumeData) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API_URL}/create`,
        resumeData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getMyResume = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/my`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
}