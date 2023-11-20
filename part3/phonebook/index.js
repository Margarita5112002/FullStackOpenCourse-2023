const { response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
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
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} persons</p>
    <br/>
    <p>${date.toDateString()} ${date.toTimeString()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id == id)
    if (person) {
        response.json(person)
    } else {
        response.statusMessage = `Can't find person with id ${id}`
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id != id)
    response.status(204).end()
})

const getNewId = () => {
    let newId = 1
    do {
        newId = Math.floor(Math.random() * (100_000_000 - 1) + 1);
    } while (persons.find(p => p.id == newId))
    return newId
}

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        return response.status(400).json({
            error: "name missing"
        })
    }

    if (!person.number) {
        return response.status(400).json({
            error: "number missing"
        })
    }

    person.id = getNewId()
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})