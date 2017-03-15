import mongoose from 'mongoose'

const diamondMatchSchema = mongoose.Schema({
  rareCaretDiamondUID: String,
  idexDiamondId: String
})

export default mongoose.model('diamondMatches', diamondMatchSchema)