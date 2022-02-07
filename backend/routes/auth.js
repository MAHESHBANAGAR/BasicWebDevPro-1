const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

//create user using:POST /api/auth/createuser

router.post('/createuser',[
    body('email','Enter a valid email').isEmail(),

    body('name','Enter a valid name').isLength({ min: 3 }),
    body('password','password should b atleast 5 characters').isLength({ min: 5 })
],async (req,res)=>{
    // if there are errors returns bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({error:"sry a user with this email already exists"})
    }
    user= await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
    })
    // .then(user => res.json(user))
    // .catch(err => res.status(400).json(err))
    res.json({"nice":"you have created a user"});
})

module.exports = router