const _ = require('lodash')
const axios  = require('axios')


const callAPI = async (methodType, url, queryParams = '', requestBody = {}, uniqueValue = true, headers = {}) => {
  const options = {
      method: methodType,
      url: url + queryParams,
      headers: headers,
      data: requestBody
    }
    try {
      const result = await axios(options)
      return result
    } catch (err) {
      console.log(`!!!! error connecting/fetching data from external API call ... `)
    }
  }
module.exports = {
    callAPI
 }
