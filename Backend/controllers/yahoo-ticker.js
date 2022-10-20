const yahooFinance = require('yahoo-finance');
const utils = require('../services/utils'),
  _ = require('lodash');


exports.historicData = async (req, res) => {
  try {
    if (!req.params.ticker)
      return res.status(406).status({ message: "No ticker found for historic data" });


    let [err, data] = await utils.resolver(yahooFinance.historical({
      symbol: req.params.ticker,
      from: '2021-10-01',
      to: '2022-11-01',
      // modules: ['summaryDetail', 'price'],
      period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    }))
    if (err)
      return res.status(406).status({ message: "Can not get data from Yahoo API" });


    let [err2, data2] = await utils.resolver(yahooFinance.quote({
      symbol: 'AAPL',
      modules: [ 'summaryDetail'] // see the docs for the full list
    }))

    data2 = _.pick(data2, ['summaryDetail.marketCap', 'summaryDetail.fiftyTwoWeekLow', 'summaryDetail.fiftyTwoWeekHigh', 'summaryDetail.fiftyDayAverage', 'summaryDetail.currency'])


    let json = { historical: data, details: data2.summaryDetail }

    res.json(json)


  }
  catch (err) {
    return res.status(406).status({ message: "Can not get data from Yahoo API" });
  }


}