const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  Firstname: {
    required: true,
    type: String,
  },
  Lastname: {
    required: true,
    type: String,
  },
  Email: {
    required: true,
    type: String,
  },
  hashedPassword: {
    required: true,
    type: String,
  },
  Location: String,
});



const skillSchema = mongoose.Schema({
  SKillName: {
    required: true,
    type:String,
  },
  UserId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  
})


const educationSchema = mongoose.Schema({
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  School: {
    required: true,
    type: String,
  },
  Degree: {
    required: true,
    type: String,
  },
  StartDate: {
    required: true,
    type: Date,
  },
  
  EndDate: {
    required: true,
    type: Date,
  },
  
  Skills: {
    required: true,
    type:[skillSchema],
  },
  Location: String,
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

module.exports = mongoose.model("User", userSchema);
