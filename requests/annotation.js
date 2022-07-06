import { ROOT_API } from "./constants";
const axios = require("axios").default;

export const updateSignboard = async ({signboardId, imageId, payload, accessToken}) => {
    try {
        const response = await axios.patch(
            `${ROOT_API}/signboards/${signboardId}/image/${imageId}`,
            JSON.stringify(payload),
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