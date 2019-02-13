const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const server = restify.createServer();
const rjwt = require('restify-jwt-community')

//Middleware
server.use(restify.plugins.bodyParser());

//protect routes
server.use(rjwt({secret: config.JWT_SECRET}).unless({path:['/auth', '/register','/customers']}));

//listen
server.listen(config.PORT,() => {
    mongoose.set('useFindAndModify', false);// disables FindAndModify prompt by mongoDB  
    mongoose.connect(
        config.MONGODB_URI,
        { useNewUrlParser:true } // disables warning 
    );
});

const db = mongoose.connection

db.on('error', err => {
    console.log(err);
});

db.once('open',() => {
    require('./routes/customers')(server)
    require('./routes/users')(server)
    console.log(`Server stared on port ${config.PORT}`)
});