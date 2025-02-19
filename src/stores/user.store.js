import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useUserStore = defineStore("useUserStore", {
  state: () => ({
    
  }),
  actions: {
    async getUsersNotInClub(clubId) {
      const response = await ApiService.get("/users/not-in-club/" + clubId);
      return response.data;
    },
  }
})