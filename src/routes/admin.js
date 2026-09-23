const express = require('express')
const bcrypt = require('bcryptjs')
const { requireLogin } = require('../middleware/auth')

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Pank'
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || '123456', 10)
const PREFIXES = ['redirect', 'shop', 'dir', 'link', 'sol', 'contact', 'more']

module.exports = function (prisma) {
  const router = express.Router()

  router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/admin')
    res.render('login', { error: null })
  })

  router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (username === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
      req.session.user = { username }
      return res.redirect('/admin')
    }
    res.render('login', { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
  })

  router.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/admin/login')
  })

  router.get('/', requireLogin, async (req, res) => {
    const links = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } })
    res.render('admin', { links, prefixes: PREFIXES, user: req.session.user, error: null, success: null })
  })

  router.post('/links', requireLogin, async (req, res) => {
    const { prefix, slug, url, label } = req.body
    const safePrefix = PREFIXES.includes(prefix) ? prefix : 'redirect'
    try {
      await prisma.link.create({ data: { prefix: safePrefix, slug, url, label: label || '' } })
      const links = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } })
      res.render('admin', { links, prefixes: PREFIXES, user: req.session.user, error: null, success: `สร้าง /${safePrefix}/${slug} สำเร็จ` })
    } catch (err) {
      const links = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } })
      res.render('admin', { links, prefixes: PREFIXES, user: req.session.user, error: 'Slug นี้มีอยู่แล้วใน prefix นี้', success: null })
    }
  })

  router.post('/links/:id/toggle', requireLogin, async (req, res) => {
    const link = await prisma.link.findUnique({ where: { id: parseInt(req.params.id) } })
    if (link) await prisma.link.update({ where: { id: link.id }, data: { active: !link.active } })
    res.redirect('/admin')
  })

  router.post('/links/:id/delete', requireLogin, async (req, res) => {
    await prisma.link.delete({ where: { id: parseInt(req.params.id) } })
    res.redirect('/admin')
  })

  router.post('/links/:id/edit', requireLogin, async (req, res) => {
    const { url, label } = req.body
    await prisma.link.update({ where: { id: parseInt(req.params.id) }, data: { url, label: label || '' } })
    res.redirect('/admin')
  })

  return router
}
