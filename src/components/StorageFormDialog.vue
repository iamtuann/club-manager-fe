<template>
  <v-dialog v-model="props.open" persistent width="800" @afterLeave="$emit('afterLeave')">
    <v-card :loading="props.loading" :disabled="props.loading">
      <v-form @submit.prevent="handleSubmit" ref="formRef">
        <v-toolbar color="info" :title="props.title"></v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Tên kho"
                density="comfortable"
                v-model="props.data.name"
                :rules="[isRequired('Tên kho')]"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="mb-2">
          <v-spacer></v-spacer>
          <v-btn variant="elevated" color="grey-200" @click="$emit('closeDialog')">
            Hủy bỏ
          </v-btn>
          <v-btn variant="elevated" color="info" type="submit">
            {{ props.buttonName }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { isRequired } from "@/utils/validationRules";
import { ref } from "vue";
const props = defineProps({
  title: String,
  data: Object,
  open: { type: Boolean, default: false },
  buttonName: String,
  loading: Boolean
})
const emits = defineEmits(["submit", "closeDialog", "afterLeave"]);

const formRef= ref(null);

async function handleSubmit() {
  const { valid } = await formRef.value.validate();
  if (valid) {
    emits('submit');
  }
}
</script>

<style scoped>

</style>