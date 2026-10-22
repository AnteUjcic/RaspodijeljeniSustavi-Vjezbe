const { createApp, ref, computed, watch, onMounted } = Vue;

// Same origin when served by the backend; fall back to a local server when index.html is opened as a file
const API_BASE = location.protocol === "file:" ? "http://localhost:3000" : "";

async function api(path, options) {
  const res = await fetch(API_BASE + "/api" + path, options);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

const navLinks = [
  { href: "#about", label: "About Barley" },
  { href: "#malting", label: "Malting" },
  { href: "#malts", label: "Malt Types" },
  { href: "#brewing", label: "Brewing" },
  { href: "#quiz", label: "Quiz" },
];

const barleyVarieties = [
  { name: "2-row barley",
    text: "Two rows of kernels on each head. Plumper grains, more starch and a lower protein content. Favoured for European-style and craft beers." },
  { name: "6-row barley",
    text: "Six rows of kernels per head. Smaller grains, more husk and higher enzyme power, which is useful when brewing with adjuncts like corn or rice." },
];

const maltingSteps = [
  { title: "Steeping", text: "Grain is soaked in water for 1–2 days until it reaches about 45% moisture and starts to wake up." },
  { title: "Germination", text: "The moist grain sprouts for 4–5 days. Enzymes break down cell walls and proteins, making the starch accessible." },
  { title: "Kilning", text: "Hot air dries the grain and stops germination. Kiln temperature and time decide the malt's colour and flavour." },
  { title: "Cleaning", text: "Rootlets are removed and the finished malt is stored, ready to be milled by the brewer." },
];

// text may contain trusted inline HTML (rendered with v-html)
const brewingSteps = [
  { title: "Milling", text: "Malt is crushed to expose the starchy interior while keeping the husks mostly whole." },
  { title: "Mashing", text: "Crushed malt is mixed with hot water (around 62–72 °C). Enzymes convert starch into fermentable sugars." },
  { title: "Lautering", text: "The sweet liquid, called <em>wort</em>, is separated from the grain. Barley husks form the filter bed." },
  { title: "Boiling", text: "Wort is boiled with hops for bitterness and aroma, and to sterilise it." },
  { title: "Fermentation", text: "Yeast eats the barley sugars, producing alcohol and CO₂. This takes about one to three weeks." },
  { title: "Conditioning", text: "Beer matures, clears and carbonates before packaging. Cheers!" },
];

const filters = [
  { value: "all", label: "All" },
  { value: "base", label: "Base" },
  { value: "specialty", label: "Specialty" },
  { value: "roasted", label: "Roasted" },
];

createApp({
  setup() {
    const error = ref("");

    // Mobile nav toggle
    const navOpen = ref(false);

    // Malt grid, filtered on the server
    const filter = ref("all");
    const malts = ref([]);

    async function loadMalts() {
      try {
        malts.value = await api(`/malts?category=${filter.value}`);
      } catch (e) {
        error.value = "Could not load data from the server.";
      }
    }
    watch(filter, loadMalts);

    // Quiz, answers are checked by the server
    const quiz = ref([]);
    const current = ref(0);
    const score = ref(0);
    const selected = ref(null);
    const result = ref(null); // { correct, answer } from the server
    const finished = ref(false);
    const question = computed(() => quiz.value[current.value]);

    async function loadQuiz() {
      try {
        quiz.value = await api("/quiz");
      } catch (e) {
        error.value = "Could not load data from the server.";
      }
    }

    const feedback = computed(() => {
      if (!result.value) return "";
      return result.value.correct
        ? "Correct! 🍺"
        : `Not quite. The answer is "${question.value.options[result.value.answer]}".`;
    });

    async function answer(i) {
      selected.value = i;
      try {
        result.value = await api(`/quiz/${question.value.id}/answer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ choice: i }),
        });
        if (result.value.correct) score.value++;
      } catch (e) {
        selected.value = null;
        error.value = "Could not check the answer, please try again.";
      }
    }

    function next() {
      selected.value = null;
      result.value = null;
      if (current.value < quiz.value.length - 1) current.value++;
      else finished.value = true;
    }

    function restart() {
      current.value = 0;
      score.value = 0;
      selected.value = null;
      result.value = null;
      finished.value = false;
    }

    onMounted(() => {
      loadMalts();
      loadQuiz();
    });

    return {
      navLinks, barleyVarieties, maltingSteps, brewingSteps, filters,
      error, navOpen, filter, malts,
      quiz, current, score, selected, result, finished, question, feedback,
      answer, next, restart,
    };
  },
}).mount("#app");
