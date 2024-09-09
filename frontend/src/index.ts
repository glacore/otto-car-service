import "./main.css";

export interface CarDetails {
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  fuelType: string;
  seats: number;
  engineCapacity: number;
  cylinders: number;
  firstRegistrationDate: string;
}

async function lookupCar(licensePlate: string): Promise<CarDetails> {
  const response = await fetch(`/api/lookup/${licensePlate}`);
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  // Existing code for license plate form
  const form = document.getElementById("licensePlateForm") as HTMLFormElement;
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const licensePlateInput = document.getElementById(
        "licensePlate",
      ) as HTMLInputElement;
      const licensePlate = licensePlateInput.value
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();
      try {
        const carDetails = await lookupCar(licensePlate);
        sessionStorage.setItem("carDetails", JSON.stringify(carDetails));
        window.location.href = "/car-details.html";
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to retrieve car details. Please try again later.");
      }
    });
  } else {
    console.error("Form is not found in the DOM.");
  }

  // Service slider functionality
  const serviceSlider = document.getElementById(
    "service-slider",
  ) as HTMLElement;
  const serviceItems = document.getElementById("service-items") as HTMLElement;
  const prevBtn = document.getElementById("prevBtn") as HTMLElement;
  const nextBtn = document.getElementById("nextBtn") as HTMLElement;

  const cloneItems = (): void => {
    const items = Array.from(serviceItems.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      serviceItems.appendChild(clone);
    });
  };

  const scrollToMiddle = (): void => {
    const middlePosition =
      serviceItems.scrollWidth / 2 - serviceSlider.clientWidth / 2;
    serviceSlider.scrollLeft = middlePosition;
  };

  cloneItems();
  scrollToMiddle();

  serviceSlider.addEventListener("scroll", () => {
    const maxScrollLeft = serviceItems.scrollWidth - serviceSlider.clientWidth;
    if (serviceSlider.scrollLeft === 0) {
      serviceSlider.scrollLeft = maxScrollLeft / 2;
    } else if (serviceSlider.scrollLeft >= maxScrollLeft) {
      serviceSlider.scrollLeft = maxScrollLeft / 2;
    }
  });

  const scrollNext = (): void => {
    serviceSlider.scrollBy({ left: 200, behavior: "smooth" });
  };

  const scrollPrev = (): void => {
    serviceSlider.scrollBy({ left: -200, behavior: "smooth" });
  };

  nextBtn.addEventListener("click", scrollNext);
  prevBtn.addEventListener("click", scrollPrev);

  // Navbar toggle functionality
  const toggleButton = document.querySelector(
    "[data-collapse-toggle]",
  ) as HTMLElement;
  const navbarMenu = document.getElementById(
    "navbar-cta-mobile",
  ) as HTMLElement;

  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", (!isExpanded).toString());
    navbarMenu.classList.toggle("hidden");
  });

  // Accordion functionality
  const accordionButtons = document.querySelectorAll("[data-accordion-target]");
  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(
        button.getAttribute("data-accordion-target") || "",
      ) as HTMLElement;
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
});
