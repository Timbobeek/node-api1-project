
const express = require('express')
const User = require('./users/model')

const server = express()
server.use(express.json())

////POST////------------------------------

server.post('/api/users', (req, res) => {
  const user = req.body;
  if(!user.name || !user.bio) {
    res.status(400).json({
      message: "Please provide name and bio for the user"
    })
  } else {
    User.insert(user)
      .then(newUser => {
        res.status(201).json(newUser)
      })
      .catch(err => {
        res.status(500).json({
          message: "There was an error while saving the user to the database",
          error: err.message
        })
      })
  }
})

////GET////------------------------------

server.get('/api/users', (req, res) => {
  User.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      res.status(500).json({
        message: "The users information could not be retrieved",
        error: err.message
      })
    })
})

server.get('/api/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
          res.status(404).json({
            message: "The user with the specified ID does not exist"
          })
        }
        res.json(user)
    })
    .catch(err => {
      res.status(500).json({
        message: "The user information could not be retrieved",
        error: err.message
      })
    })
})

////DELETE////------------------------------

server.delete('/api/users/:id', async (req, res) => {
  try {
    const potentialUser = await User.findById(req.params.id)
    if (!potentialUser) {
      res.status(404).json({
        message: "The user with the specified ID does not exist"
      })
    } else {
      const deletedUser = await User.remove(potentialUser.id)
      res.status(200).json(deletedUser)
    }
  } catch (err) {
    res.status(500).json({
      message: "The user could not be removed",
      error: err.message
    })
  }
})

////PUT////------------------------------

server.put('/api/users/:id', async (req, res) =>{
  try {
    const possibleUser = await User.findById(req.params.id)
    if (!possibleUser) {
      res.status(404).json({
        message: "The user with the specified ID does not exist"
      })
    } else {
      if (!req.body.name || !req.body.bio){
        res.status(400).json({
          message: "Please provide name and bio for the user"
        })
      } else {
        const modifiedUser = await User.update(req.params.id, req.body)
        res.status(200).json(modifiedUser)
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "The user information could not be modified"
    })
  }
})

server.use('*', (req, res)=>{
  res.status(404).json({
    message: 'not found'
  })
})

module.exports = server; 

