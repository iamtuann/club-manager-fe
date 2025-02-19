<template>
  <v-container>
    <div class="d-flex justify-center mt-5 mb-5">
      <h2>Lịch sự kiện</h2>
    </div>
    <div >
      
    </div>
  </v-container>

</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores";
import { formatDate } from "@/utils";

const authStore = useAuthStore();

async function getData() {
  
}

getData();
</script>

<style scoped>

</style>