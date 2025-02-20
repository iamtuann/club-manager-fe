<template>
  <v-container v-if="notFound" class="mt-3 d-flex justify-center">
    <div class="pa-3 rounded-lg">
      Sự kiện không tồn tại với id: {{ route.params.id }}
    </div>
  </v-container>
  <v-container v-else>
    <h2 v-if="route.name == 'CreateEvent'" class="py-3">Thêm sự kiện mới</h2>
    <h2 v-if="route.name == 'UpdateEvent'" class="py-3">Cập nhật sự kiện</h2>
    <v-form @submit.prevent="submitForm" ref="formRef">
      <v-row class="mt-5">
        <v-col cols="12">
          <v-text-field
            label="Tên sự kiện"
            density="comfortable"
            v-model="formEvent.name"
            :rules="[isRequired('Tên sự kiện')]"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-menu v-model="openEventDate" offset-y :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                density="comfortable"
                :modelValue="evntDateFormat"
                append-inner-icon="mdi-calendar-month"
                label="Ngày diễn ra"
                readonly></v-text-field>
            </template>
            <v-date-picker
              v-model="formEvent.eventDate"
              no-title
              show-adjacent-months color="primary"
              hide-weekdays
              hide-header
              @update:modelValue="openEventDate = false"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12">
          <v-text-field
            label="Địa điểm"
            density="comfortable"
            v-model="formEvent.address"
            :rules="[isRequired('Địa điểm')]"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            label="Chi tiết sự kiện"
            density="comfortable"
            v-model="formEvent.description"
            :rules="[isRequired('Chi tiết sự kiện')]"
          />
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            label="Thành viên tham gia"
            :items="members"
            v-model="formEvent.userIds"
            multiple
            :return-object="false"
            item-value="user.id"
            item-title="user.username"
            chips
            closable-chips
            variant="outlined"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="`${item.raw.user.firstName} ${item.raw.user.lastName}`"
                :subtitle="`${item.raw.user.username} (${item.raw.user.code})`"
              ></v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" class="d-flex justify-center ga-3 mt-4">
          <v-btn color="error" variant="tonal" class="opacity-90" @click="cancelForm">
            Quay lại
          </v-btn>
          <v-btn type="submit">
            Lưu
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <!-- dialog confirm exit -->
    <v-dialog v-model="dialogExit" persistent max-width="500">
      <v-card text="Thông tin thay đổi chưa được lưu!">
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogExit = false">
            Hủy
          </v-btn>
          <v-btn color="error" :to="{name: 'Events'}">
            Thoát
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { isRequired, formatDate } from "@/utils";
import { useClubStore } from "@/stores";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";

const clubStore = useClubStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const formRef = ref(null);
const notFound = ref(false);
const dialogExit = ref(false);
const clubId = computed(() => route.params?.id)
const eventId = computed(() => route.params?.eventId)

const members = ref([]);

const formEvent = ref({
  name: "",
  description: "",
  eventDate: null,
  address: "",
  userIds: [],
});
const openEventDate = ref(null)
const evntDateFormat = computed(() => formatDate(formEvent.value.eventDate))

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    if (route.name == "CreateEvent") {
      const response = await clubStore.createEvent(clubId.value, formEvent.value);
      toast.success("Thêm sự kiện mới thành công");
      router.replace({name: "ClubEvents", params: {id: clubId.value}});
    } else if (route.name == "UpdateEvent") {
      const response = await clubStore.updateEvent(clubId.value, eventId.value, formEvent.value);
      toast.success("Cập nhật thông tin thành công");
      router.replace({name: "ClubEvents", params: {id: clubId.value}});
    }
  } catch (error) {
    console.log(error);
    toast.error(error?.response.data.message);
  }
}

function cancelForm() {
  router.push({name: "ClubEvents", params: {id: clubId.value}});
}

async function getEventData() {
  if (route.name == "UpdateEvent") {
    try {
      const response = await clubStore.getEventById(clubId.value, eventId.value);
      formEvent.value = {
        name: response.name,
        description: response.description,
        eventDate: new Date(response.eventDate),
        address: response.address,
        userIds: response.userIds,
      }
    } catch (error) {
      if (error.status == 404) {
        notFound.value = true;
      }
    }
  }
}

async function getFormInfo() {
  try {
    const res = await clubStore.getAllMembers(clubId.value)
    members.value = res.content;
    getEventData();
  } catch (error) {
    console.error("Error fetching form data:", error);
  }
}
getFormInfo();

</script>

<style scoped>

</style>