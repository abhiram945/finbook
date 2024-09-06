const authenticateAdmin =async (req,res,next)=>{

    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401).json({
            success:false,
            message:"Not authorized, not admin"
        })
    }
}

export default authenticateAdmin;