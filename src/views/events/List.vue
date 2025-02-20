<template>
  <v-container>
    <h2 class="mb-3 text-center">Lịch sự kiện</h2>
    <div class="py-2 my-4">
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
    </div>
    <v-pagination :length="events.totalPages"></v-pagination>
  </v-container>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useEventStore } from "@/stores";
import { useToast } from "vue-toastification";
import { formatDate } from "@/utils";

const toast = useToast()
const eventStore = useEventStore();
const events = ref({
  data: [],
  totalPages: 0,
  totalElements: 0
})
const formSearch = reactive({
  name: "",
  pageIndex: 1
})

async function getEvent() {
  try {
    const res = await eventStore.searchEvent(formSearch.name, formSearch.pageIndex);
    events.value.data = res.content;
    events.value.totalPages = res.totalPages;
    events.value.totalElements = res.totalElements 
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
  }
}
getEvent()
</script>

<style scoped>


</style>