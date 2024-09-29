// Purpose Check user's authentication levels such as admin, phone Operator, driver, etc.
// -------------------------- Importing Modules --------------------------
const jwt = require('jsonwebtoken');
// -----------------------------------------------------------------------

// -------------------------- Import Secret Key --------------------------
const secretKey = process.env.JWT_SECRET;
// -----------------------------------------------------------------------

// -------------------------- Verify Token -------------------------------
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                reject(err.message);
                return
            } else {
                resolve(decoded);
            }
        });
    });
}
// -----------------------------------------------------------------------

// -------------------------- Exporting Modules --------------------------
module.exports = {
    verifyToken
}