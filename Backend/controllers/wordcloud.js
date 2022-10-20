const mongoose = require('mongoose'),
    request = require('request'),
    axios = require('axios'),
    moment = require('moment')


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

                "facet.limit": 50,
                "facet.pivot": "topic,sentiment",
                "rows": 0,
                "start": 0
            }
        }


        axios.post('http://158.69.25.177:8983/solr/gnowit/select', query)
            .then(function (response) {
                let data = response.data.facet_counts.facet_pivot['topic,sentiment'];

                let obj = data.map(ele => {
                    let temp = { tag: ele.value, weight: ele.count, fill: "" }
                    pos = ele.pivot && ele.pivot[0] ? ele.pivot[0].count : 0;
                    neut = ele.pivot && ele.pivot[1] ? ele.pivot[1].count : 0;
                    neg = ele.pivot && ele.pivot[2] ? ele.pivot[2].count : 0;
                    temp.fill = neg > pos & neg > neut ? "#CA353C" : pos > neg & pos > neut ? "#8DCB35" : "#CCCC01"
                    delete temp.pivot
                    return temp

                })

                res.json(obj)

            })
            .catch(function (error) {
                return res.status(406).status({ message: "Can not get data from SOLR" });
            })




    } catch (err) {
        return res.status(406).status({ message: "Can not get data from SOLR" });
    }






}