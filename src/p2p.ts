// import { on } from 'events'
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

//   payload        : Nonce,
//   commonKeyBase64: Ed25519PublicKeyBase64, // room id
//   serverKeyBase64: Ed25519PublicKeyBase64, // host id
//   signatureBase64: Ed25519SignatureBase64,
// })

// type IAmClient = z.infer<typeof IAmClient>
// type IAmServer = z.infer<typeof IAmServer>

// type Message = IAmClient | IAmServer

// function arrayBufferToBase64(b: ArrayBuffer) {
//   return btoa(String.fromCharCode(...new Uint8Array(b)))
// }

// function base64ToArrayBuffer(b: string     ) {
//   return Uint8Array.from(atob(b), c => c.charCodeAt(0)).buffer
// }

// function arrayBufferToHex(b: ArrayBuffer) {
//   return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join("")
// }

// function hexToArrayBuffer(h: string) {
//   return Uint8Array.from(h.match(/.{1,2}/g)!.map(x => parseInt(x, 16))).buffer
// }

// async function host(appId: string) {
//   const commonKeyPair   = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])
//   const commonKeyBytes  = await crypto.subtle.exportKey("raw", commonKeyPair.publicKey)
//   const commonKeyBase64 = arrayBufferToBase64(commonKeyBytes)  
  
//   const serverKeyPair   = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])
//   const serverKeyBytes  = await crypto.subtle.exportKey("raw", serverKeyPair.publicKey)
//   const serverKeyBase64 = arrayBufferToBase64(serverKeyBytes)

//   const derivedHash = await crypto.subtle.digest("SHA-256", commonKeyBytes)
//   const derivedHex  = arrayBufferToHex(derivedHash)

//   const roomId      = derivedHex.substring(0,  6)
//   const fingerprint = derivedHex.substring(6, 10)

//   const trysteroRoom = Trystero.joinRoom({appId}, roomId)



//   const [sendIAmServer] = trysteroRoom.makeAction<IAmServer>("ias")

//   trysteroRoom.onPeerJoin(async peerId => {
//     const derivedBytes = new TextEncoder().encode(peerId)
//     const derivedHash  = await crypto.subtle.digest("SHA-256", derivedBytes)
//     const derivedHex   = arrayBufferToHex(derivedHash)
//     const nonce        = derivedHex.substring(0, 32)

//     const canonicalPayload = {
//       is: "v1-i-am-server" as const,
//       payload: nonce,
//       commonKeyBase64,
//       serverKeyBase64,
//     }
//     const canonicalString = JSON.stringify(canonicalPayload)
//     const canonicalBytes  = new TextEncoder().encode(canonicalString)
//     const signatureBytes  = await crypto.subtle.sign("Ed25519", serverKeyPair.privateKey, canonicalBytes)
//     const signatureBase64 = arrayBufferToBase64(signatureBytes)

//     sendIAmServer({
//       ...canonicalPayload,
//       signatureBase64
//     }, peerId)
//   })
// }

// async function poll(appId: string, roomId: string, ms=1000) {
//   return new Promise((res, rej) => {
//     const commonKeys: Array<string> = [ ]

//     setTimeout(() => {
//       res([...commonKeys])
//     }, ms)


//     const trysteroRoom = Trystero.joinRoom({appId}, roomId)

//     const [,whenIAmServer] = trysteroRoom.makeAction<IAmServer>("ias")

//     whenIAmServer(async m => {
//       const iAmServer = IAmServer.parse(m)

//       const commonKeyBytes = base64ToArrayBuffer(iAmServer.commonKeyBase64)
//       const commonKey      = await crypto.subtle.importKey("raw", commonKeyBytes, "Ed25519", true, ["verify"])

//       const canonicalPayload = {
//         is: "v1-i-am-server" as const,
//         payload: iAmServer.payload,
//         commonKeyBase64: iAmServer.commonKeyBase64,
//         serverKeyBase64: iAmServer.serverKeyBase64,
//       }
//       const canonicalString = JSON.stringify(canonicalPayload)
//       const canonicalBytes  = new TextEncoder().encode(canonicalString)

//       const signatureBytes = base64ToArrayBuffer(iAmServer.signatureBase64)
      
//       if (await crypto.subtle.verify("Ed25519", commonKey, signatureBytes, canonicalBytes)) {
//         commonKeys.push(iAmServer.commonKeyBase64)
//       }
//     })
//   })
// }

// async function join(appId: string, commonKeyBase64: string) {
//   const clientKeyPair   = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])
//   const clientKeyBytes  = await crypto.subtle.exportKey("raw", clientKeyPair.publicKey)
//   const clientKeyBase64 = arrayBufferToBase64(clientKeyBytes)

//   const commonKeyBytes = base64ToArrayBuffer(commonKeyBase64)

//   const derivedHash = await crypto.subtle.digest("SHA-256", commonKeyBytes)
//   const derivedHex  = arrayBufferToHex(derivedHash)

//   const roomId      = derivedHex.substring(0,  6)
//   const fingerprint = derivedHex.substring(6, 10)

//   const trysteroRoom = Trystero.joinRoom({appId}, roomId)


// }