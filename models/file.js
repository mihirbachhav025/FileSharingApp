const mongooose = require("mongoose");

const Schema = mongooose.Schema;

const fileSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size:{
    type:Number,
    required:true
  },
  uuid:{
    type:String,
    required:true
  },
  sender:{
    type:String
  },
  receiver:{
    type:String
  }
},{
    timestamps:true
});

const file = mongooose.model('file',fileSchema);
module.exports = file;