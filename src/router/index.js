import { createRouter, createWebHistory } from "vue-router";
import FormPage from '../views/FormPage.vue';
import FormPublic from '../views/FormPublicView.vue';
import FormList from '../views/FormList.vue'
const routes = [
  {
   path: "/",
   component: FormList,
   name: "formList"
  },
  {
   path: "/createForm",
   component: FormPage,
   name: "formPageCreate"
  },
  {
   path: "/view/:id",
   component: FormPage,
   name: "formViewiew"
  },
  {
   path: "/publicShow/:slug",
   component: FormPublic,
   name: "form-public"
  },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router;
