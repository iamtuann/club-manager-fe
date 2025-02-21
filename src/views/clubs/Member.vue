<template>
  <v-container>
    <h2 class="mb-3">Thông tin thành viên</h2>
    <v-row>
      <v-col cols="6">
        Họ tên: {{ memberInfo.user?.firstName + ' ' + memberInfo.user?.lastName }}
      </v-col>
      <v-col cols="6">
        MSV: {{ memberInfo.user?.code || '--' }}
      </v-col>
      <v-col cols="6">
        Email: {{ memberInfo.user?.email || '--' }}
      </v-col>
      <v-col cols="6">
        Số điện thoại: {{ memberInfo.user?.phone || '--' }}
      </v-col>
      <v-col cols="6">
        Ngành: {{ memberInfo.user?.major || '--' }}
      </v-col>
      <v-col cols="6">
        Ngày tham gia: {{ formatDate(new Date(memberInfo?.joinDate)) || '--' }}
      </v-col>
    </v-row>
    <h2 class="my-5">Các sự kiện tham gia</h2>
    <v-row>
      <v-col cols="12" v-for="event in events.data" :key="event.id">
        <v-card elevation="16">
          <v-card-title>{{ event.name }}</v-card-title>
          <v-card-subtitle>
            {{ event.clubName }}
          </v-card-subtitle>
          <v-card-subtitle>
            <span>Ngày diễn ra: <b>{{ formatDate(new Date(event.eventDate)) }}</b></span> - 
            <span>{{ event.address }}</span>
          </v-card-subtitle>
          <v-card-text>
            <div>{{ event.description }}</div>

          </v-card-text>
        </v-card>
      </v-col>
      <v-pagination :length="events.totalPages"></v-pagination>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useClubStore, useEventStore } from "@/stores";
import { useRoute } from "vue-router";
import { formatDate } from "@/utils";

const route = useRoute();
const clubStore = useClubStore();
const eventStore = useEventStore()
const memberInfo = ref({})
const events = ref({
  data: [],
  totalPages: 0,
  totalElements: 0
})
const clubId = ref(route.params.id)
const memberId = ref(route.params.memberId)

async function getData() {
  try {
    const [memberRes, eventRes] = await Promise.all([
      clubStore.getMemberById(clubId.value, memberId.value),
      eventStore.getEventsOfMember(memberId.value)
    ])
    memberInfo.value = memberRes
    events.value.data = eventRes.content;
    events.value.totalPages = eventRes.totalPages;
    events.value.totalElements = eventRes.totalElements 
  } catch (e) {
    console.error(e)
  }
}

getData()
</script>

<style scoped>

</style>