const defChoose = document.querySelector("select");
const defDisplay = document.querySelector("p");

defChoose.addEventListener("change", () => {
  const definition = defChoose.value;
  updateDisplay(definition);
});

function updateDisplay(def) {
  def = def.replace(" ", "").toLowerCase();
  const url = `../definitions/${def}.txt`;

  // Call `fetch()`, passing in the URL.
  fetch(url)
    // fetch() returns a promise. When we have received a response from the server,
    // the promise's `then()` handler is called with the response.
    .then((response) => {
      // Our handler throws an error if the request did not succeed.
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      // Otherwise (if the response succeeded), our handler fetches the response
      // as text by calling response.text(), and immediately returns the promise
      // returned by `response.text()`.
      return response.text();
    })
    // When response.text() has succeeded, the `then()` handler is called with
    // the text, and we copy it into the `poemDisplay` box.
    .then((text) => {
      defDisplay.textContent = text;
    })
    // Catch any errors that might happen, and display a message
    // in the `poemDisplay` box.
    .catch((error) => {
      defDisplay.textContent = `Could not fetch definition: ${error}`;
    });
}

updateDisplay("async");
defChoose.value = "async";
