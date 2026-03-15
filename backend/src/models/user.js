const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 name:{type:String,required: true},
 email:{type:String, required: true,  unique: true},
 password:{type:String,required: true},
  role:{
       type: String,
        enum: ["admin", "doctor", "patient"],
        default: "patient"
  },
   phone: {
        type: String,required: true,
    },
   address: {
   street: { type: String },
   city: { type: String },
   state: { type: String },
   country: { type: String },
   pincode: { type: String }
}
},{
  timestamps:true
});

const User = mongoose.model("User", userSchema);

module.exports = User;