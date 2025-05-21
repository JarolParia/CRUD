const bcrypt = require('bcryptjs'); //Import bcrypt library for password hashing


const hashPassword = async (password) =>{

    const saltRounds =10; //Number of salt round (10 is standard for good security-performance balance)
    return await bcrypt.hash(password, saltRounds);
}

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    hashPassword,
    comparePassword
}