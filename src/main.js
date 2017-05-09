const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const os = require('os')
const fs = require('fs')
const path = require('path')

const router = new express.Router()
app.use(router)

// Index route.
router.get('/', (req, res) => {
    res.send('See /v1/collections')
})

// Expose collections as a resource.
router.get('/v1/collections', (req, res) =>
    getCollections()
        .then(collections => {
            res.json({collections})
        })
        .catch(err => {
            throw err
        })
)
router.get('/v1/collections/:collection', async (req, res) => {
    const collection = req.params.collection
    if (!await isValidCollection(collection)) {
        return res.status(404).json({error: "No such collection!"})
    }

    const term = await randomTermFromCollection(collection)
    res.json({collection, term})
})

// For now don't bother performing any healthchecks.
router.get('/__health', (req, res) => res.json({version: 1, ok: true, status: 'OK'}))

const dataDirectory = './data/'
const extension = '.txt'
const extensionRegex = /.txt$/i

// Get all collections of data.
const getCollections = _ => new Promise((resolve, reject) => {
    // As readdir operation is asynch, wrap in a promise. Reject on read error.
    fs.readdir(dataDirectory, (err, files) => err ? reject(err) :
        resolve(files
            // Before resolving, strip out non-.txt-files and remove extension.
            .filter(fileName => extensionRegex.test(fileName))
            .map(fileName => fileName.replace(extensionRegex, ''))
        )
    )
})

// Determine if a collection of data is valid.
// Check it's in the initial list, and also check the file exists.
const isValidCollection = async collection => await getCollections()
    .then(files => files.includes(collection))
    .then(included => new Promise((resolve, reject) => {
        const noSuchFile = new Error('No such collection!')
        if (included !== true) reject(noSuchFile)
        fs.exists(path.join(dataDirectory, `${collection}${extension}`), exists => {
            exists ? resolve(exists) : reject(noSuchFile)
        })
    }))
    .catch(console.error)

// Reads a collection by name.  Does not check if the collection exists first!
// Will buffer the entire thing into RAM, so potential bottleneck.
// Todo: use a file stream or linereader!
const readCollection = collection => new Promise((resolve, reject) => {
    const path = `${dataDirectory}/${collection}${extension}`
    fs.readFile(path, (err, fileContents) => {
        if (err) reject(err)

        // HACK: Assume CRLF, convert to OS native (usually LF) before splitting.
        resolve(fileContents.toString().replace(/\r\n/g, os.EOL).split(os.EOL))
    })
})

// Given a collection name, returns a random item from it.
const randomTermFromCollection = async collection => await readCollection(collection)
    .then(contents => contents[~~(Math.random()*contents.length)])
    .catch(console.error)


const listener = app.listen(process.env.PORT || 3000, err => {
    if (err) throw err
    const {address,port} = listener.address()
    console.log(`Serving on ${address} ${port}.`)
})
