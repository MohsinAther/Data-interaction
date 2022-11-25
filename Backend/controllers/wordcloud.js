const mongoose = require('mongoose'),
    request = require('request'),
    axios = require('axios'),
    moment = require('moment');
const utils = require('../services/utils');


exports.generate_word_cloud = async (req, res) => {
    try {
        var startDate = moment().subtract(360, 'days').toISOString()
        var endDate = moment().toISOString();
        console.log(req.body.query)
        let q = `content: (${req.body.query})`

        let query = {
            "params": {
                "q": q,

                "fq": [
                    `timestamp:[ ${startDate} TO ${endDate}]`
                ],
                "facet": true,
                // "facet.limit": 8,

                "facet.limit": 70,
                "facet.pivot": ["topic,sentiment", "date_string,sentiment"],
                // "facet.pivot": "date_string,sentiment",
                "facet": "true",
                "facet.field": "simhash",
                "facet.simhash.limit": 30,

                // "facet.field": "date_string,sentiment",
                // "facet.pivot.sort": "date_string asc",
                "rows": 0,
                "wt": "json",
                "json.nl": "map",
                "start": 0
            }
        }

        let articles_query = {
            "params": {
                "q": "",

                "fq": [
                    `timestamp:[ ${startDate} TO ${endDate}]`
                ],

                "group": "true",
                "group.field": "simhash",
                "fl": "id,simhash,snippet,url,timestamp,published,blogdesc,blogurl,sentiment,summary,pkg,geo_city,geo_region,geo_country,geo_continent",

                "rows": -1,
                "start": 0
            }
        }

        let [err, response] = await utils.resolver(axios.post('http://158.69.25.177:8983/solr/gnowit/select', query))

        let sim = response.data.facet_counts.facet_fields.simhash;

        for (const [key, value] of Object.entries(sim)) {
            console.log(key, value);
          }
        let ids = [];

        sim = Object.keys(sim)
        for (let i = 0; i < 40; i++) {
            if (sim.length > i)
                ids.push(sim[i])
        }
        let quer = "simhash : (";
        if (ids.length) {
            quer += ids.map(ele => `'${ele}'`).join(" OR ") + ")"
        }

        articles_query.params.q = quer
        let [err2, response2] = await utils.resolver(axios.post('http://158.69.25.177:8983/solr/gnowit/select', articles_query))

        console.log("*****")
        response2.data.grouped.simhash.groups.forEach(element => {
            console.log(element.groupValue, element.doclist.numFound)
        });

        if (err)
            return res.status(406).send({ message: "Can not get data from SOLR" });

        let data = response.data.facet_counts.facet_pivot['topic,sentiment'];
        let sentiment_graph = response.data.facet_counts.facet_pivot['date_string,sentiment']

        let obj = data.map(ele => {
            let temp = { tag: ele.value, weight: ele.count, fill: "" }
            pos = ele.pivot && ele.pivot[0] ? ele.pivot[0].count : 0;
            neut = ele.pivot && ele.pivot[1] ? ele.pivot[1].count : 0;
            neg = ele.pivot && ele.pivot[2] ? ele.pivot[2].count : 0;
            console.log(pos, neut, neg)
            temp.fill = (neg > pos && neg > neut) ? "#CA353C" : (pos > neg && pos > neut) ? "#8DCB35" : "#CCCC01"
            delete temp.pivot
            return temp

        })



        res.json({ wc: obj, sentiment_graph: sentiment_graph })




    } catch (err) {
        return res.status(406).send({ message: "Can not get data from SOLR" });
    }






}