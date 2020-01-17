module.exports = function checkAuthentication(req,res,next){
    if(req.isAuthenticated()) {
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else {
        res.send({errors: ["You must be logged in to view this resource"]});
    }
}
