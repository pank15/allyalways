const express = require('express')

module.exports = function (prisma) {
  const router = express.Router()

  router.get('/', async (req, res) => {
    const links = await prisma.link.findMany({
      where: { prefix: 'contact', active: true },
      orderBy: { createdAt: 'asc' }
    })
    res.render('contact', { links })
  })

  return router
}
