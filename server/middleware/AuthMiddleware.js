const { verify } = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken; // Extract token from cookie instead of header

    if (!accessToken)  {
        return res.json({ error: "User not logged in" });
    } else {
        try {
            const validToken = verify(accessToken, "importantsecret");
            req.user = validToken;
            if (validToken) {
                return next();
            }
        } catch (err) {
            return res.json({ error: err.message }); // Return error message
        }
    }
}

module.exports = { validateToken };
