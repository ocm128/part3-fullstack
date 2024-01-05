/******** BACKEND - persons.js  ********/

const mongoose = require('mongoose')
// npm install --save mongoose-unique-validator
var uValidator = require('mongoose-unique-validator');


const url = process.env.MONGODB_URI
console.log('Connecting to', url)

// const url = `mongodb+srv://fullstack113:<password>@cluster0.g3idkwl.mongodb.net/person-bd?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {
      type:String,
      minlength: [6, 'Minimun length is 6'],
      maxLength: [20, 'Maximun length is 20'],
      unique: true,
      required: true
    },
    number: {
      type:String,
      minlength: [9, 'Minimum length is 9'],
      maxLength: [10, 'Maximum length is 10'],
      required: true,
      validate: {
        validator: (value) => /(\d{2,})-(\d{7,})|(\d{3,})-(\d{6,})/.test(value),
        message: props => `${props.value} is not a valid number`
      }
    }
  })

  personSchema.plugin(uValidator)
  
  personSchema.set('toJSON', {
    transform: (document, person) => {
      person.id = person._id.toString()
      delete person._id
      delete person.__v
    }
  })
  

  module.exports = mongoose.model('Person', personSchema)