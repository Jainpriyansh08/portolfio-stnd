# 💌 Time Capsule

An interactive, 3D, slightly-flirty time capsule built with **Vue 3 + Three.js + Vite**.
It walks someone through a set of shared memories and ends with one very important question.

## The flow

1. **Hold to unseal**: press and hold the glowing seal; the 3D capsule shakes, charges up and bursts open.
2. **Memory tunnel**: fly through floating polaroids (scroll / swipe / arrow keys). Each has a playful caption, a cloud mascot with commentary, and a tiny hiker walking the trail. Tap a photo to open it big (the video plays too).
3. **Side quest**: catch 5 runaway 3D hearts.
4. **The question**: *"May I have your permission to flirt with you?"* The "No" button is… shy.
5. **YES**: fireworks, confetti, the memories orbit overhead, and a signed "Flirting Permission Slip" appears with a button to send the answer back.

## Run it

```bash
cd capsule
npm install
npm run dev        # local dev server
npm run build      # static site in capsule/dist (host anywhere)
```

## Personalise it

Edit **`src/config.js`**:

- **Her name & nickname**: set to Ayhaesass a.k.a. Chutta Saand 🐂. Override with `?to=Name&nick=Nickname`, or set `nickname` to `''` to hide it.
- **Where her YES goes**: fill in one of `reply.whatsapp`, `reply.sms` or `reply.email`.
  If all are empty the button uses the phone's share sheet (or copies the message).

Edit **`src/memories.js`** to change captions, titles, mascot one-liners, or add/remove photos
(drop images in `public/memories/`; keep them ≤ 1400px wide so it stays fast).

## Notes

- Works on desktop and phones; respects `prefers-reduced-motion`.
- If WebGL isn't available it falls back to a 2D flow (no game).
- Sound is synthesized in the browser (no audio files) and can be muted top-right.
- `noindex` is set so the page isn't picked up by search engines. Share the link only with her.
