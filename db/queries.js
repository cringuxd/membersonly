const pool = require("./pool");


async function addUser(firstname, lastname, username, password) {
    await pool.query("INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)", [firstname,lastname,username,password]);
}

async function updateMemberStatus(username) {

}

module.exports = {
    addUser,
    updateMemberStatus
};
