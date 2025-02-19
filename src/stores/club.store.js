import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useClubStore = defineStore("useClubStore", {
  state: () => ({
    club: {}
  }),
  actions: {
    async search(name, pageIndex, pageSize, key, orderBy) {
      const response = await ApiService.get("/clubs", {
        params: {
          name, pageIndex, pageSize, key, orderBy
        }
      });
      return response.data;
    },
    async getById(id) {
      if (this.club && this.club.id == id) {
        return this.club
      }
      const response = await ApiService.get("/clubs/"+id);
      if (response.status == 200) {
        this.club = response.data
      }
      return response.data;
    },
    async create(name, description) {
      const response = await ApiService.post("/clubs", {
        name, description
      });
      return response.data;
    },
    async update(id, name, description) {
      const response = await ApiService.put("/clubs/" + id, {
        name, description
      });
      return response.data;
    },
    async delete(id) {
      const response = await ApiService.delete("/clubs/"+id);
      return response.data;
    },
    async getBoards(clubId) {
      const response = await ApiService.get("/clubs/"+ clubId + '/boards');
      return response.data;
    },
    async createBoard(clubId, name, description) {
      const response = await ApiService.post("/clubs/"+ clubId + '/boards', {
        name, description
      });
      return response.data;
    },
    async updateBoard(clubId, boardId, name, description) {
      const response = await ApiService.put(`/clubs/${clubId}/boards/${boardId}`, {
        name, description
      });
      return response.data;
    },
    async deleteBoard(clubId, boardId) {
      const response = await ApiService.delete(`/clubs/${clubId}/boards/${boardId}`);
      return response.data;
    },
    async getMembers(clubId, name, pageIndex, pageSize, key, orderBy) {
      const response = await ApiService.get(`/clubs/${clubId}/members`, {
        params: {
          name, pageIndex, pageSize, key, orderBy
        }
      });
      return response.data;
    },
    async addMembers(clubId, listUser) {
      const response = await ApiService.post(`/clubs/${clubId}/members`, {
        userIds: listUser
      });
      return response.data;
    },
    async deleteMember(clubId, memId) {
      const response = await ApiService.delete(`/clubs/${clubId}/members/${memId}`);
      return response.data;
    },
    async getEvents(clubId, name, pageIndex, pageSize, key, orderBy) {
      const response = await ApiService.get(`/clubs/${clubId}/events`, {
        params: {
          name, pageIndex, pageSize, key, orderBy
        }
      });
      return response.data;
    },
  }
})