<template>
  <div>
    <v-card class="">
      <v-card-item>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>
            Danh sách ban
          </v-card-title>
          <v-btn append-icon="mdi-plus" @click="openAddDialog">
            Thêm
          </v-btn>
        </div>
      </v-card-item>
      <v-card-item>
        <v-data-table-server
          hover
          :items-per-page="dataTable.itemsPerPage"
          :headers="dataTable.headers"
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
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-btn size="x-small" icon color="info" @click="openEditDialog(item)">
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
                <v-toolbar color="error" title="Xoá ban"></v-toolbar>
                <v-card-text>
                  <p>Bạn có chắc chắn muốn xoá ban"<b> {{ deleteDialogData.name }}</b>"?
                  </p>
                </v-card-text>
                <v-card-actions class="mb-2">
                  <v-spacer></v-spacer>
                  <v-btn variant="elevated" color="grey-200" @click="deleteDialog = false">
                    Hủy bỏ
                  </v-btn>
                  <v-btn variant="elevated" color="error" @click="deleteBoard(deleteDialogData.id)">
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
      <v-form ref="formAddRef">
        <v-dialog v-model="addDialog" persistent width="800">
          <v-card>
            <v-toolbar title="Thêm ban"></v-toolbar>
            <v-card-text>
              <v-col cols="12">
                <v-text-field
                  label="Tên ban"
                  density="comfortable"
                  v-model="formData.name"
                  :rules="[isRequired('Tên')]"
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
              <v-btn variant="elevated" color="primary" @click="onCreateBoard">
                Thêm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
      <v-form ref="formEditRef">
        <v-dialog v-model="editDialog" persistent width="800">
          <v-card>
            <v-toolbar title="Cập nhật ban"></v-toolbar>
            <v-card-text>
              <v-col cols="12">
                <v-text-field
                  label="Tên ban"
                  density="comfortable"
                  v-model="formData.name"
                  :rules="[isRequired('Tên')]"
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
              <v-btn variant="elevated" color="primary" @click="onUpdateBoard">
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
import { useClubStore } from "@/stores";
import { isRequired } from "@/utils";
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

const clubStore = useClubStore();
const route = useRoute()
const toast = useToast()

const deleteDialog = ref(false);
const deleteDialogData = ref(null);

const formAddRef = ref(null)
const addDialog = ref(false)
const formData = reactive({
  id: "",
  name: "",
  description: ""
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
    {title: "Mô tả", key: "description", align: "center", sortable: false},
    {title: "", key: "actions", sortable: false},
  ],
  items: [],
  pageIndex: 1,
})

function handleSearch() {
  if (dataTable.pageIndex != 1) {
    dataTable.pageIndex = 1;
  } else {
    getData()
  }
}

async function getData() {
  dataTable.loading = true;
  try {
    const response = await clubStore.getBoards(route.params.id);
    dataTable.items = response;
    dataTable.totalItems = response.length;
  } catch (e) {
    console.error(e);
  } finally {
    dataTable.loading = false;
  }
}

function openAddDialog() {
  addDialog.value = true
}
function openEditDialog(data) {
  editDialog.value = true
  formData.id = data.id;
  formData.name = data.name;
  formData.description = data.description
}

function closeAddDialog() {
  addDialog.value = false;
  editDialog.value = false;
  formData.name = "",
  formData.description = ""
}

async function onCreateBoard() {
  try {
    const { valid } = await formAddRef.value.validate();
    if (!valid) return;
    await clubStore.createBoard(route.params.id, formData.name, formData.description);
    closeAddDialog()
    handleSearch();
    toast.success("Thêm ban thành công")
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
  }
}
async function onUpdateBoard() {
  try {
    const { valid } = await formEditRef.value.validate();
    if (!valid) return;
    await clubStore.updateBoard(route.params.id, formData.id, formData.name, formData.description);
    closeAddDialog()
    handleSearch();
    toast.success("Cập nhật ban thành công")
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

async function deleteBoard(id) {
  try {
    const response = await clubStore.deleteBoard(route.params.id, id);
    deleteDialog.value = false;
    handleSearch();
    toast.success("Xoá ban thành công")
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