const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currcode in countryList) {
    let newoption = document.createElement("option");
    newoption.innerText = currcode;
    newoption.value = currcode;

    if (select.name === "from" && currcode === "USD") {
      newoption.selected = "selected";
    } else if (select.name === "to" && currcode === "INR") {
      newoption.selected = "selected";
    }

    select.append(newoption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag when currency changes
const updateFlag = (Element) => {
  let currcode = Element.value;
  let countrycode = countryList[currcode];
  // switched to flagcdn for reliability
  let newsrc = `https://flagcdn.com/64x48/${countrycode.toLowerCase()}.png`;
  let img = Element.parentElement.querySelector("img");
  img.src = newsrc;
};

// Conversion logic
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  let amount = document.querySelector(".amount input");
  let amtval = amount.value;

  if (amtval === "" || amtval < 1) {
    amtval = 1;
    amount.value = "1";
  }

  try {
    // Build URL dynamically based on selected "from" currency
    const BASE_URL = `https://v6.exchangerate-api.com/v6/90a59af8c3dffd976ad51640/latest/${fromcurr.value}`;
    let response = await fetch(BASE_URL);
    let data = await response.json();

    // Get conversion rate for "to" currency
    let rate = data.conversion_rates[tocurr.value];
    let finalAmount = (amtval * rate).toFixed(2);

    document.querySelector(".result").innerText =
      `${amtval} ${fromcurr.value} = ${finalAmount} ${tocurr.value}`;
  } catch (error) {
    console.error("Error fetching data:", error);
    document.querySelector(".result").innerText =
      "Unable to fetch exchange rate. Please try again.";
  }
});