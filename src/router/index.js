import { createRouter, createWebHistory, RouterView } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import ClubLayout from "@/layouts/ClubLayout.vue";
import {h, render} from 'vue'
import { jwtDecode  } from "jwt-decode";
import { ROLE_MANAGER } from "@/constant";
import { useAuthStore } from "@/stores";

const routes = [
  {
    path: "",
    alias: "/",
    name: 'Events',
    component: () => import('@/views/events/List.vue'),
    meta: { 
      layout: DefaultLayout,
      requiredAuth: true
    }
  },
  {
    path: "/clubs",
    name: 'Clubs',
    component: () => import('@/views/clubs/List.vue'),
    meta: { 
      layout: DefaultLayout,
      requiredAuth: true,
    }
  },
  {
    path: "/clubs/:id",
    meta: { 
      layout: ClubLayout,
      requiredAuth: true,
    },
    children: [
      {
        path: "",
        name: 'ClubInfo',
        component: () => import('@/views/clubs/ClubInfo.vue'),
        meta: { 
          
        }
      },
      {
        path: "members",
        name: 'ClubMembers',
        component: () => import('@/views/clubs/ClubMembers.vue'),
        meta: { 
          
        }
      },
      {
        path: "boards",
        name: 'ClubBoards',
        component: () => import('@/views/clubs/ClubBoards.vue'),
        meta: { 
          
        }
      },
      {
        path: "events",
        name: 'ClubEvents',
        component: () => import('@/views/clubs/ClubEvents.vue'),
        meta: { 
          
        }
      },
      {
        path: "events/create",
        name: 'CreateEvent',
        component: () => import('@/views/clubs/CreateUpdateEvent.vue'),
        meta: { 
        }
      },
      {
        path: "events/:eventId/update",
        name: 'UpdateEvent',
        component: () => import('@/views/clubs/CreateUpdateEvent.vue'),
        meta: { 
        }
      },
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue")
  },
  {
    path: "/access-denied",
    name: "AccessDenied",
    component: () => import("@/views/AccessDenied.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => { 
  const token = localStorage.getItem("token");
  if (token && typeof token === 'string') {
    try {
      const roles = useAuthStore().getRole();
      if (to.path === "/login" && useAuthStore().isAuth()) {
        next({name: 'Events'})
      } else if (to.meta?.requiredAuth && to.meta?.roles && !to.meta?.roles.some(role => roles.includes(role))) {
        next({name: 'AccessDenied'})
      } else if (to.meta.requiredAuth && !useAuthStore().isAuth()) {
        next({name: 'Login'})
      } else {
        next()
      }
    } catch (error) {
      next()
    }
  } else {
    if (to.meta.requiredAuth) {
      next({ name: 'Login' });
    } else {
      next();
    }
  }
});

export default router;