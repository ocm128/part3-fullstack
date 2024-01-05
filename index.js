/******** BACKEND index.js *******/

require('dotenv').config()
const express = require('express') // const express is a function
const app = express()
const morgan = require('morgan')

const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

//app.use(morgan('tiny'))

morgan.token('type', function(req, res) {
  console.log(res)
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :type'))

let persons = [
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  },
  {
    "name": "Arto Hellas",
    "number": "333333344",
    "id": 5
  },
  {
    "name": "John Doe",
    "number": "2222344",
    "id": 6
  }
]


// Exercise 3.13
app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    //console.log('get /api/persons', result)
    response.json(result.map(person => person.toJSON()))
  })
})


// Get person by id (exercise 3.18)
app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id)
    .then(person => {
			if (person) { // if isn't undefined
				response.json(person)
			} else {
				response.status(404).end()
			}
    })
    .catch(error => {
      //response.status(400).send({error: 'malformatted id'})
      next(error)
    })
})
 

app.get('/info', (request, response) => {
  const date = new Date(Date.now())
  response.send(`Phonebook has info fo ${Person.length} people. <p> ${date} </p>`)
})


/* app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  // filter return one array with a more items
  persons = persons.filter(person => person.id != id) 
  response.status(204).end()
})
*/

// Delete person (exercise 3.15)
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  console.log(id, typeof (id))

  Person
    .findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

/* const generatedId = () => {
  let id = Math.floor(Math.random() * 1000)
  return id
} */

// Create person
/* app.post('/api/persons', (request, response) => {
  const body = request.body
  //console.log(body)

  if (!body.name || !body.number) {
		return response.status(400).json({
			error: "Missing name or number"
		})
	}
  const nameExist = persons.find(person => person.name === body.name)
  console.log(nameExist)
  if(nameExist){ // if isn't undefined
    return response.status(400).json({
      error: "Name must be unique"
    })
  }
  let personObj = {
    name: body.name,
    number: body.number,
    id: generatedId()
  }
  persons.concat(personObj)
  response.json(personObj)
})
 */

// Create person (13.3 exercise)
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
		return response.status(400).json({
			error: "Missing name or number"
		})
	} 
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// Update number from person in the database (exercise 3.17)
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


// Handle errors (exercise 3.16)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
