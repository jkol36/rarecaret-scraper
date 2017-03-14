import { expect } from 'chai'
import {
  postUserQuery,
  fetchResultsForQuery
} from './helpers'
import {
  isValid
} from './utils'
import {store} from './store'
import {diamondsAddedRareCaret} from './actionCreators'
require('./config')

const {dispatch, getState} = store




describe('store', () => {
  it('should add rare caret diamonds to store', done => {
    dispatch(diamondsAddedRareCaret([1,2,3]))
    .then(() => {
      console.log(getState())
    })
  })
})
describe('rare carat scraper', () => {
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
  const idexDiamondMakeGood = {  
     "Item ID #":"82801260",
     "Supplier Stock Ref":"124/001",
     "Cut":"Round",
     "Carat":"0.4",
     "Color":"L",
     "Natural Fancy Color":"",
     "Natural Fancy Color Intensity":"",
     "Natural Fancy Color Overtone":"",
     "Treated Color":"",
     "Clarity":"SI2",
     "Make (Cut Grade)":"Good",
     "Grading Lab":"GIA",
     "Certificate Number":"2141358666",
     "Certificate Path":"http://DiamondTransactions.net/icp?di=82801260",
     "Image Path":"",
     "Online Report":"",
     "Price Per Carat":"744",
     "Total Price":"297.60",
     "Polish":"Very Good",
     "Symmetry":"Very Good",
     "Measurements (LengthxWidthxHeight)":"4.52x4.59x2.95",
     "Depth":"",
     "Table":"61",
     "Crown Height":"",
     "Pavilion Depth":"",
     "Girdle (From / To)":"",
     "Culet Size":"",
     "Culet Condition":"",
     "Graining":"",
     "Fluorescence Intensity":"None",
     "Fluorescence Color":"",
     "Enhancement":"",
     "Supplier":"B.G.EL Europe bvba",
     "Country":"Belgium",
     "State / Region":"",
     "Remarks":"",
     "Phone":"32-3-2253055",
     "Pair Stock Ref.":"",
     "Email":"samy@bgel-europe.com"
  }
  const idexDiamondMakeExcellent = {  
   "Item ID #":"82801260",
   "Supplier Stock Ref":"124/001",
   "Cut":"Round",
   "Carat":"0.4",
   "Color":"H",
   "Natural Fancy Color":"",
   "Natural Fancy Color Intensity":"",
   "Natural Fancy Color Overtone":"",
   "Treated Color":"",
   "Clarity":"SI2",
   "Make (Cut Grade)":"Excellent",
   "Grading Lab":"GIA",
   "Certificate Number":"2141358666",
   "Certificate Path":"http://DiamondTransactions.net/icp?di=82801260",
   "Image Path":"",
   "Online Report":"",
   "Price Per Carat":"744",
   "Total Price":"297.60",
   "Polish":"Very Good",
   "Symmetry":"Very Good",
   "Measurements (LengthxWidthxHeight)":"4.52x4.59x2.95",
   "Depth":"",
   "Table":"61",
   "Crown Height":"",
   "Pavilion Depth":"",
   "Girdle (From / To)":"",
   "Culet Size":"",
   "Culet Condition":"",
   "Graining":"",
   "Fluorescence Intensity":"None",
   "Fluorescence Color":"",
   "Enhancement":"",
   "Supplier":"B.G.EL Europe bvba",
   "Country":"Belgium",
   "State / Region":"",
   "Remarks":"",
   "Phone":"32-3-2253055",
   "Pair Stock Ref.":"",
   "Email":"samy@bgel-europe.com"
  }
  const idexDiamondMakeVeryGood = {  
   "Item ID #":"82801260",
   "Supplier Stock Ref":"124/001",
   "Cut":"Round",
   "Carat":"0.4",
   "Color":"L",
   "Natural Fancy Color":"",
   "Natural Fancy Color Intensity":"",
   "Natural Fancy Color Overtone":"",
   "Treated Color":"",
   "Clarity":"SI2",
   "Make (Cut Grade)":"Very Good",
   "Grading Lab":"GIA",
   "Certificate Number":"2141358666",
   "Certificate Path":"http://DiamondTransactions.net/icp?di=82801260",
   "Image Path":"",
   "Online Report":"",
   "Price Per Carat":"744",
   "Total Price":"297.60",
   "Polish":"Very Good",
   "Symmetry":"Very Good",
   "Measurements (LengthxWidthxHeight)":"4.52x4.59x2.95",
   "Depth":"",
   "Table":"61",
   "Crown Height":"",
   "Pavilion Depth":"",
   "Girdle (From / To)":"",
   "Culet Size":"",
   "Culet Condition":"",
   "Graining":"",
   "Fluorescence Intensity":"None",
   "Fluorescence Color":"",
   "Enhancement":"",
   "Supplier":"B.G.EL Europe bvba",
   "Country":"Belgium",
   "State / Region":"",
   "Remarks":"",
   "Phone":"32-3-2253055",
   "Pair Stock Ref.":"",
   "Email":"samy@bgel-europe.com"
  }
  it('should spit out rare caret cut for idex make good', done => {
    let res = makeLookup[idexDiamondMakeGood['Make (Cut Grade)']]
    expect(res).to.be.a('object')
    expect(res.Min).to.eq(1)
    expect(res.Max).to.eq(2)
    done()
  })
  it('should return whether an idex diamond can be looked up on rarecaret', done => {
    let try1 = isValid(idexDiamondMakeGood)
    console.log(try1)
    expect(try1).to.be.false
    let try2 = isValid(idexDiamondMakeExcellent)
    expect(try2).to.be.true
    done()
  })
  it('should spit out rare caret cut for idex make very good', done => {
    let res = makeLookup[idexDiamondMakeVeryGood['Make (Cut Grade)']]
    expect(res).to.be.a('object')
    expect(res.Min).to.eq(2)
    expect(res.Max).to.eq(3)
    done()
  })
  it('should spit out rare caret cut for idex make excellent', done => {
    let res = makeLookup[idexDiamondMakeExcellent['Make (Cut Grade)']]
    expect(res).to.be.a('object')
    expect(res.Min).to.eq(3)
    expect(res.Max).to.eq(4)
    done()
  })
  it('should spit out rare caret clarity that matches idex clarity', done => {
    let res = clarityLookup[idexDiamondMakeExcellent['Clarity']]
    expect(res).to.be.a('object')
    expect(res.Min).to.eq(0)
    expect(res.Max).to.eq(1)
    done()
  })
  it('should spit out rare caret flour property for idex diamond', done => {
    let res = fluorescenceLookup[idexDiamondMakeExcellent['Fluorescence Intensity']]
    expect(res).to.be.an('object')
    expect(res.Min).to.eq(0)
    expect(res.Max).to.eq(1)
    done()
  })
  it('should spit rare caret color property for idex diamond', done => {
    let res = colorLookup[idexDiamondMakeExcellent.Color]
    console.log(res)
    done()
  })
  it('should spit out polish range for idex diamond', done => {
    let res = polishLookup[idexDiamondMakeExcellent.Polish]
    expect(res.Min).to.eq(2)
    expect(res.Max).to.eq(3)
    done()
  })
  it('should spit out Symmetry range for idex diamond', done => {
    let res = symmetryLookup[idexDiamondMakeExcellent.Symmetry]
    expect(res.Min).to.eq(2)
    expect(res.Max).to.eq(3)
    done()
  })
  it('should build specific filter for idex diamond', done => {
    const buildFilter = (idexDiamond) => {
      let newFilter = Object.assign({}, filters, {
        Fluor: fluorescenceLookup[idexDiamond['Fluorescence Intensity']],
        Clarities: clarityLookup[idexDiamond.Clarity],
        'Cuts': makeLookup[idexDiamond['Make (Cut Grade)']],
        'Colors': colorLookup[idexDiamond.Color],
        Tables: {
          Min:idexDiamond.Table,
          Max:idexDiamond.Table
        },
        Depths: {
          Min: idexDiamond.Depth === '' ? 0: idexDiamond.Depth,
          Max:idexDiamond.Depth === '' ? 100: idexDiamond.Depth
        },
        Symmetry: symmetryLookup[idexDiamond.Symmetry]
      })
      return newFilter
    }
    let newFilter = buildFilter(idexDiamondMakeExcellent)
    console.log(newFilter)
    done()
  })
})