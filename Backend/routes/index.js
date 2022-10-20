const express = require('express'),
  router = express.Router(),
  wordcloud = require('../controllers/wordcloud'),
  yahoo = require('../controllers/yahoo-ticker'),
  CompaniesController = require('../controllers/companies');
NewsController = require('../controllers/news'),
  seedController = require('../services/seed');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/lookup/:query', CompaniesController.lookup_company);

router.get('/api/historic/:ticker', yahoo.historicData)

router.post('/api/wordcloud', wordcloud.generate_word_cloud);

router.post('/api/news', NewsController.getNews);

router.get('/api/seedDB', seedController.seedCompanies);



module.exports = router;
