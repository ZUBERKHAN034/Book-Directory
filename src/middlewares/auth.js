const jwt = require("jsonwebtoken");

//------------------------------------------------------------------------------------------------------------------------------------------------------

const authorization = async function (req, res, next) {
    try {

        const token = req.cookies.access_token;

        if (!token) return res.status(403).send("Unauthorized");

        jwt.verify(token, "Secret_Key_123", { ignoreExpiration: true }, function (error, decodedToken) {
            // if token is not valid
            if (error) {
                return res.status(403).send("Unauthorized");

                // if token is valid
            } else {
                // checking if token session expired
                if (Date.now() > decodedToken.exp * 1000) {
                    return res.status(401).send({ status: false, msg: "Session Expired" });
                }
                //exposing decoded token email in request for everywhere access
                req.email = decodedToken.email;
                next();

            }
        }
        )

    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error", error: err.message });
    }
};

module.exports = { authorization }