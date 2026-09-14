require('dotenv').config()
const express = require('express')
const session = require('express-session')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(session({
  secret: process.env.SESSION_SECRET || 'allyalways-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}))

const redirectFactory = require('./routes/redirect')
const PREFIXES = ['redirect', 'shop', 'dir', 'link', 'sol']
PREFIXES.forEach(p => app.use(`/${p}`, redirectFactory(prisma, p)))

app.use('/admin', require('./routes/admin')(prisma))

app.get('/', (req, res) => {
  res.redirect('/admin')
})

app.listen(PORT, () => {
  console.log(`AllyAlways running on port ${PORT}`)
})
