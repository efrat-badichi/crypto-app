process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

process.env.SUPPRESS_NO_CONFIG_WARNING = true;
const axios = require('axios');
const cheerio = require('cheerio');

const mysql = require('mysql2');
const util = require('util');
const config = require('config');
const mongoose = require("mongoose"); 

const UserSymbol = require('./models/mysql/user-symbol');
const SymbolValue = require("./models/mongo/symbols-values");

const { io } = require('socket.io-client');
// const socket = io(`http://${config.get('app.host')}:${config.get('app.port')}`);
const socket = io(`http://localhost:3000`);



const connection = mysql.createConnection(config.get('mysql')); //{
//     host: "localhost",// config.get('mysql.host'),
//     user: "username",//config.get('mysql.user'),
//     password:"password",// config.get('mysql.password'),
//     database: "mydb",//config.get('mysql.database'),
//     port: 3306
// }); //config.get('mysql'));

connection.connect = util.promisify(connection.connect);
connection.query = util.promisify(connection.query);



const scrape = async({symbol}) => {
    const result = await axios(`https://www.google.com/finance/quote/${symbol}-USD`);
    const $ = cheerio.load(result.data);
    const value = $('.YMlKec.fxKbKc').text().replace(',','');
  
    const symbolValue = new SymbolValue({
        symbol,
        value,
        when: new Date(),
    });
    await symbolValue.save();
    socket.emit("CurrencyUpdated", {symbol: symbolValue.symbol, value: symbolValue.value} ); 
    console.log(`Scraped ${value} for ${symbol}`);
    return value;
}

const cycle = async () => {
    try{

        const userSymbol = new UserSymbol(connection);
        const symbols = await userSymbol.getDistinct();
        const promises = symbols.map((symbol => scrape(symbol)));
        const results = await Promise.allSettled(promises);

    } catch (err) {
        console.log(err);
    } finally {
        setTimeout(cycle, 10000);// config.get('worker.interval'));
    }

}

(async () => {

    await mongoose.connect('mongodb://127.0.0.1:27017/mymongo');

    cycle();

})();