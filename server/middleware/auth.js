const { response } = require('express');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const token = req.header('auth-token')
    if(!token){
        return res.send("No token - Autorization Denied")
    }
    try{
        const verifeid = jwt.verify(token, process.env.JWT_SECRET)
        if(!verified){
            return res.send("Cannot Verify")
        }
        req.user = verified
        next()
    } catch(err){
        res.send(err)
    }
}