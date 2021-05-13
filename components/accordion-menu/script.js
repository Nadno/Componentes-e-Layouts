const categories = document.querySelectorAll('.category__label');

const addToggleMenuCategoryEvent = category =>
  category.addEventListener('click', () => {
    const lastCategory = document.querySelector('.category.on');
    const currentCategory = category.parentNode;
    currentCategory.firstElementChild.clientHeight;

    if (lastCategory) {
      if (lastCategory.id === currentCategory.id)
        return lastCategory.classList.remove('on');
      lastCategory.classList.remove('on');
    }

    currentCategory.classList.add('on');
  });

categories.forEach(addToggleMenuCategoryEvent);
