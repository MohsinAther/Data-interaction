const mongoose = require('mongoose'),
    companies = require('../models/companies').Company,
    utils = require('../services/utils');




exports.lookup_company = async (req, res) => {

    if (!req.params.query)
        return res.status(406).send({ message: "Not query found to lookup" });


    let [err, data] = await utils.resolver(companies.find({ "$or": [{ "company": new RegExp(req.params.query, 'i') }, { "ticker": new RegExp(req.params.query, 'i') }] }).limit(10))

    if (err)
        return res.status(406).send({ message: "failed to lookup company" });

    res.json(data)

}