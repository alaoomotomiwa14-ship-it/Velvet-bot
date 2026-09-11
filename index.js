const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')
async function startBot() {
const { state, saveCreds } = await useMultiFileAuthState('auth_info')
const sock = makeWASocket({ auth: state, printQRInTerminal: true })
sock.ev.on('creds.update', saveCreds)
sock.ev.on('connection.update', (update) => {
const { connection, lastDisconnect, qr } = update
if (qr) { console.log('Scan QR:'); qrcode.generate(qr, { small: true }) }
if (connection === 'close') {
const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut
if (shouldReconnect) startBot()
} else if (connection === 'open') { console.log('Velvet Bot online!') }
})
sock.ev.on('messages.upsert', async ({ messages }) => {
const msg = messages[0]
if (!msg.message || msg.key.fromMe) return
const from = msg.key.remoteJid
const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
if (text.toLowerCase() === '.ping') { await sock.sendMessage(from, { text: 'Pong! Velvet online 💜' }) }
if (text.toLowerCase() === '.menu') { await sock.sendMessage(from, { text: 'Velvet Menu:\n.ping\n.menu' }) }
})
}
startBot()
