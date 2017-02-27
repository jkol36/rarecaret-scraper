import mongoose from 'mongoose'

const rareCaretDiamondSchema = mongoose.Schema({
  Carat: Number,
  Cert: String,
  Clarity: String,
  ClarityOrder: Number,
  Color: String,
  Culet: String,
  Cut: String,
  CutOrder: Number,
  Depth: Number,
  DetailsUrl: String,
  Fluorescence: String,
  ItemNumber: String,
  LWRatio: Number,
  Measurement: String,
  Pinned: Boolean,
  Polish: String,
  Price: Number,
  PricePerCarat: Number,
  Shape: String,
  Symmetry: String,
  Table: Number,
  UID: String,
  WebCode: Number,
  Website: String
})

export default mongoose.model('rareCaretDiamond', rareCaretDiamondSchema)