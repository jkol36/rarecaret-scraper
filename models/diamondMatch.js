import mongoose from 'mongoose'

const cheapestForIdex = mongoose.Schema({
  idexDiamondId: String
})

export default mongoose.model('cheapestForIdex', cheapestForIdexSchema)