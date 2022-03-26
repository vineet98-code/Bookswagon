var mongoose = require('mongoose');
var User = require('./User');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    name:   { type: String, require: true },
    description : {type: String,  required: true},
    writer : {type: String,  required: true},

    author: { type: String, required: true },
    tagList: [{type: String}],
    price : {type: Number, required: true},
    image: {type: String},
    available: {type: Boolean},

}, { timestamps: true }
);

bookSchema.plugin(uniqueValidator, { message: 'is already taken' });

bookSchema.methods.toJSONFor = function(user) {
  return {
      id: this._id,
      name: this.name,
      description: this.description,
      price: this.price,
      image: this.image,
      tagList: this.tagList,
      available: this.available,
      // author: this.author,
      writer: this.writer
    
  };
};

module.exports = mongoose.model('Book', bookSchema);