const express = require("express"); 
const inputValidator = require("../validators/input-validations"); 
const {addSymbolValidator} = require("../controllers/users/validator"); 
const {addSymbol, dashboard} = require("../controllers/users/controller"); 
const mongo = require("../middlewares/mongo"); 

const router = express.Router(); 

router.use(mongo)
router.get("/dashboard", dashboard); 

router.get("/logout", (req, res, next) =>{
    res.send("logout")
})

// router.post("/symbol", (req, res, next) =>{
//     res.send("symbol")
// })

router.post('/symbol', inputValidator(addSymbolValidator), addSymbol)

module.exports = router;