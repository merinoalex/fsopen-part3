const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://alexmerino:${password}@cluster0.37aeidr.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    mongoose
        .connect(url)
        .then(console.log('Connected to MongoDB!'))
        .then(
            Person
                .find({})
                .then(result => {
                    console.log('Phonebook:')
                    result.forEach(person => {
                        console.log(`${person.name} ${person.number}`)
                    })
                    mongoose.connection.close() // execute after callback function is done
                })
        )
} else if (process.argv.length === 5) {
    mongoose
        .connect(url)
        .then(() => {
            console.log('Connected to MongoDB!')

            const person = new Person({
                name: name,
                number: number,
            })

            return person.save()
        })
        .then((result) => {
            console.log(`added '${result.name}', number '${result.number}' to phonebook`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
} else if (process.argv.length === 4) {
    console.log('Please provide a number argument')
    process.exit(1)
}
