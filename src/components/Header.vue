<template>
  <div class="header-container">
    <v-spacer></v-spacer>
    
    <VBadge v-bind="avatarBadgeProps">
      <VAvatar style="cursor: pointer;" color="primary" variant="tonal">
        <v-icon icon="mdi-account-circle"></v-icon>
        <VMenu activator="parent" width="230" location="bottom end" offset="14px">
          <VList>
            <VListItem>
              <template #prepend>
                <VListItemAction start>
                  <VBadge v-bind="avatarBadgeProps">
                    <VAvatar color="primary" size="40" variant="tonal">
                      <v-icon icon="mdi-account-circle"></v-icon>
                    </VAvatar>
                  </VBadge>
                </VListItemAction>
              </template>
              <VListItemTitle class="font-weight-semibold">
                {{ fullname }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ role }}
              </VListItemSubtitle>
            </VListItem>
            
            <VDivider class="my-2" />

            <VListItem link :to="{name: 'Events'}">
              <template #prepend>
                <VIcon class="me-2" icon="mdi-account-outline" size="22" />
              </template>
              <VListItemTitle>Tài khoản</VListItemTitle>
            </VListItem>

            <VDivider class="my-2" />

            <VListItem @click="logout">
              <template #prepend>
                <VIcon class="me-2" icon="mdi-logout-variant" size="22" />
              </template>
              <VListItemTitle>Đăng xuất</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </VAvatar>
    </VBadge>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import { useAuthStore } from "@/stores";

const authStore = useAuthStore()
const avatarBadgeProps = {
  dot: true,
  location: 'bottom right',
  offsetX: 3,
  offsetY: 3,
  color: 'success',
  bordered: true,
};

const items = reactive([]);

const fullname = authStore.getFullname();
const role = authStore.getDisplayRole();


const logout = () => {
  authStore.logout();
}

</script>
<style scoped>
.header-container {
  height: 64px;
  display: flex;
  align-items: center;
  width: 100%;
}
.profile-item {
  color: rgb(var(--v-theme-on-background));
}
</style>
<style>
#header-theme-btn .v-icon {
  transition: all 0.6s ease-out;
}
</style>
