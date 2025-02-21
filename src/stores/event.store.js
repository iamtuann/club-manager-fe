import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useEventStore = defineStore("useEventStore", {
  state: () => ({
    
  }),
  actions: {
    async searchEvent(name, pageIndex) {
      const response = await ApiService.get("/events", {
        params: {
          name, pageIndex
        }
      });
      return response.data;
    },
    async getEventsOfMember(memberId, pageIndex) {
      const response = await ApiService.get(`/events/of-member/${memberId}`, {
        params: {
          pageIndex
        }
      });
      return response.data;
    },
  }
})