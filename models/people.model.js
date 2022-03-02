const mongoose = require('mongoose');

const PeopleSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    }
})


const People = mongoose.model('People',PeopleSchema);

module.exports = People;
