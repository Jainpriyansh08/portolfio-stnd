const base = import.meta.env.BASE_URL + 'memories/'

// Order = order of the journey. `kind: 'video'` opens a player in the lightbox.
export const memories = [
  {
    src: 'm01.jpg', label: 'Chapter 1 · The Hilltop',
    title: 'The Throne Rock',
    caption: 'You sat on a boulder like it was a throne. Cloud cover: 100%. Smile: also 100%. The trees were jealous.',
    quip: 'She looks SO smug here. I love it.',
  },
  {
    src: 'm02.jpg', label: 'Chapter 2 · The Void',
    title: 'You vs. The Void',
    caption: 'You stared into a wall of fog like it owed you money. The fog blinked first.',
    quip: 'Fun fact: I am the fog. Hi.',
  },
  {
    src: 'm03.jpg', label: 'Chapter 3 · Zero Visibility',
    title: 'Hands on hips, where’s the view?',
    caption: 'Maximum “so… where’s the scenery?” energy. Plot twist: the scenery was a cloud. We stayed anyway.',
    quip: 'Visibility: none. Vibes: immaculate.',
  },
  {
    src: 'm04.jpg', label: 'Chapter 4 · The Climb',
    title: 'The Little Blue Church',
    caption: 'We climbed. We arrived. We were extremely dramatic about it. Worth it for this blue-and-white beauty.',
    quip: 'Pretty sure the angel on the wall approved of us.',
  },
  {
    src: 'm05.jpg', label: 'Chapter 5 · Caught',
    title: 'Yes, You. Keep Up.',
    caption: 'You pointed straight at the camera like “I see you.” Reader, I felt seen. And slightly targeted.',
    quip: 'That finger. That smile. Weaponised.',
  },
  {
    src: 'm06.jpg', label: 'Chapter 6 · Gravity',
    title: 'Graceful on Gravel (ish)',
    caption: 'A masterclass in balance on a rocky trail. “Graceful” is generous. “Iconic” is accurate.',
    quip: 'Arms out. Confidence in. Gravity: negotiable.',
  },
  {
    src: 'm07.jpg', label: 'Chapter 7 · The Lookout',
    title: 'Pointing at Something Important',
    caption: 'Probably the town. Possibly snacks. Definitely something worth a very dramatic arm extension.',
    quip: 'My bet: it was snacks.',
  },
  {
    src: 'm08.jpg', label: 'Chapter 8 · Nightfall',
    title: 'The Sky Showed Off',
    caption: 'A sky full of stars, a tree lit like a stage, and you looking up. Honestly, the sky had competition.',
    quip: 'The stars were on their best behaviour.',
  },
  {
    src: 'm09.jpg', label: 'Chapter 9 · The Glowing Arch',
    title: 'Through the Light Arch',
    caption: 'A glowing archway, a wet stone path, and dinner on the other side. It felt like the start of a story.',
    quip: 'Pizza signs. Fairy lights. Hello, plot.',
  },
  {
    src: 'm10.jpg', label: 'Chapter 10 · Midnight Road',
    title: 'Main-Character Lighting',
    caption: 'A foggy road, one streetlight, a glowing phone, and a leather jacket. Unfairly cinematic.',
    quip: 'Who gave her the lighting budget?',
  },
  {
    src: 'm11.jpg', label: 'Chapter 11 · Little Doodles',
    title: 'Foggy Window Art',
    caption: 'We doodled on a steamed-up window. It looks like a tiny door. Maybe it was one.',
    quip: 'Tiny door. Big feelings.',
  },
  {
    src: 'm12.jpg', label: 'Chapter 12 · Above the Clouds',
    title: 'A Town Twinkling Below',
    caption: 'Clouds rolling over a glittering valley. I would have paused time right here, no questions asked.',
    quip: 'Pausing time is sort of my whole thing today.',
  },
  {
    src: 'm13.jpg', label: 'Chapter 13 · One More Look',
    title: 'Another Look, Because Wow',
    caption: 'Same view, second shot. Because some views deserve a re-take. (So do some people. I’m not saying who.)',
    quip: 'Okay I was definitely not looking at the view.',
  },
  {
    src: 'm14.jpg', label: 'Chapter 14 · Blue Hour',
    title: 'Blue Hour, Slightly Blurry',
    caption: 'The camera could not focus. Honestly, same. A tower, a chain fence, and you glancing away mid-moment.',
    quip: 'Blurry, but I remember it in 4K.',
  },
  {
    src: 'm15.jpg', label: 'Chapter 15 · Sharp This Time',
    title: 'Blue Hour, In Focus',
    caption: 'Second try. Sharp, calm, and perfectly framed by a tower that clearly wanted in on the photo.',
    quip: 'We got there. Photographer’s redemption arc.',
  },
  {
    src: 'video-poster.jpg', video: 'video.mp4', kind: 'video', label: 'Bonus · Moving Picture',
    title: 'Into the Mist (the video)',
    caption: 'Walking off into the fog, then turning around with that grin. Press play. I have watched this more than I will admit.',
    quip: 'Press play. Or I will cry. Gently. In fog.',
  },
].map((m) => ({ ...m, url: base + m.src, videoUrl: m.video ? base + m.video : null }))
