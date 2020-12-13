const categories = document.querySelectorAll(".category__label");

const openCategoryContent = (category) => {
  const categoryContent = category.querySelector(".category__content");
  const childHeight = categoryContent.firstElementChild.clientHeight;
  categoryContent.style.height = 
    `calc(${childHeight}px * ${categoryContent.childElementCount})`;
}

const closeCategoryContent = (category) => {
  category
    .querySelector(".category__content")
    .style.height = "0px";
}

categories.forEach((categoryLabel) => {
  categoryLabel.addEventListener("click", () => {
    const lastCategory = document.querySelector(".category.on");
    const category = categoryLabel.parentNode;
    category.firstElementChild.clientHeight;
    if (lastCategory) {
      closeCategoryContent(lastCategory);

      if (lastCategory.id === category.id)
        return lastCategory.classList.remove("on");
      lastCategory.classList.remove("on");
    }

    category.classList.add("on");
    openCategoryContent(category);
  });
});
