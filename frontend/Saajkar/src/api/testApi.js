import API_URL from "./api";

export const testApi = async () => {
    try {
        const response = await fetch(`${API_URL}/products`);

        const data = await response.json();

        console.log("Backend response:", data);

        return data;
    } catch (error) {
        console.error("Backend connection error:", error);
    }
};