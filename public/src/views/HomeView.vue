<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <main class="d-flex flex-column justify-content-center align-content-center justify-items-center">
    <div class="d-flex flex-row justify-content-center gap-3">
      <RouterLink class="bg-info bg-opacity-50 px-3 optionCard flex-column justify-content-center align-content-center justify-items-center text-light" to="/producers">
          <span class="cardLink">Producers</span>
      </RouterLink>

      <RouterLink class="bg-info-subtle bg-opacity-50 px-3 optionCard flex-column justify-content-center align-content-center justify-items-center text-light" to="/movies">
          <span class="cardLink">Movies</span>
      </RouterLink>
    </div>
  </main>
</template>
<style>
main{
  width: 100%;
  height: 100%;
}
.optionCard{
  width: 20rem;
  height: 15rem;
  border-radius: 2rem;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  font-size: x-large;
}

</style>
