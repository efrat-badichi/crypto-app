const express = require("express"); 

const router = express.Router(); 

router.get("/authenticate", (req, res, next) =>{
    res.send("authenticate")

}); 
router.get("/callback", (req, res, next) =>{
    res.send("callback")
})

module.exports = router;