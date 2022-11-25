let mongoose = require('mongoose'),
    companies = require('../models/companies').Company;


exports.seedCompanies = async (req, res) => {
    //comapniesList = require('../data/YahooUTF8.json');
    comapniesList = [{
        "ticker": "AAPL",
        "company": "Apple Inc.",
        "PNK": "NMS",
        "FIELD4": "Electronic Equipment",
        "USA": "USA",
        "FIELD6": ""
    },
    {
        "ticker": "BAC",
        "company": "Bank of America Corporation",
        "PNK": "NYQ",
        "FIELD4": "Money Center Banks",
        "USA": "USA",
        "FIELD6": ""
    },
    {
        "ticker": "AMZN",
        "company": "Amazon.com, Inc.",
        "PNK": "NMS",
        "FIELD4": "Catalog & Mail Order Houses",
        "USA": "USA",
        "FIELD6": ""
    },
    {
        "ticker": "T",
        "company": "AT&T Inc.",
        "PNK": "NYQ",
        "FIELD4": "Telecom Services - Domestic",
        "USA": "USA",
        "FIELD6": ""
    }]

    for (let i = 0; i < comapniesList.length; i++) {

        let data = new companies(comapniesList[i]);
        data.save()

    }
    console.log("All done");
    res.send('done')
}
// seedCompanies()