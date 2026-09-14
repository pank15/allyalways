const express = require('express')

module.exports = function (prisma, prefix) {
  const router = express.Router()

  router.get('/:slug', async (req, res) => {
    const { slug } = req.params
    try {
      const link = await prisma.link.findUnique({
        where: { prefix_slug: { prefix, slug } }
      })
      if (!link || !link.active) {
        return res.status(404).render('404', { slug: `${prefix}/${slug}` })
      }
      await prisma.link.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } }
      })
      res.redirect(link.url)
    } catch (err) {
      console.error(err)
      res.status(500).send('Server error')
    }
  })

  return router
}
