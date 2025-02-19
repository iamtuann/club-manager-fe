<template>
  <v-container class="container">
    <div>
      <h2>Thông tin CLB</h2>
      <v-row class="mt-4">
        <v-col cols="12">Tên CLB: {{ clubStore.club.name }}</v-col>
        <v-col cols="12">Mô tả: {{ clubStore.club.description }}</v-col>
        <v-col cols="12">Ngày thành lập: {{ formatDate(new Date(clubStore.club.createdAt)) }}</v-col>
        <v-col cols="12">Số lượng thành viên: {{ clubStore.club.memberCount }}</v-col>
      </v-row>
      <h2 class="mt-5 mb-4">Chủ nhiệm</h2>
      <v-row>
        <v-col cols="6">
          Họ tên: {{ clubStore.club.manager ? clubStore.club.manager.firstName + ' ' + clubStore.club.manager.lastName : '--' }}
        </v-col>
        <v-col cols="6">
          MSV: {{ clubStore.club.manager?.code || '--' }}
        </v-col>
        <v-col cols="6">
          Email: {{ clubStore.club.manager?.email || '--' }}
        </v-col>
        <v-col cols="6">
          Số điện thoại: {{ clubStore.club.manager?.phone || '--' }}
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { useClubStore } from "@/stores";
import { formatDate } from "@/utils"

const clubStore = useClubStore()
</script>

<style lang="scss" scoped>

</style>