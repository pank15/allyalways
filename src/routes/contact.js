const express = require('express')

module.exports = function (prisma) {
  const router = express.Router()

  const CONTACT_ORDER = ['shopee', 'tiktok', '7eleven', 'seven11', 'line', 'facebook', 'instagram']
  function contactSort(a, b) {
    const rank = s => {
      const sl = s.slug.toLowerCase()
      const i = CONTACT_ORDER.findIndex(k => sl.includes(k))
      return i === -1 ? 999 : i
    }
    return rank(a) - rank(b)
  }

  router.get('/', async (req, res) => {
    const [raw, moreLinks] = await Promise.all([
      prisma.link.findMany({ where: { prefix: 'contact', active: true }, orderBy: { createdAt: 'asc' } }),
      prisma.link.findMany({ where: { prefix: 'more', active: true }, orderBy: { createdAt: 'asc' } })
    ])
    const links = raw.sort(contactSort)
    res.render('contact', { links, moreLinks })
  })

  return router
}
