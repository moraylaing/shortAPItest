//template for our shortuRL documents
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI); 
 
const schema =  mongoose.Schema;
const urlSchema = new schema  ({
      orig_url: String,
      short_url: String
  }, {timestamps: true });

const ModelClass= mongoose.Model('shortiurl',urlSchema);
module.exports = ModelClass;                        