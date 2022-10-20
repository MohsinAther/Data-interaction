const mongoose = require('mongoose'),
    utils = require('./utils');


exports.makeConnection = async () => {

    let [err, con] = await utils.resolver(mongoose.connect('mongodb://localhost:27017/DataIntreaction', { useNewUrlParser: true }));
    if (!err)
        return console.log("can not connect to db")
    console.log("Connected to DB")
    return con


}