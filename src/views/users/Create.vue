<template>
  <v-container v-if="notFound" class="mt-3 d-flex justify-center">
    <div class="pa-3 rounded-lg">
      Tài khoản không tồn tại với id: {{ route.params.id }}
    </div>
  </v-container>
  <v-container v-else>
    <h2 class="py-3">Thêm tài khoản mới</h2>
    <v-form @submit.prevent="submitForm" ref="formRef">
      <v-row class="mt-5">
        <v-col cols="12" sm="6">
          <v-text-field
            label="Username"
            density="comfortable"
            v-model="formUser.username"
            :rules="[isRequired('Username')]"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Mật khẩu"
            density="comfortable"
            v-model="formUser.password"
            :rules="[isRequired('Mật khẩu')]"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Họ"
            density="comfortable"
            v-model="formUser.firstName"
            :rules="[isRequired('Họ')]"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Tên"
            density="comfortable"
            v-model="formUser.lastName"
            :rules="[isRequired('Tên')]"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Email"
            density="comfortable"
            v-model="formUser.email"
            :rules="[isRequired('Email')]"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Số điện thoại"
            density="comfortable"
            v-model="formUser.phone"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Mã sinh viên"
            density="comfortable"
            v-model="formUser.code"
            :rules="[isRequired('Mã sinh viên')]"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Ngành"
            density="comfortable"
            v-model="formUser.major"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="formUser.roleIds"
            :items="roles"
            label="Vai trò"
            density="comfortable"
            item-value="id"
            item-title="name"
            clearable
            multiple
            :return-object="false"
            :rules="[(v) => v.length != 0 || 'Vui lòng chọn vai trò']"
          ></v-select>
        </v-col>

        <v-col cols="12" class="d-flex justify-center ga-3 mt-4">
          <v-btn color="error" variant="tonal" class="opacity-90">
            Quay lại
          </v-btn>
          <v-btn type="submit">
            Lưu
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { isRequired } from "@/utils";
import { useUserStore } from "@/stores";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const toast = useToast();
const router = useRouter();
const formRef = ref(null);
const notFound = ref(false);

const roles = [
  {id: 1, name: "Quản lý cấp cao"},
  {id: 3, name: "Người dùng"},
]

const formUser = ref({
  username: "",
  password: "",
  email: "",
  firstName: "",
  lastName: "",
  code: "",
  phone: "",
  major: "",
  roleIds: []
});

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    const response = await userStore.create(formUser.value);
    toast.success("Thêm tài khoản mới thành công");
    router.replace({name: "Users"});
  } catch (error) {
    console.error(error);
    toast.error(error?.response.data.message);
  }
}

</script>

<style scoped>

</style>