const { createApp, ref, computed } = Vue;

// Malt data: colour is given in EBC, swatch is an approximate hex colour
const malts = [
  { name: "Pilsner Malt", category: "base", ebc: "3–4", swatch: "#f3e2a0",
    flavor: "Light, clean, slightly grainy and sweet.",
    use: "Pilsners, lagers, Belgian ales." },
  { name: "Pale Ale Malt", category: "base", ebc: "5–7", swatch: "#e9c96e",
    flavor: "Biscuity, a bit fuller than pilsner malt.",
    use: "Pale ales, IPAs, bitters." },
  { name: "Munich Malt", category: "base", ebc: "15–25", swatch: "#d29a3e",
    flavor: "Rich, malty, bready.",
    use: "Märzen, bock, dunkel." },
  { name: "Vienna Malt", category: "base", ebc: "6–10", swatch: "#e2b45a",
    flavor: "Toasty with a light nuttiness.",
    use: "Vienna lager, Märzen." },
  { name: "Crystal / Caramel", category: "specialty", ebc: "30–300", swatch: "#b8661f",
    flavor: "Caramel, toffee, dried fruit.",
    use: "Amber ales, bitters, adds body and sweetness." },
  { name: "Biscuit Malt", category: "specialty", ebc: "45–60", swatch: "#b97a34",
    flavor: "Toasted bread, biscuit, crackers.",
    use: "Brown ales, English ales." },
  { name: "Chocolate Malt", category: "roasted", ebc: "900–1200", swatch: "#4a2a14",
    flavor: "Cocoa, coffee, roasty.",
    use: "Porters, stouts, brown ales." },
  { name: "Roasted Barley", category: "roasted", ebc: "1000–1500", swatch: "#24140a",
    flavor: "Sharp, dry, espresso-like roast.",
    use: "Irish dry stout." },
];

const quiz = [
  { q: "What is the Latin name of barley?",
    options: ["Triticum aestivum", "Hordeum vulgare", "Avena sativa", "Secale cereale"],
    answer: 1 },
  { q: "Which step of malting stops germination?",
    options: ["Steeping", "Mashing", "Kilning", "Lautering"],
    answer: 2 },
  { q: "What is the sugary liquid made from mashed malt called?",
    options: ["Wort", "Must", "Mead", "Brine"],
    answer: 0 },
  { q: "Which malt is typical for an Irish dry stout?",
    options: ["Pilsner malt", "Vienna malt", "Roasted barley", "Munich malt"],
    answer: 2 },
  { q: "Why are barley husks useful in brewing?",
    options: ["They add alcohol", "They act as a natural filter", "They add bitterness", "They feed the yeast"],
    answer: 1 },
];

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
    // Mobile nav toggle
    const navOpen = ref(false);

    // Malt grid with filtering
    const filter = ref("all");
    const filteredMalts = computed(() =>
      filter.value === "all" ? malts : malts.filter((m) => m.category === filter.value)
    );

    // Quiz
    const current = ref(0);
    const score = ref(0);
    const selected = ref(null);
    const finished = ref(false);
    const question = computed(() => quiz[current.value]);

    const feedback = computed(() => {
      if (selected.value === null) return "";
      const item = question.value;
      return selected.value === item.answer
        ? "Correct! 🍺"
        : `Not quite. The answer is "${item.options[item.answer]}".`;
    });

    function answer(i) {
      selected.value = i;
      if (i === question.value.answer) score.value++;
    }

    function next() {
      selected.value = null;
      if (current.value < quiz.length - 1) current.value++;
      else finished.value = true;
    }

    function restart() {
      current.value = 0;
      score.value = 0;
      selected.value = null;
      finished.value = false;
    }

    return {
      navLinks, barleyVarieties, maltingSteps, brewingSteps, filters, quiz,
      navOpen, filter, filteredMalts,
      current, score, selected, finished, question, feedback,
      answer, next, restart,
    };
  },
}).mount("#app");
