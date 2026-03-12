// import * as Trystero from 'trystero'
// import z from 'zod'

// const Ed25519PublicKeyBase64 = z.base64().length(44)
// const Ed25519SignatureBase64 = z.base64().length(88)
// const Nonce                  = z.hex().length(32)

// const IAmClient = z.strictObject({
//   is: z.literal("v1-i-am-client"),
  
//   payload        : Nonce,
//   commonKeyBase64: Ed25519PublicKeyBase64, // room id
//   clientKeyBase64: Ed25519PublicKeyBase64, // peer id
//   signatureBase64: Ed25519SignatureBase64,
// })

// const IAmServer = z.strictObject({
//   is: z.literal("v1-i-am-server"),

//   payload  : Nonce,
//   commonKeyBase64: Ed25519PublicKeyBase64, // room id
//   serverKeyBase64: Ed25519PublicKeyBase64, // host id
//   signatureBase64: Ed25519SignatureBase64,
// })

// type IAmClient = z.infer<typeof IAmClient>
// type IAmServer = z.infer<typeof IAmServer>

// type Message = IAmClient | IAmServer

// function ArrayBufferToBase64(b: ArrayBuffer) {
//   return btoa(String.fromCharCode(...new Uint8Array(b)))
// }

// function base64ToArrayBuffer(b: string     ) {
//   return Uint8Array.from(atob(b), c => c.charCodeAt(0)).buffer
// }

// async function host(appId: string) {
//   const commonKeyPair   = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])
//   const commonKeyBytes  = await crypto.subtle.exportKey("raw", commonKeyPair.publicKey)
//   const commonKeyBase64 = ArrayBufferToBase64(commonKeyBytes)
  
  
//   const serverKeyPair   = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])
//   const serverKeyBytes  = await crypto.subtle.exportKey("raw", serverKeyPair.publicKey)
//   const serverKeyBase64 = ArrayBufferToBase64(serverKeyBytes)


//   const trysteroRoom = Trystero.joinRoom({appId}, commonKeyBase64)
//   trysteroRoom.makeAction<Message>("message")
// }

// async function join(appId: string, commonKeyBase64: string) {
//   const clientKeyPair   = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])
//   const clientKeyBytes  = await crypto.subtle.exportKey("raw", clientKeyPair.publicKey)
//   const clientKeyBase64 = ArrayBufferToBase64(clientKeyBytes)

//   const commonKeyBytes = base64ToArrayBuffer(commonKeyBase64)
//   const commonKey      = await crypto.subtle.importKey("raw", commonKeyBytes, "Ed25519", true, ["verify"])

//   const trysteroRoom = Trystero.joinRoom({appId}, commonKeyBase64)
//   trysteroRoom.makeAction<Message>("message")
// }