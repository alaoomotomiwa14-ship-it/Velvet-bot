const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');
  const sock = makeWASocket({ auth: state, logger: P({ level: 'silent' }) });
  sock.ev.on('creds.update', saveCreds);
  await new Promise(r => setTimeout(r, 2000));
  if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode('2349075197821');
    console.log('PAIRING CODE:' + code);
  }
  sock.ev.on('connection.update', u => {
    if (u.connection === 'open') console.log('CONNECTED');
  });
}
start();
