import csv from 'ya-csv'
const headersForCsv = ['idex diamond item id', 'theoreticalCount', 'site', 'trueCount']
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
export const openIdexJsonFile = () => {
  return new Promise(resolve => {
    resolve(require('./idex.json'))
  })
}

export const writeResultsToCsv = (results) => {
  return new Promise(resolve => {
    let writer = csv.createCsvFileWriter('stats.csv', {'flags': 'a'});
    writer.writeRecord(results)
    resolve()
  })
}
export const writeHeadersToCsv = () => {
  let writer = csv.createCsvFileWriter('stats.csv', {'flags': 'a'});
  writer.writeRecord(headersForCsv)
  return Promise.resolve()
}
export const buildFilter = (idexDiamond) => {
  return Object.assign({}, filters, {
    Fluor: fluorescenceLookup[idexDiamond['Fluorescence Intensity']],
    Clarities: clarityLookup[idexDiamond.Clarity],
    'Cuts': makeLookup[idexDiamond['Make (Cut Grade)']],
    'Colors': colorLookup[idexDiamond.Color],
    Tables: {
      Min:+idexDiamond.Table,
      Max:+idexDiamond.Table
    },
    Polish: polishLookup[idexDiamond.Polish],
    Depths: {
      Min: idexDiamond.Depth === '' ? 0: Math.round(+idexDiamond.Depth),
      Max:idexDiamond.Depth === '' ? 100: Math.round(+idexDiamond.Depth)
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
