const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
     user:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'user'
     },
     address:{
         type:String,
     
     },
     phone:{
         type:Number,
     },
     about:{
         type:String,
     },
     profileImage:{
         type:String,
     },
     date:{
         type:Date,
         default:Date.now
     }


});

module.exports = Profile = mongoose.model('profile',profileSchema);