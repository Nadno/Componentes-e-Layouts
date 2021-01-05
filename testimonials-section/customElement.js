class TestimonialSection extends HTMLElement {
  constructor() {
    super();
    const title = this.getAttribute("testimonial-title");
    const name = this.getAttribute("user-name");
    const image = this.getAttribute("photo");
    const color = this.getAttribute("color");
    const content = this.textContent;

    this.removeAttribute("testimonial-title");
    this.removeAttribute("user-name");
    this.removeAttribute("photo");
    this.removeAttribute("color");
    

    this.innerHTML = "";
    

    this.classList.add("testimonial");
    this.classList.add(`testimonial--${color}`);

    this.insertAdjacentHTML("afterbegin", `
      <div class="testimonial__user">
        <a href="#">
          <img
            class="user__photo"
            src="${image}"
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
    `);
  }
}

customElements.define("testimonial-section", TestimonialSection);