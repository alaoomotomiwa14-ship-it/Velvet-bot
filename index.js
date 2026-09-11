const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const pino = require('pino')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['Velvet-bot', 'Chrome', '1.0']
    })
    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER
        if (!phoneNumber) {
            console.log('ERROR: Add PHONE_NUMBER in Railway Variables (e.g. 2348012345678)')
            return
        }
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(phoneNumber)
                console.log('==============================')
                console.log('PAIRING CODE: ' + code)
                console.log('==============================')
                console.log('Link with phone number in WhatsApp Linked devices')
            } catch (e) {
                console.log('Pairing error:', e.message)
            }
        }, 3000)
    }
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut
            console.log('Connection closed, reconnecting:', shouldReconnect)
            if (shouldReconnect) startBot()
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp!')
        }
    })
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
        const from = msg.key.remoteJid
        if (text.toLowerCase() === '!ping') {
            await sock.sendMessage(from, { text: 'Pong! Velvet-bot is online.' })
        }
    })
}
startBot()
