const  jwt = require("jsonwebtoken")

const auth = async (req,res,next)=>{
    const token = req.headers["x-access-token"];
    console.log(token);
    try {
       const decoded = jwt.verify(token,'secret123');
       if(decoded)
       return next();
       else return res.json({status:"error",error:"token expired",user: false});
                
    } catch (error) {
        console.log(error);
        return res.json({status:"error",user: false, error:"token expired! You have to login first!"});
    }

}

module.exports = auth;