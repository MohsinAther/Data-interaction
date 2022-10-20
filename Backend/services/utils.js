'use strict'

const resolver = promise => {
    return promise.then(data => [null, data]).
        catch(err => {
            console.error(`Error in resolving promise `, JSON.stringify(err))
            return [err, null]
        })
}

const sleep = ms => new Promise(res => setTimeout(res, ms))

module.exports = {
    resolver: resolver,
    sleep: sleep
}