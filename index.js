const express = require('express') // const express is a function
const app = express()
const morgan = require('morgan')

const baseUrl = 'http://localhost:3001/api/persons'
const cors = require('cors')
app.use(cors())

app.use(express.json())
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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {

  /*The string must be converted to number in order
    to be able to compare it with the persons ids.*/
  const id = Number(request.params.id) 
  const person = persons.find(person => person.id === id)
  if(person){ //if isn't undefined
    response.json(person)
  } else{
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const date = new Date(Date.now())
  response.send(`Phonebook has info fo ${persons.length} people. <p> ${date} </p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  // filter return one array with a more items
  persons = persons.filter(person => person.id != id) 
  response.status(204).end()
})

const generatedId = () => {
  let id = Math.floor(Math.random() * 1000)
  return id
}

app.post('/api/persons', (request, response) => {
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
