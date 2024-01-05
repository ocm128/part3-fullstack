/* 
   Add a name and number to database:
   <node mongo.js password "name surname" 01-7797977> 

   If the password is the only parameter given to the program:
   <node mongo.js password>
   the program should display all the entries in the phonebook.
*/

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack113:${password}@cluster0.g3idkwl.mongodb.net/person-bd?retryWrites=true&w=majority`
// `mongodb+srv://fullstack:<password>@cluster0.g3idkwl.mongodb.net/<dbname>?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length > 3){
  const person = new Person({
    name: name,
    number: number
  })
  person.save().then(result => {
    console.log(`Added ${name} with number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    console.log("Phonebook:")
    result.forEach(person => {
      console.log(person.name, person.number)
    });
    mongoose.connection.close()
  })
}
