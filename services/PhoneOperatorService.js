
const db = require("../services/db");

// ------------------------------ getPhoneOperatorByUsername ---------------------------------//
const getPhoneOperatorByUsername = async (email) => {
  try {
    const user = await db.phoneOperator.findFirst({
      where: {
        email: email,
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