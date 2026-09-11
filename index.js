const m=require('@whiskeysockets/baileys');
const P=require('pino');
async function s(){
const {state,saveCreds}=await m.useMultiFileAuthState('./a1');
const k=m.default({auth:state,logger:P({level:'silent'})});
k.ev.on('creds.update',saveCreds);
if(!k.authState.creds.registered){
const c=await k.requestPairingCode('2349075197821');
console.log('PAIRING CODE:'+c);
}}
s();
