const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
const generateToken = require('../utils/jwtHelper')
const router = express.Router()
const bcrypt = require('bcrypt')

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    console.log('Login Request:', req.body)

    if (!username || !password) {
      return res.status(400).send('Username and password are required.')
    }

    const user = await User.findOne({ username })
    if (!user) {
      console.log('User not found')
      return res.status(400).send('Invalid username or password')
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      console.log('Invalid password')
      return res.status(400).send('Invalid username or password')
    }

    console.log('generateToken:', generateToken)

    // Use the generateToken function from jwt.js
    const token = generateToken(user)
    console.log('Generated Token:', token)

    res.send({ token })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).send('Internal server error')
  }
})

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    const existingUser = await User.findOne({ username })

    if (typeof password !== 'string') {
      return res.status(400).send('Password must be a string')
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists.' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
      username,
      password: hashedPassword,
    })

    const savedUser = await user.save()

    res.json({
      message: 'User registered successfully.',
      userId: savedUser._id,
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Internal server error.' })
  }
})

module.exports = router
