import mongoose from 'mongoose'

const countSchema = mongoose.Schema({
  id: Number,
  count: Number
})

countSchema.statics.getMain = function() {
  return this.findOne({id:1})
          .then(res => {
            if(!!res) {
              return res
            }
            return this.create({id:1, count:0}).then(this.save)
          })
}

countSchema.statics.increment = function() {
  return this.getMain()
          .then(res => this.update({id:1, count: res.count+1}))
          .then(this.save)
          .then(() => this.findOne({id:1}))
          .then(res => res)
}

export default mongoose.model('count', countSchema)