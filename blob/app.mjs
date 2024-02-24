// use fetch to retrieve the images and pass them to init
// report any errors that occur in the fetch operation
// once the images have been successfully loaded and formatted as a JSON object
// using response.json(), run the initialize() function
fetch("images.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((json) => initialize(json))
  .catch((err) => console.error(`Fetch problem: ${err.message}`));

// sets up the app logic, declares required variables, contains all the other functions
function initialize(images) {
  // grab the UI elements that we need to manipulate
  const category = document.querySelector("#category");
  const searchTerm = document.querySelector("#searchTerm");
  const searchBtn = document.querySelector("button");
  const main = document.querySelector("main");

  // keep a record of what the last category and search term entered were
  let lastCategory = category.value;
  // no search has been made yet
  let lastSearch = "";

  // these contain the results of filtering by category, and search term
  // finalGroup will contain the images that need to be displayed after
  // the searching has been done. Each will be an array containing objects.
  // Each object will represent a imageItem
  let categoryGroup;
  let finalGroup;

  // To start with, set finalGroup to equal the entire images database
  // then run updateDisplay(), so ALL images are displayed initially.
  finalGroup = images;
  updateDisplay();

  // Set both to equal an empty array, in time for searches to be run
  categoryGroup = [];
  finalGroup = [];

  // when the search button is clicked, invoke selectCategory() to start
  // a search running to select the category of images we want to display
  searchBtn.addEventListener("click", selectCategory);

  function selectCategory(e) {
    // Use preventDefault() to stop the form submitting — that would ruin
    // the experience
    e.preventDefault();

    // Set these back to empty arrays, to clear out the previous search
    categoryGroup = [];
    finalGroup = [];

    // if the category and search term are the same as they were the last time a
    // search was run, the results will be the same, so there is no point running
    // it again — just return out of the function
    if (
      category.value === lastCategory &&
      searchTerm.value.trim() === lastSearch
    ) {
      return;
    } else {
      // update the record of last category and search term
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      // In this case we want to select all images, then filter them by the search
      // term, so we just set categoryGroup to the entire JSON object, then run selectimages()
      if (category.value === "All") {
        categoryGroup = images;
        selectimages();
        // If a specific category is chosen, we need to filter out the images not in that
        // category, then put the remaining images inside categoryGroup, before running
        // selectimages()
      } else {
        // the values in the <option> elements are uppercase, whereas the categories
        // store in the JSON (under "type") are lowercase. We therefore need to convert
        // to lower case before we do a comparison
        const lowerCaseType = category.value.toLowerCase();
        // Filter categoryGroup to contain only images whose type includes the category
        categoryGroup = images.filter(
          (imageItem) => imageItem.type === lowerCaseType
        );

        // Run selectimages() after the filtering has been done
        selectimages();
      }
    }
  }

  // selectimages() Takes the group of images selected by selectCategory(), and further
  // filters them by the tiered search term (if one has been entered)
  function selectimages() {
    // If no search term has been entered, just make the finalGroup array equal to the categoryGroup
    // array — we don't want to filter the images further.
    if (searchTerm.value.trim() === "") {
      finalGroup = categoryGroup;
    } else {
      // Make sure the search term is converted to lower case before comparison. We've kept the
      // imageItem names all lower case to keep things simple
      const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();

      console.log(lowerCaseSearchTerm);

      // Filter finalGroup to contain only images whose name includes the search term
      finalGroup = categoryGroup.filter((imageItem) =>
        imageItem.name.includes(lowerCaseSearchTerm)
      );
    }
    // Once we have the final group, update the display
    updateDisplay();
  }

  // start the process of updating the display with the new set of images
  function updateDisplay() {
    // remove the previous contents of the <main> element
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    // if no images match the search term, display a "No results to display" message
    if (finalGroup.length === 0) {
      const para = document.createElement("p");
      para.textContent = "No results to display!";
      main.appendChild(para);
      // for each imageItem we want to display, pass its imageItem object to fetchBlob()
    } else {
      for (const imageItem of finalGroup) {
        fetchBlob(imageItem);
      }
    }
  }

  // fetchBlob uses fetch to retrieve the image for that imageItem, and then sends the
  // resulting image display URL and imageItem object on to showProduct() to finally
  // display it
  function fetchBlob(imageItem) {
    // console.log(imageItem.image);
    // construct the URL path to the image file from the imageItem.image property
    const url = `images/${imageItem.image}`;
    //console.log(url);
    // Use fetch to fetch the image, and convert the resulting response to a blob
    // Again, if any errors occur we report them in the console.
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => showProduct(blob, imageItem))
      .catch((err) => console.error(`Fetch problem: ${err.message}`));
  }

  // Display a imageItem inside the <main> element
  function showProduct(blob, imageItem) {
    // Convert the blob to an object URL — this is basically an temporary internal URL
    // that points to an object stored inside the browser
    const objectURL = URL.createObjectURL(blob);

    // console.log(objectURL, imageItem);

    // create <section>, <h2>, <p>, and <img> elements
    const section = document.createElement("section");
    const div = document.createElement("div");
    const heading = document.createElement("h2");
    const para = document.createElement("p");
    const image = document.createElement("img");

    // give the <section> a classname equal to col
    section.setAttribute("class", "col");

    div.setAttribute("class", "card shadow-sm");

    para.setAttribute("class", "card-body");

    para.textContent = imageItem.info;
    // console.log(para.textContent);

    // Give the <h2> textContent equal to the imageItem "name" property, but with the first character
    // replaced with the uppercase version of the first character
    heading.textContent = imageItem.name.replace(
      imageItem.name.charAt(0),
      imageItem.name.charAt(0).toUpperCase()
    );

    // Set the src of the <img> element to the ObjectURL, and the alt to the imageItem "name" property
    image.src = objectURL;
    image.alt = imageItem.name;

    // append the elements to the DOM as appropriate, to add the imageItem to the UI
    main.appendChild(section);
    section.appendChild(div);
    div.appendChild(heading);
    div.appendChild(para);
    div.appendChild(image);
  }
}
