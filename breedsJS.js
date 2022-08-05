const url = `https://api.thecatapi.com/v1/breeds`;
const api_key = "33a8e2ce-bea6-4a1b-9ad5-8fbecf4be0ec"
const selectElement = document.querySelector('#breed_selector');
const breed_carousel = document.getElementById('breed_carousel');
let storedBreeds = []
let storeImages = []

let selectedBreed = "abys";
const addBreed = document.querySelector("#addbreed");

fetch(url, {
  headers: {
    'x-api-key': api_key
  }
})
  .then((response) => {
    const cats = response.json();
    console.log(cats)
    return cats;

  })
  .then((data) => {

    //filter to only include those with an `image` object
    data = data.filter(img => img.image?.url != null)

    storedBreeds = data;

    for (let i = 0; i < storedBreeds.length; i++) {
      const breed = storedBreeds[i];
      let option = document.createElement('option');

      //skip any breeds that don't have an image
      if (!breed.image) continue

      //use the current array index
      option.value = i;
      option.innerHTML = `${breed.name}`;
      document.getElementById('breed_selector').appendChild(option);
    }

    //show the first breed by default
    showBreed(0)
  })
  .catch(function(error) {
    console.log(error);
  });


//Show first breed 
function showBreed(index) {
  document.getElementById("breed_name").textContent = storedBreeds[index].name;
  document.getElementById("breed_years").textContent = storedBreeds[index].life_span+" years";
  document.getElementById("breed_nameSwiper").textContent = storedBreeds[index].name;
  document.getElementById("breed_nameModal").textContent = storedBreeds[index].name;
  document.getElementById("breed_image").src = storedBreeds[index].image.url;
  document.getElementById("breed_imageModal").src = storedBreeds[index].image.url;
  document.getElementById("breed_json").textContent = storedBreeds[index].temperament
  document.getElementById("learn_more").href = storedBreeds[index].wikipedia_url
  document.getElementById("breed_description").textContent = storedBreeds[index].description
  

  //Dictionary of characteristics
  let ratings = {
    'adaptability': storedBreeds[index].adaptability,
    'affection_level': storedBreeds[index].affection_level,
    'child_friendly': storedBreeds[index].child_friendly,
    'dog_friendly': storedBreeds[index].dog_friendly,
    'energy_level': storedBreeds[index].energy_level,
    'grooming': storedBreeds[index].grooming,
    'health_issues': storedBreeds[index].health_issues,
    'shedding_level': storedBreeds[index].shedding_level,
    'social_needs' : storedBreeds[index].social_needs,
    'intelligence': storedBreeds[index].intelligence,
    'stranger_friendly': storedBreeds[index].stranger_friendly,
    'vocalisation': storedBreeds[index].vocalisation,
  };
  
  //add stars to html
  for (var key in ratings) {
    let value = ratings[key];
    let empty_star = 5-value;
    const characteristics = document.getElementById(key);
    characteristics.replaceChildren();
    //Shaded stars
    for (let i = 0; i < value; i++) {
      const span = document.createElement('span');
      span.classList.add('fa', 'fa-star', 'checked');
     characteristics.appendChild(span);
    }
    //blank stars
    for (let i = 0; i < empty_star; i++) {
      const span = document.createElement('span');
      span.classList.add('fa', 'fa-star');

     characteristics.appendChild(span);
    }
  }

  fetch("https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=" + (storedBreeds[index].id), {
    headers: {
      'x-api-key': api_key
    }
  })
    .then((response) => {
      const slidepics = response.json();
      return slidepics;
    })
    .then((data) => {
      storeImages = data;
      console.log(storeImages)

      for (let i = 0; i < storeImages.length; i++) {

        const img = document.createElement('img');
        img.classList.add('swiper-slide', 'column', 'is-one-third');
        img.src = storeImages[i].url;

        //use the current array index
        img.value = i;

        breed_carousel.appendChild(img);
      }

    })

  breedSlides = storedBreeds[index].id;
  return breedSlides;
}

//Change picture on carousel when breed is changed
selectElement.addEventListener('change', (event) => {
  console.log("Breed Changed")
  breed_carousel.replaceChildren();

  const slidesUrl = 'https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=' + (breedSlides);
  selectedBreed = breedSlides;
  
  fetch(slidesUrl, {
    headers: {
      'x-api-key': api_key
    }
  })
    .then((response) => {
      const slidepics = response.json();
      return slidepics;
    })
    .then((data) => {
      storeImages = data;

      for (let i = 0; i < storeImages.length; i++) {
        const img = document.createElement('img');
        img.classList.add('swiper-slide', 'column', 'is-one-third');
        img.src = storeImages[i].url;

        //use the current array index
        img.value = i;

        breed_carousel.appendChild(img);
      }
    })

});

//Modal
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});

//SwiperJs
//<!-- Initialize Swiper -->
var swiper = new Swiper(".breed", {
  slidesPerView: 3,
  spaceBetween: 30,
  freeMode: true,
  //slidesPerGroup: 3,
  loop: true,
  loopFillGroupWithBlank: false,

  navigation: {
    nextEl: "#righticon",
    prevEl: "#lefticon",
  },
});
//<!-- End Swiper JS-->

addBreed.addEventListener("click", async (e) => {
  const breedURL = 'https://api.thecatapi.com/v1/images/search?breed_ids=' + selectedBreed;
  await fetch(breedURL) 
  .then((response) => response.json())
  .then((breed) => {
    localStorage.setItem("breedImg", breed[0].url);
  });

  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
});