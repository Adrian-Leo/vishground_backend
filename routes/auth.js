import { Router } from 'express'
import passport from '../auth/passport.js'
import logger from '../tools/logging.js'
import client from '../db/db.js'
import argon2 from 'argon2'

const router = Router()
const { SERVER_BASE_URL } = process.env
const baseUrl = `${SERVER_BASE_URL}auth`

router.get('/', (req, res) => {
  if (req.user) {
    res.send(`Welcome ${req.user.username}`)
  } else {
    res.send('Need to login first')
  }
})

router.post('/signup', async (req, res) => {
  const { username, email, fullname, pass } = req.body

  try {
    const hashedPassword = await argon2.hash(pass)
    const newUser = {
      username,
      email,
      fullname,
      pass: hashedPassword
    }
    const query =
      'INSERT INTO users (username, email, fullname, pass) VALUES ($1, $2, $3, $4)'
    const values = [
      newUser.username,
      newUser.email,
      newUser.fullname,
      newUser.pass
    ]

    await client.query(query, values)

    res.status(200).json({
      success: true,
      message: 'User registered successfully'
    })
  } catch (error) {
    console.error('Error during signup:', error)
    res.status(500).json({
      success: false,
      message: 'Error during user registration'
    })
  }
})

router.post('/login', async (req, res) => {
  const { username, pass } = req.body
  console.log(req.body)
  try {
    const query = 'SELECT * FROM users WHERE username = $1 OR email = $1'
    const result = await client.query(query, [username])

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    const user = result.rows[0]
    const passwordMatch = await argon2.verify(user.pass, pass)

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: 'Incorrect pass'
      })
      return
    }

    // req.login(user, err => {
    //   if (err) {
    //     res.status(500).json({
    //       success: false,
    //       message: 'Authentication error'
    //     })
    //     return
    //   }

    //   res.status(200).json({
    //     success: true,
    //     message: 'Login successful',
    //     user: {
    //       id: user.id,
    //       username: user.username
    //     }
    //   })
    // })
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username
      }
    })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({
      success: false,
      message: 'Error during login'
    })
  }
})

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: true
  }),
  (req, res) => {
    if (req.user) {
      res.redirect(baseUrl + '/login/success')
    } else {
      res.redirect(baseUrl + '/login/fail')
    }
  }
)

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: `Welcome ${req.user.display_name}!`,
      id: req.user.google_id
    })
  } else {
    res.status(401).json({
      success: false,
      message: 'User has not been authenticated'
    })
  }
})

router.get('/login/failed', (req, res) => {
  const message = req.query.message || 'Login failed'
  res.status(400).json({
    success: false,
    message: message
  })
})

router.get('/logout', (req, res) => {
  // req.logout(err => {
  //   if (err) {
  //     res.status(500).send(err)
  //   } else {
  //     req.session.destroy()
  //     logger.info('User logged out')
  //     res.status(200).json({
  //       success: true,
  //       message: 'User logged out'
  //     })
  //   }
  // })
  res.status(200).json({
    success: true,
    message: 'User logged out'
  })
})

export default router
