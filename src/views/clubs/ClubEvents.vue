<template>
  <div>
    <v-expansion-panels v-model="expansionPanel">
      <v-expansion-panel>
        <v-expansion-panel-title static>
          <span class="font-weight-medium text-h6">Tìm kiếm</span>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form @submit.prevent="handleSearch" ref="formSearchRef">
            <v-row>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field
                  label="Tìm kiếm"
                  density="compact"
                  v-model="formSearch.name"
                  clearable
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-btn class="mb-2 mt-1" type="submit">Tìm kiếm</v-btn>
            </v-row>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card class="">
      <v-card-item>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>
            Danh sách sự kiện
          </v-card-title>
          <v-btn append-icon="mdi-plus" v-if="isClubManager" :to="{name: 'CreateEvent'}">
            Thêm
          </v-btn>
        </div>
      </v-card-item>
      <v-card-item>
        <v-data-table-server
          hover
          :items-per-page="dataTable.itemsPerPage"
          :headers="computedHeader"
          :items="dataTable.items"
          :items-length="dataTable.totalItems"
          :loading="dataTable.loading"
          v-model:page="dataTable.pageIndex"
          show-current-page
          loading-text="Đang tra cứu"
          no-data-text="Không có dữ liệu"
          items-per-page-text="Số lượng / trang"
          @update:options="getData"
          @update:items-per-page="(items) => dataTable.itemsPerPage = items"
        >
          <template v-slot:item.index="{ index }">
            {{ index+=1 }}
          </template>
          <template v-slot:item.eventDate="{ item }">
            {{ formatDate(new Date(item.eventDate)) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-btn size="x-small" icon color="info" :to="{name: 'UpdateEvent', params: {id: clubId, eventId: item.id}}">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
              <v-btn size="x-small" icon color="error" @click="handleDelete(item)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table-server>

        <template>
          <v-row justify="center">
            <v-dialog v-model="deleteDialog" persistent width="800">
              <v-card>
                <v-toolbar color="error" title="Xoá sự kiện"></v-toolbar>
                <v-card-text>
                  <p>Bạn có chắc chắn muốn xoá sự kiện "<b> {{ deleteDialogData.name }}</b>"?
                  </p>
                </v-card-text>
                <v-card-actions class="mb-2">
                  <v-spacer></v-spacer>
                  <v-btn variant="elevated" color="grey-200" @click="deleteDialog = false">
                    Hủy bỏ
                  </v-btn>
                  <v-btn variant="elevated" color="error" @click="deleteEvent(deleteDialogData.id)">
                    Xoá
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </template>
      </v-card-item>
    </v-card>
  </div>
</template>

<script setup>
import { useClubStore } from "@/stores";
import { formatDate } from "@/utils";
import { ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

const clubStore = useClubStore();
const route = useRoute()
const toast = useToast();

const clubId = computed(() => route.params?.id)
const expansionPanel = ref([0]);
const formSearchRef = ref(null);
const formSearch = reactive({
  name: "",
})
const deleteDialog = ref(false);
const deleteDialogData = ref(null);
const isClubManager = clubStore.isClubManager()

const dataTable = reactive({
  itemsPerPage: 25,
  loading: false,
  totalItems: 0,
  headers: [
    {title: "#", key: "index", align: "center", sortable: false},
    {title: "Tên sự kiện", key: "name", align: "center", sortable: false},
    {title: "Ngày diễn ra", key: "eventDate", align: "center", sortable: false},
    {title: "Địa chỉ", key: "address", align: "center", sortable: false},
    {title: "Số lượng thành viên", key: "memberCount", align: "center", sortable: false},
    // {title: "Trạng thái", key: "status", align: "center", sortable: false},
    {title: "", key: "actions", sortable: false, hidden: !isClubManager},
  ],
  items: [],
  pageIndex: 1,
})

const computedHeader = computed(() => {
  return dataTable.headers.filter(header => !header.hidden);
})

function handleSearch() {
  if (dataTable.pageIndex != 1) {
    dataTable.pageIndex = 1;
  } else {
    getData({
      page: dataTable.pageIndex,
      itemsPerPage: dataTable.itemsPerPage,
      sortBy: []
    })
  }
}

async function getData({ page, itemsPerPage, sortBy }) {
  dataTable.loading = true;
  try {
    const key = sortBy[0]?.key || null;
    const orderBy = sortBy[0]?.order || null;
    const response = await clubStore.getEvents(
      route.params.id, formSearch.name, page, itemsPerPage, key, orderBy
    );
    dataTable.items = response.content;
    dataTable.totalItems = response.totalElements;
  } catch (e) {
    console.error(e);
  } finally {
    dataTable.loading = false;
  }
}

function handleDelete(item) {
  deleteDialogData.value = {
    id: item.id,
    name: item.name
  }
  deleteDialog.value = true;
}

async function deleteEvent(id) {
  try {
    const response = await clubStore.deleteEvent(clubId.value, id);
    deleteDialog.value = false;
    handleSearch();
    toast.success("Xoá sự kiện thành công")
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
  }
}
</script>

<style scoped>
::v-deep(.v-selection-control.v-selection-control--density-default) {
  justify-content: center;
}
</style>