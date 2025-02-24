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
            Danh sách thành viên
          </v-card-title>
          <v-btn append-icon="mdi-plus" v-if="isClubManager" @click="openAddDialog">
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
          <template v-slot:item.name="{ item }">
            {{ item.user.firstName + ' ' + item.user.lastName }}
          </template>
          <template v-slot:item.code="{ item }">
            {{ item.user.code }}
          </template>
          <template v-slot:item.major="{ item }">
            {{ item.user.major }}
          </template>
          <template v-slot:item.joinDate="{ item }">
            {{ formatDate(new Date(item.joinDate)) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-btn size="x-small" icon :to="{name: 'MemberDetail', params: {id: clubId, memberId: item.id}}">
                <v-icon>mdi-eye-outline</v-icon>
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
                <v-toolbar color="error" title="Giải thể CLB"></v-toolbar>
                <v-card-text>
                  <p>Bạn có chắc chắn muốn xoá thành viên "<b> {{ deleteDialogData.name }}</b>"?
                  </p>
                </v-card-text>
                <v-card-actions class="mb-2">
                  <v-spacer></v-spacer>
                  <v-btn variant="elevated" color="grey-200" @click="deleteDialog = false">
                    Hủy bỏ
                  </v-btn>
                  <v-btn variant="elevated" color="error" @click="deleteMember(deleteDialogData.id)">
                    Xoá
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </template>
      </v-card-item>
    </v-card>
    <template>
      <v-row justify="center">
        <v-dialog v-model="addDialog" persistent width="800">
          <v-card>
            <v-toolbar title="Thêm thành viên"></v-toolbar>
            <v-card-text>
              <v-autocomplete
                label="Chọn tài khoản"
                :items="listUser"
                v-model="addUsers"
                multiple
                :return-object="false"
                item-value="id"
                item-title="username"
                variant="outlined"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="`${item.raw.firstName} ${item.raw.lastName}`"
                    :subtitle="`${item.raw.username} (${item.raw.code})`"
                  ></v-list-item>
                </template>
              </v-autocomplete>
            </v-card-text>
            <v-card-actions class="mb-2">
              <v-spacer></v-spacer>
              <v-btn variant="elevated" color="grey-200" @click="closeAddDialog">
                Hủy bỏ
              </v-btn>
              <v-btn variant="elevated" color="primary" @click="onAddMembers">
                Thêm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>

<script setup>
import { useClubStore, useUserStore } from "@/stores";
import { formatDate } from "@/utils";
import { ref, reactive , computed} from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

const clubStore = useClubStore();
const userStore = useUserStore()
const route = useRoute()
const toast = useToast();
const clubId = ref(route.params.id)

const expansionPanel = ref([0]);
const formSearchRef = ref(null);
const formSearch = reactive({
  name: "",
})
const deleteDialog = ref(false);
const deleteDialogData = ref(null);
const isClubManager = clubStore.isClubManager()

const addDialog = ref(false)
const listUser = ref([])
const addUsers = ref([])

const dataTable = reactive({
  itemsPerPage: 25,
  loading: false,
  totalItems: 0,
  headers: [
    {title: "#", key: "index", align: "center", sortable: false},
    {title: "Họ tên", key: "name", align: "center", sortable: true},
    {title: "MSV", key: "code", align: "center", sortable: false},
    {title: "Ngành học", key: "major", align: "center", sortable: false},
    {title: "Ngày tham gia", key: "joinDate", align: "center", sortable: false},
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
    const response = await clubStore.getMembers(
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

function openAddDialog() {
  addDialog.value = true
  getUserNotInClub()
}

function closeAddDialog() {
  addDialog.value = false;
  addUsers.value = []
}

async function getUserNotInClub() {
  try {
    const res = await userStore.getUsersNotInClub(route.params.id)
    listUser.value = res;
    
  } catch (e) {
    console.error(e);
  }
}

async function onAddMembers() {
  try {
    const response = await clubStore.addMembers(route.params.id, addUsers.value);
    closeAddDialog()
    handleSearch();
    toast.success("Thêm thành viên thành công")
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
  }
}

function handleDelete(item) {
  deleteDialogData.value = {
    id: item.id,
    name: item.user.firstName + ' ' + item.user.lastName
  }
  deleteDialog.value = true;
}

async function deleteMember(id) {
  try {
    const response = await clubStore.deleteMember(route.params.id, id);
    deleteDialog.value = false;
    handleSearch();
    toast.success("Xoá thành viên thành công")
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.mesage);
  }
}
</script>

<style scoped>
::v-deep(.v-selection-control.v-selection-control--density-default) {
  justify-content: center;
}
</style>