// Malt data: colour is given in EBC, swatch is an approximate hex colour
const malts = [
  { id: 1, name: "Pilsner Malt", category: "base", ebc: "3–4", swatch: "#f3e2a0",
    flavor: "Light, clean, slightly grainy and sweet.",
    use: "Pilsners, lagers, Belgian ales." },
  { id: 2, name: "Pale Ale Malt", category: "base", ebc: "5–7", swatch: "#e9c96e",
    flavor: "Biscuity, a bit fuller than pilsner malt.",
    use: "Pale ales, IPAs, bitters." },
  { id: 3, name: "Munich Malt", category: "base", ebc: "15–25", swatch: "#d29a3e",
    flavor: "Rich, malty, bready.",
    use: "Märzen, bock, dunkel." },
  { id: 4, name: "Vienna Malt", category: "base", ebc: "6–10", swatch: "#e2b45a",
    flavor: "Toasty with a light nuttiness.",
    use: "Vienna lager, Märzen." },
  { id: 5, name: "Crystal / Caramel", category: "specialty", ebc: "30–300", swatch: "#b8661f",
    flavor: "Caramel, toffee, dried fruit.",
    use: "Amber ales, bitters, adds body and sweetness." },
  { id: 6, name: "Biscuit Malt", category: "specialty", ebc: "45–60", swatch: "#b97a34",
    flavor: "Toasted bread, biscuit, crackers.",
    use: "Brown ales, English ales." },
  { id: 7, name: "Chocolate Malt", category: "roasted", ebc: "900–1200", swatch: "#4a2a14",
    flavor: "Cocoa, coffee, roasty.",
    use: "Porters, stouts, brown ales." },
  { id: 8, name: "Roasted Barley", category: "roasted", ebc: "1000–1500", swatch: "#24140a",
    flavor: "Sharp, dry, espresso-like roast.",
    use: "Irish dry stout." },
];

// `answer` is the index of the correct option; it is never sent to the client
const quiz = [
  { id: 1, q: "What is the Latin name of barley?",
    options: ["Triticum aestivum", "Hordeum vulgare", "Avena sativa", "Secale cereale"],
    answer: 1 },
  { id: 2, q: "Which step of malting stops germination?",
    options: ["Steeping", "Mashing", "Kilning", "Lautering"],
    answer: 2 },
  { id: 3, q: "What is the sugary liquid made from mashed malt called?",
    options: ["Wort", "Must", "Mead", "Brine"],
    answer: 0 },
  { id: 4, q: "Which malt is typical for an Irish dry stout?",
    options: ["Pilsner malt", "Vienna malt", "Roasted barley", "Munich malt"],
    answer: 2 },
  { id: 5, q: "Why are barley husks useful in brewing?",
    options: ["They add alcohol", "They act as a natural filter", "They add bitterness", "They feed the yeast"],
    answer: 1 },
];

module.exports = { malts, quiz };
