const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    
    try {
        let user = await User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({error:"sry a user with this email already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);
        //creates a new user
        user= await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })
        const data = {
            user:{
                id:user.id,
            }
        }

        const authtoken = jwt.sign(data,"mysecretkey");
        console.log(authtoken)
        // res.json({authtoken})
        res.json({user})

        
    } catch (error) {
        //if there is error returns message
        console.error(error.message);
        res.status(500).send('something error has occured');
    }
})

module.exports = router