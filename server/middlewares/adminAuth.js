const adminAuth=(req, res, next)=>{
    if(!req.body.userData.isAdmin){
        return res.status(400).json({
            success:false,
            message:"Not an Admin"
        })
    }
    next();
}

export default adminAuth;