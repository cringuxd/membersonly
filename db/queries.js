const pool = require("./pool");


async function addUser(firstname, lastname, username, password) {
    await pool.query("INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)", [firstname,lastname,username,password]);
}

async function updateMemberStatus(username) {
    console.log(username);
    await pool.query("UPDATE users SET member = 'true' WHERE username=$1", [username]);
}

async function addMessage(timestamp, text, username) {
    await pool.query("INSERT INTO messages (timestamp,text,username) VALUES ($1, $2, $3)", [timestamp,text,username]);
}

async function getMessages() {
    const {rows} = await pool.query("SELECT * FROM messages");
    return rows;
}
module.exports = {
    addUser,
    updateMemberStatus,
    addMessage,
    getMessages
};
