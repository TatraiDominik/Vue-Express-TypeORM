<template>
  <div class="loader">
  </div>
</template>

<style>
.loader {
 background:
   radial-gradient(farthest-side, #0dcaf0 94%, transparent) top/8px 8px no-repeat,
   conic-gradient(transparent 30%, #0dcaf0);
 -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), black 0);
 mask: radial-gradient(farthest-side, transparent calc(100% - 8px), black 0);
 width: 4rem;
 height: 4rem;
 border-radius: 100%;
 animation: spin 200ms linear infinite;
}

@keyframes spin {
 from {
   transform: rotate(0deg);
 }
 to {
   transform: rotate(360deg);
 }
}
</style>
