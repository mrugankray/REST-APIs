const errors = require('restify-errors')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const auth = require('../authenticate')
const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = (server) => {
    //Register user
    server.post('/register',(req, res, next) => {
        if(!req.is('application/json')) {
            return next(new errors.InvalidContentError("expects content type to be 'application/json'"))
        } else {
            const {email, password} = req.body;
            const user =  new User({
                email,
                password
            });
            bcrypt.genSalt(10, (err, salt) => {
                if(err) {
                    res.send('error in library');
                    return next(new errors.InternalError(err.message));
                } else {
                    bcrypt.hash(user.password, salt, async (err, hash) => {
                        if (err) {
                            return next(new errors.InternalError(err.message));
                        } else {
                            //hashing the password
                            user.password = hash;
                            //save user
                            try {
                                const newUser = await user.save();
                                res.send(201);
                                next();
                            } catch(err) {
                                res.send('unable to register')
                                return next(new errors.InternalError(err.message))
                            }
                        }
                    });                    
                }
            });
        }
    });

    server.post('/auth', async (req, res, next) => {
        const {email, password} = req.body;
        try {
            const user = await auth.authenticate(email, password);
            
            //create a token
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '15m'
            });

            //respond with tokem
            const {iat, exp} = jwt.decode(token)
            res.send({iat, exp, token})
            
            console.log(user);
        } catch (err) {
            //user unauthorized
            return next(new errors.UnauthorizedError(err));
        }
    });

}