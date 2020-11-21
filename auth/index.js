const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const router = express.Router();
const db = require('../db/connection.js');

const schema = Joi.object({
    firstname: Joi.string(),
    lastname: Joi.string(),
    email : Joi.string().email().min(6).max(30).required(),
    dateofbirth : Joi.date(),
    password: Joi.string().trim().min(6).required(),
});

router.get('/', (req, res) => {
    db.find({}).sort({ createdAt: -1 }).exec((err, doc) => {
        res.json(doc)
    })
});


router.post('/signup', (req, res, next) => {
    const result = schema.validate(req.body);


    //working now
    if (result.error == null) {
        //valid request no error so proceed
        db.findOne({ "email": req.body.email }, (err, doc) => {

            if (doc == null) {
                //insert the user with the hashed password
               
                bcrypt.hash(req.body.password, 12).then(hashedPassword => {
                    const newuser = {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        dateofbirth: req.body.dateofbirth,
                        password: req.body.password,
                        hashedPassword: hashedPassword,
                        status: "active"
                    }
                    db.insert(newuser, (err, newDoc) => {
                        //delete newDoc.password;
                        newDoc.message = "User Added";
                        res.json(newDoc);
                    })
                })
            } else {
                const error = new Error('Email already taken');
                next(error);
            }
        })
    } else {
        //invalid request
        next(result.error);
    }

})

module.exports = router;