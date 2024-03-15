const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, "Informally_betA", {
        expiresIn: "30d",
    });
}
module.exports = generateToken;