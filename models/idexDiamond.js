import mongoose from 'mongoose'

const idexSchema = mongoose.Schema({
  Carat: Number

}, {strict:false})
export default mongoose.model('idexDiamond', idexSchema)