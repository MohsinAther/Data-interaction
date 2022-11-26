let mongoose = require('mongoose'),
    companies = require('../models/companies').Company;


exports.seedCompanies = async (req, res) => {
    comapniesList = require('../data/YahooUTF8.json');


    for (let i = 0; i < comapniesList.length; i++) {

        let data = new companies(comapniesList[i]);
        data.save()

    }
    console.log("All done");
    res.send('done')
}
// seedCompanies()