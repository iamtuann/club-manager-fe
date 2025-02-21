<template>
  <div class="nav-header py-3 text-center my-3">
    <router-link :to="{name: 'Events'}">
      <h2 class="">CMS</h2>
    </router-link>
  </div>
  <div class="list-items">
    <ul class="nav-items">
      <template v-for="(item, i) in items" :key="i">
        <li class="nav-title" v-if="item.title">
          <span class="title-text">{{ item.title }}</span>
        </li>
        <v-list class="w-200">
          <li v-for="nav in item.navs" :key="nav.name" class="nav-link">
            <template v-if="nav.subNavs != null">
              <v-list-group v-if="nav.show">
                <template v-slot:activator="{ props }">
                  <v-list-item class="item" v-bind="props">
                    <template v-slot:prepend>
                      <span class="nav-icon" :class="nav.icon"></span>
                    </template>
                    {{ nav.name }}
                  </v-list-item>
                </template>
                <template v-for="subNav in nav.subNavs" :key="subNav.name">
                  <v-list-item v-if="subNav.show" active-class="item-active" :to="subNav.path">
                    <template v-slot:prepend>
                      <span class="nav-icon" :class="subNav.icon"></span>
                    </template>
                    {{ subNav.name }}
                  </v-list-item>
                </template>
              </v-list-group>
            </template>
            <template v-else>
              <v-list-item v-if="nav.show" active-class="item-active" :to="nav.path">
                <template v-slot:prepend>
                  <span class="nav-icon" :class="nav.icon"></span>
                </template>
                {{ nav.name }}
              </v-list-item>
            </template>
          </li>
        </v-list>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores";
import { ref, reactive } from "vue";

const authStore = useAuthStore();
const isManager = authStore.isManager()

const items = [
  {
    title: "",
    navs: [
      {name: "Sự kiện", path: {name: "Events"}, icon: "mdi mdi-calendar-range-outline", show: true}, 
      {name: "Câu lạc bộ", path: {name: "Clubs"}, icon: "mdi mdi-account-group", show: true}, 
      {name: "Tài khoản", path: {name: "Users"}, icon: "mdi mdi-account", show: true}, 
    ]
  },
]
</script>

<style scoped>
.logo-sidebar {
  width: 150px;
  height: auto;
}
a {
  text-decoration: none;
}
.nav-items {
  position: relative;
  list-style-type: none;
}
.nav-items .item-active {
  background: linear-gradient(-72.47deg,rgb(var(--v-theme-primary)) 22.16%,rgba(var(--v-theme-primary),.7) 76.47%)!important;
  color: rgb(var(--v-theme-on-primary));
}
.nav-link a {
  position: relative;
  display: block;
  height: 42px;
  border-bottom-right-radius: 3.125rem!important;
  border-top-right-radius: 3.125rem!important;
  margin: 0 18px 6px 0;
  padding: 0 16px 0 22px;
  display: flex;
  align-items: center;
  background-color: transparent;
  color: rgba(var(--v-theme-on-surface),var(--v-high-emphasis-opacity));
}
.nav-link a::before {
  position: absolute;
  border-radius: inherit;
  background: currentcolor;
  block-size: 100%;
  content: "";
  inline-size: 100%;
  inset: 0;
  opacity: 0;
  pointer-events: none;
}
.nav-link a:hover::before {
  opacity: calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier));
}
/* .nav-link a.router-link-active  {
  background: linear-gradient(-72.47deg,rgb(var(--v-theme-primary)) 22.16%,rgba(var(--v-theme-primary),.7) 76.47%)!important;
  color: rgb(var(--v-theme-on-primary));
} */
.nav-link .nav-icon {
  flex-shrink: 0;
  font-size: 1.5rem;
  margin-inline-end: 0.625rem;
  inline-size: 1em;
}
.nav-link .nav-link-title {
  letter-spacing: 0.15px;
  overflow: hidden;
  margin-right: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nav-title {
  margin: 24px 18px 8px 0;
  padding: 0 16px 0 22px;
  letter-spacing: 0.4px;
  color: rgba(var(--v-theme-on-surface),var(--v-disabled-opacity));
  font-size: 12px;
  text-transform: uppercase;
}
.title-text {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  column-gap: 0.625rem;
}
.title-text::before {
  flex: 0 1 0.75rem;
  margin-left: -1.375rem;
  border-block-end: 1px solid rgba(var(--v-border-color),var(--v-border-opacity));
  content: "";
}
.title-text::after {
  flex: 1 1 auto;
  border-block-end: 1px solid rgba(var(--v-border-color),var(--v-border-opacity));
  content: "";
}
::v-deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 35px !important;
  padding-top: 4px;
  padding-bottom: 4px;
  line-height: 22px;
}
::v-deep(.v-list-item__append) {
  display: block;
}
::v-deep(.v-list-group:has(.item-active) > .v-list-item) {
  background: rgba(var(--v-theme-secondary), .2)!important;
}
</style>