const mongoose = require('mongoose')
const mongoURI = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"

const connectToMongoose = () => {
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to MongoDB successfully ")
    })
}

module.exports = connectToMongoose;