const { readFileSync } = require('fs')
const { resolve } = require('path')
const mailer = require('../emailConfig')

function send(ctx) {
  const { body, files } = ctx.request
  console.log(body, files.file)
  ctx.status = 200
  mailer.sendMail({
    from: 'lakshamana@arjuna.test',
    to: 'lakshamana@protonmail.com',
    subject: 'Chamado FICAT',
    html: makeEmailContent(body)
  })
}

function makeEmailContent({ name, email, fone, msg }) {
  const emailContent = readFileSync(
    resolve(__dirname, '../models/email/email.html'),
    'utf8'
  )
  return emailContent
    .replace('{{name}}', name)
    .replace('{{email}}', email)
    .replace('{{fone}}', fone)
    .replace('{{msg}}', msg)
}

module.exports = { send }
