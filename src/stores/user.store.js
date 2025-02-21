import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useUserStore = defineStore("useUserStore", {
  state: () => ({
    
  }),
  actions: {
    async search(name, pageIndex, pageSize, key, orderBy) {
      const response = await ApiService.get("/users", {
        params: {
          name, pageIndex, pageSize, key, orderBy
        }
      });
      return response.data;
    },
    async getById(id) {
      const response = await ApiService.get("/users/"+id);
      return response.data;
    },
    async create(newUser) {
      const response = await ApiService.post("/auth/register", newUser);
      return response.data;
    },
    async delete(id) {
      const response = await ApiService.delete("/users/"+id);
      return response.data;
    },
    async getUsersNotInClub(clubId) {
      const response = await ApiService.get("/users/not-in-club/" + clubId);
      return response.data;
    },
  }
})