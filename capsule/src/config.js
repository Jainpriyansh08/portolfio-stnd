// ─────────────────────────────────────────────────────────────
//  Personalise me!  Everything about the capsule lives here.
// ─────────────────────────────────────────────────────────────

// Her name. You can also override it with a link: https://your-site/?to=Maya
const params = new URLSearchParams(globalThis.location?.search ?? '')

export const config = {
  herName: params.get('to') || 'Ayhaesass',  // '' → the site just says "you"
  nickname: params.get('nick') || 'Chutta Saand', // the cute one 🐂 ('' to hide it)
  myName: params.get('from') || '',         // '' → "me"

  // Where her "YES" gets sent. Pick ONE (leave the others empty):
  //   whatsapp: international number, digits only, e.g. '919876543210'
  //   sms:      phone number, e.g. '+919876543210'
  //   email:    your email address
  // If all are empty, the YES button falls back to the phone's share sheet / copy-to-clipboard.
  reply: {
    whatsapp: '',
    sms: '',
    email: '',
  },
}

export const herName = config.herName
export const you = config.herName || 'you'
export const nick = config.nickname
