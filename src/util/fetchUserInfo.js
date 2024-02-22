
/**
 * This util function is to fetch user profile information from
 * autherization server end-point '/userInfo' depending on the
 * access-token from autherization process.
 *
 * These info used in finding user in our database depending on email field.
 *
 * @param {string} token - user access-token from authentication
 * @returns object of user info
 */
module.exports = async function fetchUserInfo(token) {
    try {
        const response = await fetch(
            "https://dev-ewlm305yder635da.us.auth0.com/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch user info");
        }

        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        throw error;
    }
};
