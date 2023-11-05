<script setup>
import FormPage from "./views/FormPage.vue";
</script>

<template>
  <router-view :key="$route.path"></router-view>
</template>
