<template>
  <PageComponent>
    <template v-slot:header>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ route.params.id ? model.title : "Create a Form" }}
        </h1>

        <div class="flex">
          <TButton link :href="`/`" target="_blank" class="mr-2">
            
            Home
          </TButton>
          <TButton
            v-if="model.id"
            link
            :href="`/publicShow/${model.id}`"
            target="_blank"
            class="mr-2"
          >
            <ExternalLinkIcon class="w-5 h-5" />
            Preview
          </TButton>
          <TButton v-if="route.params.id" color="red" @click="deleteSurvey()">
            <TrashIcon class="w-5 h-5 mr-2" />
            Delete
          </TButton>
        </div>
      </div>
    </template>
    <div v-if="surveyLoading" class="flex justify-center">Loading...</div>
    <form v-else @submit.prevent="saveSurvey" class="animate-fade-in-down">
      <div class="shadow sm:rounded-md sm:overflow-hidden">
        <!--  Fields -->
        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700"
              >Form Title</label
            >
            <input
              type="text"
              name="title"
              id="title"
              v-model="model.title"
              autocomplete="survey_title"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <!--/ Title -->
        </div>
        <!--/ Survey Fields -->

        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <h3 class="text-2xl font-semibold flex items-center justify-between">
            Forms

            <!-- Add new question -->
            <button
              type="button"
              @click="addQuestion()"
              class="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
            >
              <plus-icon />
              Add Properties
            </button>
            <!--/ Add new question -->
          </h3>
          <div v-if="!model.questions.length" class="text-center text-gray-600">
            You don't have any Properties
          </div>
          <div v-for="(question, index) in model.questions" :key="question.id">
            <QuestionEditor
              :question="question"
              :index="index"
              @change="questionChange"
              @addQuestion="addQuestion"
              @deleteQuestion="deleteQuestion"
            />
          </div>
        </div>

        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <TButton>
            <SaveIcon class="w-5 h-5 mr-2" />
            {{ isLoading ? "loading..." : route.params.id ? "update" : "save" }}
          </TButton>
        </div>
      </div>
    </form>
  </PageComponent>
</template>

<script setup>
import { ExternalLinkIcon, SaveIcon } from "@heroicons/vue/solid";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { v4 as uuidv4 } from "uuid";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageComponent from "../components/PageComponent.vue";
import TButton from "../components/core/TButton.vue";
import QuestionEditor from "../components/editor/QuestionEditor.vue";
import PlusIcon from "../components/icons/PlusIcon.vue";
import store from "../store";

const router = useRouter();
const route = useRoute();

// Get survey loading state, which only changes when we fetch survey from backend
const surveyLoading = computed(() => store.state.currentSurvey.loading);
const isLoading = ref(false);
// Create empty survey
let model = ref({
  title: "",
  slug: "",
  status: false,
  description: null,
  image: null,
  image_url: null,
  expire_date: null,
  questions: [],
});

// Watch to current survey data change and when this happens we update local model
watch(
  () => store.state.currentSurvey.data,
  (newVal, oldVal) => {
    model.value = {
      ...JSON.parse(JSON.stringify(newVal)),
      status: !!newVal.status,
    };
  }
);

// If the current component is rendered on survey update route we make a request to fetch survey
if (route.params.id) {
  store.dispatch("getSurvey", route.params.id);
}

function addQuestion(index) {
  const newQuestion = {
    id: uuidv4(),
    type: "text",
    label: "",
    description: null,
    data: {},
  };

  model.value.questions.splice(index, 0, newQuestion);
}

function deleteQuestion(question) {
  model.value.questions = model.value.questions.filter((q) => q !== question);
}

function questionChange(question) {
  if (question.data.options) {
    question.data.options = [...question.data.options];
  }
  model.value.questions = model.value.questions.map((q) => {
    if (q.id === question.id) {
      return JSON.parse(JSON.stringify(question));
    }
    return q;
  });
}

/**
 * Create or update survey
 */
function saveSurvey() {
  isLoading.value = true;
  let action = "created";
  if (model.value.id) {
    action = "updated";
  }
  store.dispatch("saveSurvey", { ...model.value }).then(({ data }) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: "success",
      title: "Form " + action + " successfull",
    });
    isLoading.value = false;
    router.push({
      name: "formViewiew",
      params: { id: data.data.id },
    });
  });
}

function deleteSurvey() {
  if (
    confirm(
      `Are you sure you want to delete this Form? Operation can't be undone!!`
    )
  ) {
    store.dispatch("deleteSurvey", model.value.id).then(() => {
      router.push({
        name: "formList",
      });
    });
  }
}
</script>

<style></style>
