import agent from 'superagent-bluebird-promise'

const headers = {
    'origin': 'https://www.rarecarat.com',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.8,sv;q=0.6',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
    'content-type': 'application/json;charset=UTF-8',
    'accept': 'application/json, text/plain, */*',
    'referer': 'https://www.rarecarat.com/0015961a-5fda-417d-ad05-9ae14cab7a19',
    'authority': 'www.rarecarat.com',
    'cookie': '__cfduid=dca43eba9e8043f0d80c57ca007008a9b1487951584; _ga=GA1.2.80667734.1487951588; G_ENABLED_IDPS=google; _hjIncludedInSample=1; intercom-id-pv5h34y3=ddc51a74-0dba-403f-a02a-dbcf14da30e4; _hp2_id.528151546=%7B%22userId%22%3A%222101328009977755%22%2C%22pageviewId%22%3A%224234254373627152%22%2C%22sessionId%22%3A%223184431706004176%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%223.0%22%7D'
}

const data = {
  "Index":0,
  "PageSize":50,
  "Sorting":"Price",
  "Order":"asc",
  "Shapes":"CU,AS,RA,HS,OV,PR,EC,MQ,PS,RD",
  "Price":{
    "Min":250,
    "Max":2000000
  },
  "Cuts":{
    "Min":1,
    "Max":4
  },
  "Clarities":{
    "Min":0,
    "Max":8
  },
  "Carats":{
    "Min":0.15,
    "Max":15
  },
  "Colors":{
    "Min":0,
    "Max":8
  },
  "Certificate":{
    "Certi":"4"
  },
  "Fluor":{
    "Min":0,
    "Max":5
  },
  "Tables":{
    "Min":0,
    "Max":100
  },
  "Depths":{
    "Min":0,
    "Max":100
  },
  "Polish":{
    "Min":1,
    "Max":4
  },
  "Symmetry":{
    "Min":1,
    "Max":4
  },
  "LWratio":{
    "Min":0.5,
    "Max":2.75
  },
  "RequestNumber":1
}
export const postUserQuery = (caret=0.15) => {
  let filters = Object.assign({}, data, {Carat: {Min:caret}})
  return agent
          .post('https://www.rarecarat.com/Home/PostUserQuery')
          .set(headers)
          .send(data)
          .then(res => res.body.Data)
          .catch(err => err)
}

export const fetchResultsForQuery = (key) => {
  const urls = [
    `https://www.rarecarat.com/Home/GetYadav/${key}`,
    `https://www.rarecarat.com/Home/GetAllurez/${key}`,
    `https://www.rarecarat.com/Home/GetIDJewelry/${key}`,
    `https://www.rarecarat.com/Home/GetBrianGavin/${key}`,
    `https://www.rarecarat.com/Home/GetSolomonBrothers/${key}`,
    `https://www.rarecarat.com/Home/GetDiamondsDirect/${key}`,
    `https://www.rarecarat.com/Home/GetTaylorHart/${key}`,
    `https://www.rarecarat.com/Home/GetBrilliantlyEngaged/${key}`,
    `https://www.rarecarat.com/Home/GetWhiteflash/${key}`,
    `https://www.rarecarat.com/Home/GetZales/${key}`,
    `https://www.rarecarat.com/Home/GetRitani/${key}`,
    `https://www.rarecarat.com/Home/GetJamesAllen/${key}`,
    `https://www.rarecarat.com/Home/GetKay/${key}`,
    `https://www.rarecarat.com/Home/GetZoara/${key}`,
    `https://www.rarecarat.com/Home/GetCostco/${key}`,
    `https://www.rarecarat.com/Home/GetBlueNile/${key}`,
    `https://www.rarecarat.com/Home/GetHPDiamonds/${key}`,
    `https://www.rarecarat.com/Home/GetJared/${key}`,
    `https://www.rarecarat.com/Home/GetUnionDiamond/${key}`,
    `https://www.rarecarat.com/Home/GetWonderJewelers/${key}`
  ]
  let promises = Promise.map(urls, url => {
    return agent
            .post(url)
            .set(headers)
            .then(res => {
              return {...res.body, url}
            })
            .catch(err => err)
  })
  return Promise.all(promises)
}
export const getAllDiamondsFromRareCaret = () => {
  return postUserQuery()
          .then(fetchResultsForQuery)
          .then(results => {
            console.log('fetched diamonds from rare caret')
            console.log(results.length)
            return results
          })
          .catch(err => err)
}
  