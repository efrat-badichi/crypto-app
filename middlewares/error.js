const errorHnadler =  (error, req, res, next) =>{
    res.status(error.status || 400).send(error.message); 
}

module.exports = errorHnadler; 