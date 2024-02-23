const defChoose = document.querySelector("select");
const defDisplay = document.querySelector("p");

defChoose.addEventListener("change", async () => {
  const definition = defChoose.value;
  await updateDisplay(definition);
});

async function updateDisplay(def) {
  def = def.replace(" ", "").toLowerCase();
  const url = `../definitions/${def}.txt`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const text = await response.text();
    defDisplay.textContent = text;
  } catch (error) {
    defDisplay.textContent = `Could not fetch definition: ${error}`;
  }
}

updateDisplay("async");
defChoose.value = "async";
