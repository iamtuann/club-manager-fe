<template>
  <div>
    <v-expansion-panels v-model="expansionPanel">
      <v-expansion-panel>
        <v-expansion-panel-title static>
          <span class="font-weight-medium text-h6">Quản lý CLB</span>
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

    <v-card class="mt-4">
      <v-card-item>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>
            Danh sách CLB
          </v-card-title>
          <v-btn append-icon="mdi-plus" v-if="authStore.isManager()" @click="openAddDialog">
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
            <router-link :to="{name: 'ClubInfo', params: {id: item.id}}">{{ item.name }}</router-link>
          </template>
          <template v-slot:item.manager="{ item }">
            {{ item.manager ? item.manager?.firstName + ' ' + item.manager?.lastName : '--' }}
          </template>
          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(new Date(item.createdAt)) }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip v-if="item.status == 1" color="success">
              Hoạt động
            </v-chip>
            <v-chip v-else color="error">
              Đã giải thể
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <div v-if="item.status == 1" class="d-flex justify-center ga-2">
              <v-btn size="x-small" icon color="info" @click="openEditDialog(item)">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
              <v-btn size="x-small" icon color="error" @click="handleDelete(item)">
                <v-icon>mdi-cancel</v-icon>
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
                  <p>Bạn có chắc chắn muốn giải thể CLB "<b> {{ deleteDialogData.name }}</b>"?
                  </p>
                </v-card-text>
                <v-card-actions class="mb-2">
                  <v-spacer></v-spacer>
                  <v-btn variant="elevated" color="grey-200" @click="deleteDialog = false">
                    Hủy bỏ
                  </v-btn>
                  <v-btn variant="elevated" color="error" @click="deleteClub(deleteDialogData.id)">
                    Giải thể
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </template>
      </v-card-item>
    </v-card>
    <template>
      <v-form ref="formAddRef">
        <v-dialog v-model="addDialog" persistent width="800">
          <v-card>
            <v-toolbar title="Thêm CLB"></v-toolbar>
            <v-card-text>
              <v-col cols="12">
                <v-text-field
                  label="Tên CLB"
                  density="comfortable"
                  v-model="formData.name"
                  :rules="[isRequired('Tên CLB')]"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Mô tả"
                  density="comfortable"
                  v-model="formData.description"
                />
              </v-col>
            </v-card-text>
            <v-card-actions class="mb-2">
              <v-spacer></v-spacer>
              <v-btn variant="elevated" color="grey-200" @click="closeAddDialog">
                Hủy bỏ
              </v-btn>
              <v-btn variant="elevated" color="primary" @click="onCreateClub">
                Thêm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
      <v-form ref="formEditRef">
        <v-dialog v-model="editDialog" persistent width="800">
          <v-card>
            <v-toolbar title="Cập nhật CLB"></v-toolbar>
            <v-card-text>
              <v-col cols="12">
                <v-text-field
                  label="Tên CLB"
                  density="comfortable"
                  v-model="formData.name"
                  :rules="[isRequired('Tên CLB')]"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Mô tả"
                  density="comfortable"
                  v-model="formData.description"
                />
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  label="Chủ nhiệm CLB"
                  :items="members"
                  v-model="formData.userId"
                  :return-object="false"
                  item-value="user.id"
                  item-title="user.username"
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
            </v-card-text>
            <v-card-actions class="mb-2">
              <v-spacer></v-spacer>
              <v-btn variant="elevated" color="grey-200" @click="closeAddDialog">
                Hủy bỏ
              </v-btn>
              <v-btn variant="elevated" color="primary" @click="onUpdateClub">
                Lưu
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useAuthStore, useClubStore } from "@/stores";
import { formatDate, isRequired } from "@/utils";
import { useToast } from "vue-toastification";

const expansionPanel = ref([0]);
const formSearchRef = ref(null);
const clubStore = useClubStore();
const authStore = useAuthStore()
const toast = useToast();

const formSearch = reactive({
  name: "",
})
const members = ref([])

const deleteDialog = ref(false);
const deleteDialogData = ref(null);

const formAddRef = ref(null)
const addDialog = ref(false)
const formData = reactive({
  id: "",
  name: "",
  description: "",
  userId: null
})
const formEditRef = ref(null)
const editDialog = ref(false)

const dataTable = reactive({
  itemsPerPage: 25,
  loading: false,
  totalItems: 0,
  headers: [
    {title: "#", key: "index", align: "center", sortable: false},
    {title: "Tên", key: "name", align: "center", sortable: true},
    {title: "Ngày tạo", key: "createdAt", align: "center", sortable: false},
    {title: "Chủ nhiệm", key: "manager", align: "center", sortable: false},
    {title: "Số thành viên", key: "memberCount", align: "center", sortable: false},
    {title: "Trạng thái", key: "status", align: "center", sortable: false},
    {title: "", key: "actions", sortable: false, hidden: !authStore.isManager()},
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
    const response = await clubStore.search(
      formSearch.name, page, itemsPerPage, key, orderBy
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
}
async function openEditDialog(data) {
  await getMember(data.id)
  editDialog.value = true
  formData.id = data.id;
  formData.name = data.name;
  formData.description = data.description
  formData.userId = data.manager ? data.manager.id : null
}

function closeAddDialog() {
  addDialog.value = false;
  editDialog.value = false;
  formData.name = "",
  formData.description = ""
}

async function onCreateClub() {
  try {
    const { valid } = await formAddRef.value.validate();
    if (!valid) return;
    await clubStore.create(formData.name, formData.description);
    closeAddDialog()
    handleSearch();
    toast.success("Thêm CLB thành công")
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
  }
}
async function onUpdateClub() {
  try {
    const { valid } = await formEditRef.value.validate();
    if (!valid) return;
    await clubStore.update(formData.id, formData);
    closeAddDialog()
    handleSearch();
    toast.success("Cập nhật CLB thành công")
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
  }
}


function handleDelete(item) {
  deleteDialogData.value = {
    id: item.id,
    name: item.name
  }
  deleteDialog.value = true;
}

async function deleteClub(id) {
  try {
    const response = await clubStore.delete(id);
    deleteDialog.value = false;
    handleSearch();
    toast.success("Đã giải thể CLB")
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
  }
}

async function getMember(clubId) {
  try {
    const response = await clubStore.getAllMembers(clubId);
    members.value = response.content
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