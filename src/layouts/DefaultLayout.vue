<template>
  <v-app id="app-body" full-height>
    <v-layout>
      <v-navigation-drawer
        id="nav"
        rail
        rail-width="280"
        v-model="drawer"
      >
        <SideBar />
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

<script>
import { useDisplay } from 'vuetify'
import { ref } from "vue";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
export default {
  name: "DefaultLayout",
  components: {
    Header,
    SideBar,
  },
  data() {
    const {lgAndUp, mdAndDown} = useDisplay()
    let drawer = ref(lgAndUp.value)
    return {
      lgAndUp,
      mdAndDown,
      drawer
    }
  }
}
</script>

<style scoped>
#header.v-app-bar {
  padding: 0 24px;
  position: relative;
}
</style>
