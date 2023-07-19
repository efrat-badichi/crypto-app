const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/mymongo")

module.exports = (req, res, next) =>{
    req.mongoose = mongoose; 
    next(); 
}