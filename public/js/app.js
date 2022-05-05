function filterSkills(event) {
  const search = event.target.value || "";
  const skillElts = [...document.getElementsByClassName("skill")];
  const searchLow = search.toLocaleLowerCase();
  if (!searchLow?.length) {
    skillElts.forEach((skillElt) => skillElt.classList.remove("hidden"));
  } else {
    for (const skillElt of skillElts) {
      const name = skillElt.dataset.name;
      const tags = [...skillElt.getElementsByClassName("tag")].map((tagElt) =>
        tagElt.innerText.toLocaleLowerCase()
      );
      if (
        !name.toLocaleLowerCase().includes(searchLow) &&
        !tags.some((tag) => tag.includes(searchLow))
      ) {
        skillElt.classList.add("hidden");
      } else {
        skillElt.classList.remove("hidden");
      }
    }
  }
}
function filterExperiences(event) {
  const search = event.target.value || "";
  const experienceElts = [...document.getElementsByClassName("experience")];
  const searchLow = search.toLocaleLowerCase();
  if (!experienceElts?.length) {
    experienceElts.forEach((experienceElt) =>
      experienceElt.classList.remove("hidden")
    );
  } else {
    for (const experienceElt of experienceElts) {
      const name = experienceElt.dataset.name;
      const listDescriptionElt = experienceElt.querySelectorAll("li");

      const descriptions = [...listDescriptionElt].map((elt) =>
        elt.innerText.toLocaleLowerCase()
      );
      if (
        !name.toLocaleLowerCase().includes(searchLow) &&
        !descriptions.some((desc) => desc.includes(searchLow))
      ) {
        experienceElt.classList.add("hidden");
      } else {
        experienceElt.classList.remove("hidden");
      }
    }
  }
}

function displayImageGallery(event) {
  event.preventDefault();
  const url = event.target.dataset.url;
  const gallery = document.getElementById("gallery");
  const galleryDetail = document.getElementById("galleryDetail");

  const img = document.createElement("img");
  img.src = url;
  img.width = 768;
  img.classList.add("m-auto");
  img.classList.add("h-full");
  const container = galleryDetail.firstElementChild;
  [...container.children].forEach((n) => container.removeChild(n));
  container.appendChild(img);

  gallery.classList.add("hidden");
  galleryDetail.classList.remove("hidden");
}

window.onload= ()=>
  [...document.getElementsByClassName("noJs")].forEach(needJsElt => {
    needJsElt.classList.remove('hidden');
  });