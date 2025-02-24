<template>
  <v-app id="app-body" full-height>
    <v-layout>
      <v-navigation-drawer
        id="nav"
        rail
        rail-width="280"
        v-model="drawer"
      >
        <SidebarClub />
      </v-navigation-drawer>
      <v-app-bar id="header">
        <template #prepend>
          <v-btn
            v-if="mdAndDown"
            icon="mdi-menu"
            size="40"
            color="default"
            @click="drawer = true"
          />
          <RouterLink class="nav-link" :to="{name: 'Clubs'}">Danh sách CLB</RouterLink>
        </template>
        <Header />
      </v-app-bar>
      <v-main>
        <slot />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref } from "vue";
import Header from "@/components/Header.vue";
import SidebarClub from "@/components/SidebarClub.vue";
import { useRoute } from "vue-router";
import { useClubStore } from "@/stores";

const {lgAndUp, mdAndDown} = useDisplay()
const drawer = ref(lgAndUp.value)
const route = useRoute()
const clubStore = useClubStore();

async function getClub() {
  await Promise.all([
    clubStore.getById(route.params.id),
    clubStore.getRoleClub(route.params.id)
  ]) 
}
getClub();
</script>

<style scoped>
#header.v-app-bar {
  padding: 0 24px;
  position: relative;
}
.nav-link {
  min-width: 130px;
  padding: 4px 6px;
  margin-left: 20px;
  color: rgba(58, 53, 65, 1);
}
</style>
