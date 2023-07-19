const UserSymbol = require('../../models/mysql/user-symbol')
const SymbolValue = require("../../models/mongo/symbols-values"); 

const addSymbol = async (req, res, next) => {
    try {
        const userSymbol = new UserSymbol(req.pool);
        await userSymbol.create({
            userId: 123,
            symbol: req.body.symbol 
        });
        res.send('user symbol added');
    } catch (err) {
        next(err);
    } 
}

const dashboard = async (req, res, next) => {
    try {
        const userSymbol = new UserSymbol(req.pool);
        const userSymbols = await userSymbol.getForUser({userId: 123});

        const promises = userSymbols.map( us => SymbolValue.findOne({symbol: us.symbol}).sort({when: -1})); 
        const allRates = await Promise.all(promises); 

        res.render('dashboard', {
            username: 'shlomo',
            userSymbols,
            allRates
        });
        
    } catch (err) {
        next(err);
    }
}
 
module.exports = {
    addSymbol,
    dashboard,
};