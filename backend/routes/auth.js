const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var fetchuser = require('../middleware/fetchuser')

//Route 1 : create user using:POST /api/auth/createuser

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
        res.json({authtoken})

        
    } catch (error) {
        //if there is error returns message
        console.error(error.message);
        res.status(500).send('internal server error');
    }
})

//Route 2: create user using:POST /api/auth/login

router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','password should not be blank').exists()
],async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body 
    try {
        let user = await User.findOne({email})
        if(!user){
            res.status(400).json({error:"please try to login with the correct credentials"})
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            res.status(400).json({error:"please try to login with the correct credentials"})
        }
        const data = {
            user:{
                id: user.id,
            }
        }
        const authtoken = jwt.sign(data,"mysecretkey");
        console.log(authtoken)
        res.json({authtoken})

    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error');
    } 

})

//Route 3: get logged in uder details using POST:"api/auth/getuser"
router.post('/getuser',fetchuser,async (req,res)=>{

    try {
        userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error');
    }
})

module.exports = router