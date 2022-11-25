let mongoose = require('mongoose'),
    companies = require('../models/companies').Company;


exports.seedCompanies = async (req, res) => {
    //comapniesList = require('../data/YahooUTF8.json');
    comapniesList = [{
        "OEDV": "AAPL",
        "Osage Exploration and Development, Inc.": "Apple Inc.",
        "PNK": "NMS",
        "FIELD4": "Electronic Equipment",
        "USA": "USA",
        "FIELD6": ""
    },
    {
        "OEDV": "BAC",
        "Osage Exploration and Development, Inc.": "Bank of America Corporation",
        "PNK": "NYQ",
        "FIELD4": "Money Center Banks",
        "USA": "USA",
        "FIELD6": ""
    },
    {
        "OEDV": "AMZN",
        "Osage Exploration and Development, Inc.": "Amazon.com, Inc.",
        "PNK": "NMS",
        "FIELD4": "Catalog & Mail Order Houses",
        "USA": "USA",
        "FIELD6": ""
    },
    {
        "OEDV": "T",
        "Osage Exploration and Development, Inc.": "AT&T Inc.",
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