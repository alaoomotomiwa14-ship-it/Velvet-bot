const m=require('@whiskeysockets/baileys');
const P=require('pino');
async function s(){
const {state,saveCreds}=await m.useMultiFileAuthState('./a1');
const k=m.default({auth:state,logger:P({level:'silent'}),browser:['Velvet','Chrome','1.0'],markOnlineOnConnect:false});
k.ev.on('creds.update',saveCreds);
await new Promise(r=>setTimeout(r,2000));
if(!k.authState.creds.registered){
const c=await k.requestPairingCode('2349075197821');
console.log('PAIRING CODE:'+c);
}}
s();
