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
        <template v-if="true" #prepend>
          <v-btn
            v-if="mdAndDown"
            icon="mdi-menu"
            size="40"
            color="default"
            @click="drawer = true"
          />
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
  const res = await clubStore.getById(route.params.id)
}
getClub();
</script>

<style scoped>
#header.v-app-bar {
  padding: 0 24px;
  position: relative;
}
</style>
