const jwt = require('jsonwebtoken')

const fetchuser = (req,res,next)=>{
    //get the user from the jwt token and add id to the request object
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error:"please authentiacte a valid token"})
    }
    try {
        const data = jwt.verify(token,"mysecretkey")
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).send({error:"please authentiacte a valid token"})
    }
}

module.exports = fetchuser