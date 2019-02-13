const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = mongoose.model('user')

exports.authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Get user by email
            const user = await User.findOne({email});

            //Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) {
                    throw err;
                } else if(isMatch) {
                    resolve(user);
                } else {
                    //password did not match
                    reject('Authentication fail');
                }
            });

        } catch(err) {
            //email not found
            reject('Authenticate Failed');
        }
    });
}