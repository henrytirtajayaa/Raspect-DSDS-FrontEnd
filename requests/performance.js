import { ROOT_API } from "./constants";
const axios = require("axios").default;

export const getHistory = async ({ surveyPayload, accessToken }) => {
    try {
        const response = await axios.post(
            `${ROOT_API}/performance`,
            JSON.stringify(surveyPayload),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response;
    } catch (e) {
        return e.response.status;
    }
}