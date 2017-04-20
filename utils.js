import csv from 'ya-csv'
import csv2json from 'csv2json'
import fs from 'fs'
Promise.promisifyAll(fs)

const allowableColors = ['K', 'J', 'I', 'H', 'G', 'F', 'E', 'D']
const symmetryLookup = {
    'Good': {
      Min: 1,
      Max: 2
    },
    'Very Good': {
      Min: 2,
      Max: 3
    },
    'Excellent': {
      Min:3,
      Max:4
    }
  }
  const polishLookup = {
    'Good': {
      Min: 1,
      Max: 2
    },
    'Very Good': {
      Min: 2,
      Max: 3
    },
    'Excellent': {
      Min:3,
      Max:4
    }
  }
  const makeLookup = {
    'Good': {
      Min: 1,
      Max: 2
    },
    'Very Good': {
      Min: 2,
      Max: 3
    },
    'Excellent': {
      Min:3,
      Max:4
    }
  }
  const clarityLookup = {
    'SI2': {
      Min: 0,
      Max: 1
    },
    'SI1': {
      Min: 1,
      Max: 2
    },
    'VS2': {
      Min:2,
      Max:3
    },
    'VS1': {
      Min:3,
      Max:4
    },
    'VVS2': {
      Min:4,
      Max:5
    },
    'VVS1': {
      Min:5,
      Max:6
    },
    'IF': {
      Min:6,
      Max:7
    },
    'FL': {
      Min:7,
      Max:8
    }
  }
  const fluorescenceLookup = {
    'None': {
      Max:1,
      Min:0
    },
    'Faint': {
      Min:1,
      Max: 2
    },
    "Medium": {
      Min:2,
      Max: 3 
    },
    'Strong': {
      Min:3,
      Max:4
    },
    'Very Strong': {
      Min:4,
      Max:5
    }
  }
  const colorLookup = {
    "K": {
      Min: 0,
      Max: 1
    },
    "J": {
      Min:1,
      Max:2
    },
    "I": {
      Min:2,
      Max:3
    },
    "H": {
      Min:3,
      Max:4
    },
    "G": {
      Min:4,
      Max:5
    },
    "F": {
      Min:5,
      Max:6
    },
    "E": {
      Min:6,
      Max:7
    }, 
    "D": {
      Min:7,
      Max:8
    }
  }
  const filters = {
    "Index":0,
    "PageSize":50,
    "Sorting":"Price",
    "Order":"asc",
    "Shapes":"RD",
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
export const openIdexJsonFile = filename => {
  return new Promise(resolve => {
    var jsonFile = require('json-file-plus');
    var path = require('path'); // in node-core
    var f = path.join(process.cwd(), `${filename}.json`);


    jsonFile(f, function (err, file) {
      console.log(err)
      return resolve(file.data)
    });

  })
}

export const getUniqueIdexDiamonds = array => {
  let idexLookup = {}
  let unique = []
  const findSimilar = item => {
    return Object.keys(item).map(k => {
      return array.filter(obj => obj[k] === obj[item[k]])
    })

  }
  array.forEach(item => {

    let idNum = item['Item ID #']
    if(idexLookup[idNum] === undefined) {
      idexLookup[idNum] = true
      unique.push(item)
    }
  })
  return unique

}

export const convertCsvToJson = filename => {
  fs.createReadStream(`${filename}.csv`)
  .pipe(csv2json({
    // Defaults to comma. 
    separator: ','
  }))
  .pipe(fs.createWriteStream(`${filename}.json`));
}


export const createCsvFileWriter = file => {
  return csv.createCsvFileWriter(`${file}.csv`, {'flags': 'a'})
}
export const writeResultsToCsv = (results, csv) => {
  return new Promise(resolve => {
    csv.writeRecord(results)
    resolve()
  })
}
export const writeHeadersToCsv = (headers, csv) => {
  csv.writeRecord(headers)
  return Promise.resolve(200)
}



export const eliminateDuplicates = arr => {
  var i,
    len=arr.length,
    out=[],
    obj={};

  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

export const removeFile = file => {
  return fs.unlinkAsync(file)
}
export const addFile = file => {
  console.log(typeof file)
  return fs.linkAsync(file)
}
export const fileExists = file => {
  return fs.existsSyncAsync(file)
}
export const buildFilter = (idexDiamond) => {
  return Object.assign({}, filters, {
    Fluor: fluorescenceLookup[idexDiamond['Fluorescence Intensity']],
    Clarities: clarityLookup[idexDiamond.Clarity],
    'Cuts': makeLookup[idexDiamond['Make (Cut Grade)']],
    'Colors': colorLookup[idexDiamond.Color],
    Tables: {
      Min:0,
      Max:100
    },
    Polish: polishLookup[idexDiamond.Polish],
    Depths: {
      Min: 0,
      Max:100
    },
    Carats:{
      Min: +idexDiamond.Carat,
      Max: +idexDiamond.Carat
    },
    Symmetry: symmetryLookup[idexDiamond.Symmetry]
  })
}
export const isValid = (idexDiamond) => {
  return (allowableColors.indexOf(idexDiamond.Color) !== -1)
}