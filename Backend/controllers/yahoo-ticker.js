const yahooFinance = require('yahoo-finance');
const utils = require('../services/utils'),
  _ = require('lodash'),
  moment = require('moment');


exports.historicData = async (req, res) => {
  try {

    // Adj Close: "233.865067"
    // Close: "235.770004"
    // Date: "2021-03-31"
    // High: "239.100006"
    // Low: "232.389999"
    // Open: "232.910004"
    // Volume: "43623500"
    if (!req.params.ticker)
      return res.status(406).send({ message: "No ticker found for historic data" });


    let [err, data] = await utils.resolver(yahooFinance.historical({
      symbol: req.params.ticker,
      from: '2022-01-01',
      to: '2022-11-25',
      // modules: ['summaryDetail', 'price'],
      period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    }))
    if (err)
      return res.status(406).send({ message: "Can not get data from Yahoo API" });


    let sorted = _.sortBy(data, [function (o) { return o.date; }]);

    let resp = sorted.map((ele, index) => {
      let x = ele.date.toISOString();
      x = new Date(x).getTime();

      return { "Date": x, "Open": ele.open || 0, "High": ele.high || 0, "Low": ele.low || 0, "Close": ele.close || 0, "Adj Close": ele.adjClose || 0, "Volume": ele.volume || 0 }

    });

    return res.json(resp)


  }
  catch (err) {
    return res.status(406).send({ message: "Can not get data from Yahoo API" });
  }


}