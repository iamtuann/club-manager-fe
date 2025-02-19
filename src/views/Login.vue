<template>
  <div class="wrapper flex-center">
    <VCard rounded="lg" elevation="12" class="card-form" >
      <VCardText class="px-5">
        <div class="logo text-center my-6">
          <h2>Đăng nhập</h2>
        </div>
        <VForm ref="loginForm" class="pb-3 pt-4" @submit.prevent="handleLogin">
          <div>
            <v-text-field label="Tài khoản"
              type="text"
              v-model="loginInfo.username"
              :rules="[isRequired('Tài khoản')]"
              :hide-details="false"
            ></v-text-field>
          </div>

          <div class="mt-2">
            <v-text-field
              label="Mật khẩu"
              :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="visible ? 'text' : 'password'"
              :rules="[isRequired('Mật khẩu')]"
              v-model="loginInfo.password"
              variant="outlined"
              @click:append-inner="visible = !visible"
              :hide-details="false"
            ></v-text-field>
          </div>
          <div class="text-error mt-1" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          <div class="mt-2">
            <router-link class="text-primary align-self-center" :to="{name: 'Login'}">Quên mật khẩu?</router-link>
          </div>

          <VBtn height="48" class="w-100 mt-6" type="submit">Đăng nhập</VBtn>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { isRequired } from "@/utils/validationRules";
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores";
import { useRouter } from "vue-router";

const loginForm = ref(null);
const visible = ref(false);
const errorMessage = ref(null);
const authStore = useAuthStore();
const router = useRouter();
const loginInfo = reactive({
  username: "",
  password: ""
});

async function handleLogin() {
  try {
    const { valid } = await loginForm.value.validate();
    if (valid) {
      errorMessage.value = "";
      const response = await authStore.login(loginInfo);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      router.push({name: "Events"});
    }
  } catch (error) {
    errorMessage.value = error.response.data.message;
  }
}

</script>

<style scoped>
.wrapper {
  width: 100%;
  min-height: 100vh;
  padding: 24px;
  background-color: #ddd;
  position: relative;
}

.wrapper::before {
  content: "";
  background-image: url("../assets/images/bg-01.jpg");
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  opacity: 0.6;
}

.card-form {
  width: 100%;
  max-width: 450px;
}

.logo {
  object-fit: contain;
  height: 80px;
}

.logo img {
  height: 100%;
  width: auto;
}
</style>