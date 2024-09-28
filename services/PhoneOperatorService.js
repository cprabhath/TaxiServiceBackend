
const db = require("../services/db");

// ------------------------------ getPhoneOperatorByUsername ---------------------------------//
const getPhoneOperatorByUsername = async (username) => {
  try {
    const user = await db.phoneOperator.findFirst({
      where: {
        username: username,
        status: "active",
      },
    });
    return user;
  } catch (err) {
    console.error("Error fetching user: ", err);
  }
};
// -------------------------------------------------------------------------------------------//


module.exports = {
    getPhoneOperatorByUsername,
}