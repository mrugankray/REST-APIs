const errors = require('restify-errors');
const Customers = require('../models/Customers');

module.exports = (server) => {
    //Get customers
    server.get('/customers', async (req,res,next) => {
        try {
            const customers = await Customers.find({})
            res.send(customers)
            next();
        }
        catch(err) {
            return next(new errors.InvalidContentError(err))
        }
    });

    //single customer
    server.get('/customers/:id', async (req,res,next) => {
        try {
            const customer = await Customers.findById(req.params.id)
            res.send(customer)
            next();
        }
        catch(err) {
            return next(new errors.ResourceNotFoundError(`customer with id ${req.params.id} does not exist`));
        }
    });

    //Add customer
    server.post('/customers', async (req,res, next) => {
        //check for json
        if(!req.is('application/json')) {
            return next(new error.InvalidContentError("expects content type to be 'content/json'"))
        }

        const {name,email,balance} = req.body
         
        const customer = new Customers({
            name,
            email,
            balance
        });
        try {
            const newCustomer = await customer.save()
            res.send(201)
        } catch(err) {
            return next(new errors.InternalError(err.message))
        }
    });

    //update customer
    server.put('/customers/:id', async (req,res, next) => {
        //check for json
        if(!req.is('application/json')) {
            return next(new error.InvalidContentError("expects content type to be 'content/json'"))
        }
        try {
            const newCustomer = await Customers.findOneAndUpdate({_id:req.params.id}, req.body);
            res.send(201)
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`customer with id ${req.params.id} does not exist`));
        }
    });

    //delete customer
    server.del('/customers/:id', async (req,res,next) => {
        try {
            const customer = await Customers.findOneAndRemove({_id:req.params.id});
            res.send(204);
        } catch(err) {
            next(new errors.ResourceNotFoundError(`there is no customer with id ${req.params.id}`));
        }
    })

};