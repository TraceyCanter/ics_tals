const express = require("express")
const router = express.Router()
const emailService = require("../services/emailService")

router.get('/emails', emailService.fetchAll.bind(emailService))
router.get('/emails/:id', emailService.fetchById.bind(emailService))
router.post('/emails', emailService.sendEmail.bind(emailService))

module.exports = router

