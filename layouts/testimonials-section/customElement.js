class TestimonialSection extends HTMLElement {
  constructor() {
    super();

    const content = this.textContent;

    const { title, name, photo, color } = this.props;

    this.innerHTML = '';

    this.classList.add('testimonial');
    this.classList.add(`testimonial--${color}`);

    this.insertAdjacentHTML(
      'beforeend',
      `
      <div class="testimonial__user">
        <a href="#">
          <img
            class="user__photo"
            src="${photo}"
            alt="User photo"
          />
          <div class="user__info">
            <h1>${name}</h1>
            <p>Verified Graduate</p>
          </div>
        </a>
      </div>

      <h2 class="testimonial__tittle">
        ${title}
      </h2>

      <blockquote class="testimonial__comment">
        <p>
          ${content}
        </p>
      </blockquote>
    `
    );
  }

  get props() {
    const data = Object.assign({}, this.dataset);
    Object.keys(data).forEach(key => this.removeAttribute(`data-${key}`));

    return data;
  }
}

customElements.define('testimonial-section', TestimonialSection);
