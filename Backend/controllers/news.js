const axios = require('axios'),
    moment = require('moment');
const utils = require('../services/utils');

exports.getNews = async (req, res) => {

    try {
        var from = moment().subtract(360, 'days').toISOString()
        var now = moment().toISOString();

        var getHighest = {
            "params": {
                "q": `content: (${req.body.query})`,
                "fl": "id,timestamp,simhash",
                "fq": [
                    "timestamp:[ 2021-10-24T23:19:11.677Z TO 2022-10-19T23:19:11.678Z]"
                ],
                "facet": true,
                "facet.field": "simhash",
                "wt": "json",
                "json.nl": "map",
                "facet.limit": 30,
                // "facet.sort": "count",
                "rows": 0,
                "start": 0
            }
        }

        let [solrErr, simhash] = await utils.resolver(axios.post('http://158.69.25.177:8983/solr/gnowit/select', getHighest));
        if (solrErr)
            return res.status(406).status({ message: "Can not get data from SOLR" });

        let impArticles = simhash.data.facet_counts.facet_fields.simhash;
        // return res.json(impArticles)

        var JSONbody = {
            "params": {
                "q": `content: (${req.body.query}) AND simhash: (${Object.keys(impArticles, ele => `'${ele}'`).join(' , ')})`,
                "sort": 'timestamp desc',
                "group": "true",
                "group.field": 'simhash',
                "group.sort": "timestamp desc",
                "group.limit": -1,
                "group.ngroups": true,
                "fl": "id,groupid,simhash,snippet,url,timestamp,published,blogdesc,blogurl,sentiment,summary",
                "fq": [`timestamp:[ ${from} TO ${now}]`
                ],
                "wt": "json",
                "json.nl": "map",
                "rows": 20,
                "start": (req.params.pageNumber - 1) * 20 || 0,
            }
        }


        let [solrErr2, articles] = await utils.resolver(axios.post('http://158.69.25.177:8983/solr/gnowit/select', JSONbody));

        if (solrErr2)
            return res.status(406).status({ message: "Can not get data from SOLR" });

        res.send(articles.data.grouped.simhash)

    } catch (err) {
        return res.status(406).status({ message: "Can not get data from SOLR" });
    }

}