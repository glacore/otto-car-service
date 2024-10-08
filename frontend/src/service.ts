import "./main.css";

  // Accordion functionality
const accordionButtons = document.querySelectorAll("[data-accordion-target]");
accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(
      button.getAttribute("data-accordion-target") || "",) as HTMLElement;
      const expanded = button.getAttribute("aria-expanded") === "true";
      const icon = button.querySelector("[data-accordion-icon]") as HTMLElement;
      button.setAttribute("aria-expanded", (!expanded).toString());
      if (expanded) {
        target.style.maxHeight = "0";
        icon.style.transform = "rotate(0deg)";
      } else {
        target.style.maxHeight = `${target.scrollHeight}px`;
        icon.style.transform = "rotate(180deg)";
      }
    });
  });
