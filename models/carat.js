import mongoose from 'mongoose'
import { defaultCarat } from '../config'

const caretSchema = mongoose.Schema({
  id: Number,
  carat: Number
})

caretSchema.statics.getMain = function() {
  return this.findOne({id:1})
          .then(res => {
            if(!!res) {
              return res
            }
            return this.create({id:1, carat:defaultCarat}).then(this.save)
          })
}

caretSchema.statics.increment = function(newVal) {
  return this.findOne({id:1})
          .then(res => this.update({id:1, carat:res.carat+newVal}))
          .then(this.save)
          .then(() => this.findOne({id:1}))
          .then(res => res)
}

export default mongoose.model('caret', caretSchema)