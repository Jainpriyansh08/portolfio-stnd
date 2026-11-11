<script setup>
defineProps({ walking: Boolean })
</script>
<template>
  <svg viewBox="0 0 40 52" class="hiker" :class="{ walking }" aria-hidden="true">
    <g class="bag"><rect x="9" y="17" width="10" height="16" rx="4" fill="#232a55" /><rect x="11" y="21" width="6" height="2" rx="1" fill="#a8c8b4" /></g>
    <path d="M 14 8 Q 15 4 21 4 Q 27 4 26 10 L 25 12 L 15 12 Z" fill="#1c1630" />
    <path class="pony" d="M 14 8 Q 8 10 9 20" stroke="#1c1630" stroke-width="3.5" fill="none" stroke-linecap="round" />
    <circle cx="21" cy="12" r="6" fill="#c98f6a" />
    <rect x="14.5" y="18" width="13" height="14" rx="5" fill="#a8c8b4" />
    <rect x="15" y="30" width="12" height="7" rx="2" fill="#2a2a38" />
    <g class="leg l"><rect x="16" y="35" width="4" height="12" rx="2" fill="#c98f6a" /><rect x="15" y="45" width="7" height="4" rx="2" fill="#fff" /></g>
    <g class="leg r"><rect x="22" y="35" width="4" height="12" rx="2" fill="#c98f6a" /><rect x="21" y="45" width="7" height="4" rx="2" fill="#fff" /></g>
    <g class="arm"><rect x="19" y="19" width="4" height="11" rx="2" fill="#a8c8b4" /></g>
  </svg>
</template>
<style scoped>
.hiker { width: 38px; height: 50px; overflow: visible; }
.leg, .arm { transform-box: fill-box; transform-origin: 50% 0; }
.walking .leg.l { animation: stride 0.5s ease-in-out infinite alternate; }
.walking .leg.r { animation: stride 0.5s ease-in-out infinite alternate-reverse; }
.walking .arm { animation: stride 0.5s ease-in-out infinite alternate-reverse; }
.walking { animation: hop 0.25s ease-in-out infinite alternate; }
.pony { transform-box: fill-box; transform-origin: 100% 0; animation: sway 1.4s ease-in-out infinite alternate; }
@keyframes stride { from { transform: rotate(-28deg); } to { transform: rotate(28deg); } }
@keyframes hop { to { translate: 0 -2px; } }
@keyframes sway { to { transform: rotate(10deg); } }
</style>
