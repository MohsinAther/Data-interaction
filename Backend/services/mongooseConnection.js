const mongoose = require('mongoose'),
    utils = require('./utils');


exports.makeConnection = async () => {

    let db = "DataIntreaction"
    if (process.env.NODE_ENV === 'production') {
        let [err, con] = await utils.resolver(mongoose.connect('mongodb://localhost:27017/' + db, {
            useNewUrlParser: true, useFindAndModify: false, "auth": {
                "authSource": "admin"
            },
            "user": "admin",
            "pass": "VWg4Q1gzjNV6FF1oPqwxERq6GEfIwQrDpAtkCE7s3hUDmZO7yvgqzI"
        }))
        if (!err)
            return console.log("can not connect to db")
        console.log("Connected to DB, prod")
        return con
    }

    else {

        let [err, con] = await utils.resolver(mongoose.connect('mongodb://localhost:27017/' + db));
        if (!err)
            return console.log("can not connect to db")
        console.log("Connected to DB")
        return con
    }

}