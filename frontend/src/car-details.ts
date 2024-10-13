import "./main.css";
import 'flowbite'
import { Datepicker } from "flowbite";
import type { DatepickerOptions, DatepickerInterface } from "flowbite";
import type { InstanceOptions } from "flowbite";

interface CarDetails {
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

interface ServicePrice {
  name: string;
  price: number;
}

document.addEventListener("DOMContentLoaded", function () {
  const carTitleElement = document.getElementById(
    "carTitle",
  ) as HTMLHeadingElement;
  const licensePlateElement = document.getElementById(
    "licensePlate",
  ) as HTMLHeadingElement;
  const fuelTypeElement = document.getElementById(
    "fuelType",
  ) as HTMLSpanElement;
  const colorElement = document.getElementById("color") as HTMLSpanElement;
  const yearElement = document.getElementById("year") as HTMLSpanElement;
  const registrationDateElement = document.getElementById(
    "registrationDate",
  ) as HTMLSpanElement;
  const carImageElement = document.getElementById(
    "carImage",
  ) as HTMLImageElement;
  const summaryElement = document.getElementById("summary") as HTMLDivElement;

  const acquisitionTypeInputs = document.querySelectorAll<HTMLInputElement>(
    'input[name="acquisition_type"]',
  );
  const serviceInputs = document.querySelectorAll<HTMLInputElement>(
    'input[name="services"]',
  );
  const summaryAcquisitionType = document.getElementById(
    "summary-acquisition-type",
  ) as HTMLElement;
  const summaryServices = document.getElementById(
    "summary-services",
  ) as HTMLElement;
  const summaryTime = document.getElementById("summary-time") as HTMLElement;
  const summaryTotal = document.getElementById("summary-total") as HTMLElement;

  let currentAcquisitionType: string = "";
  let currentServices: string[] = [];
  let servicePrices: ServicePrice[] = [];

  if (
    carTitleElement &&
    licensePlateElement &&
    fuelTypeElement &&
    colorElement &&
    yearElement &&
    registrationDateElement &&
    carImageElement &&
    summaryElement
  ) {
    const carDetailsJSON = sessionStorage.getItem("carDetails");

    if (carDetailsJSON) {
      try {
        const carDetails: CarDetails = JSON.parse(carDetailsJSON);
        displayCarDetails(
          carDetails,
          carTitleElement,
          licensePlateElement,
          fuelTypeElement,
          colorElement,
          yearElement,
          registrationDateElement,
          carImageElement,
        );
      } catch (error) {
        console.error("Error parsing car details:", error);
        alert("Error loading car details. Please try again.");
      }
    } else {
      alert(
        "No car details available. Please go back and enter a license plate.",
      );
    }
  }

  acquisitionTypeInputs.forEach((input) => {
    input.addEventListener("change", handleAcquisitionTypeChange);
  });

  serviceInputs.forEach((input) => {
    input.addEventListener("change", handleServiceChange);
  });

  async function handleAcquisitionTypeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    currentAcquisitionType = target.value;
    summaryAcquisitionType.textContent = currentAcquisitionType;
    await fetchServicePrices();
    updateSummary();
  }

  function handleServiceChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      currentServices.push(target.value);
    } else {
      currentServices = currentServices.filter(
        (service) => service !== target.value,
      );
    }
    updateSummary();
  }

  async function fetchServicePrices() {
    try {
      const response = await fetch(
        `/api/services/${currentAcquisitionType || "lease"}`,
      );
      if (!response.ok) {
        const text = await response.text();
        console.error("Server response:", text);
        throw new Error(
          `Failed to fetch service prices. Status: ${response.status}`,
        );
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        servicePrices = await response.json();
        updateSummary();
      } else {
        console.error("Response is not JSON:", await response.text());
        throw new Error("Response is not JSON");
      }
    } catch (error) {
      console.error("Error fetching service prices:", error);
      // Optionally set default prices here
    }
  }

  function updateSummary() {
    let servicesHtml = "";
    let total = 0;

    currentServices.forEach((service) => {
      const servicePrice = servicePrices.find((sp) => sp.name === service);
      if (servicePrice) {
        servicesHtml += `<li class="flex w-full justify-between">${service}<span class="font-semibold">$${Number(servicePrice.price).toFixed(2)}</span></li>`;
        total += Number(servicePrice.price);
      }
    });

    if (summaryServices) {
      summaryServices.innerHTML = servicesHtml;
    }
    if (summaryTotal) {
      summaryTotal.textContent = `$${total.toFixed(2)}`;
    }
  }

  const datepickerEl = document.getElementById(
    "datepicker",
  ) as HTMLInputElement;
  const summaryTimeEl = document.getElementById("summary-time") as HTMLElement;
  const timeButtonsContainer = document.querySelector(
    ".sm\\:ms-7",
  ) as HTMLElement;

  if (datepickerEl && summaryTimeEl && timeButtonsContainer) {
    const options: DatepickerOptions = {
      defaultDatepickerId: null,
      autohide: true,
      format: "dd-mm-yyyy",
      maxDate: null,
      minDate: null,
      orientation: "bottom",
      buttons: false,
      autoSelectToday: 0,
      title: null,
      rangePicker: false,
      onShow: () => {},
      onHide: () => {},
    };

    const datepicker: DatepickerInterface = new Datepicker(
      datepickerEl,
      options,
    );

    let selectedDate: Date | null = null;
    let selectedTime: string | null = null;
    let selectedTimeButton: HTMLElement | null = null;

    // Function to update the summary time
    function updateSummaryTime() {
      if (selectedDate && selectedTime) {
        const formattedDate = selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        summaryTimeEl.textContent = `${formattedDate}, ${selectedTime}`;
      } else if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        summaryTimeEl.textContent = formattedDate;
      } else {
        summaryTimeEl.textContent = "Please select a date and time";
      }
    }

    // Function to highlight selected time button
    function highlightSelectedTimeButton(button: HTMLElement) {
      // Remove highlight from previously selected button
      if (selectedTimeButton) {
        selectedTimeButton.classList.remove(
          "bg-white",
          "text-primary",
          "border-primary",
        );
        selectedTimeButton.classList.add("bg-glass100", "border-gray-200");
      }

      // Highlight the newly selected button
      button.classList.remove("bg-glass100", "border-gray-200");
      button.classList.add("bg-white", "text-primary", "border-primary");
      selectedTimeButton = button;
    }

    // Event listener for date change
    datepickerEl.addEventListener("changeDate", (e: Event) => {
      selectedDate = (e as CustomEvent).detail.date as Date;
      updateSummaryTime();
    });

    // Event listener for time button clicks
    timeButtonsContainer.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        selectedTime = target.textContent?.trim() || null;
        highlightSelectedTimeButton(target);
        updateSummaryTime();
      }
    });

    // Initialize with today's date
    selectedDate = new Date();
    updateSummaryTime();
  } else {
    console.error(
      "Datepicker element, summary time element, or time buttons container not found",
    );
  }

  function displayCarDetails(
    data: CarDetails,
    titleElement: HTMLHeadingElement,
    licensePlateElement: HTMLHeadingElement,
    fuelTypeElement: HTMLSpanElement,
    colorElement: HTMLSpanElement,
    yearElement: HTMLSpanElement,
    registrationDateElement: HTMLSpanElement,
    imageElement: HTMLImageElement,
  ): void {
    titleElement.textContent = `${data.brand}, ${data.model}`;
    licensePlateElement.textContent = data.licensePlate;
    fuelTypeElement.innerHTML = `<i class="ph ph-gas-pump text-3xl text-secondary1000"></i>${data.fuelType}`;
    colorElement.innerHTML = `<i class="ph ph-palette text-3xl text-secondary1000"></i>${data.color}`;
    yearElement.innerHTML = `<i class="ph ph-factory text-3xl text-secondary1000"></i>${new Date(
      data.firstRegistrationDate,
    )
      .getFullYear()
      .toString()}`;
    registrationDateElement.innerHTML = `<i class="ph ph-files text-3xl text-secondary1000"></i>${formatDate(data.firstRegistrationDate)}`;

    const imagePath = `/assets/logo-${data.brand.toLowerCase()}.svg`;
    imageElement.src = imagePath;
    imageElement.alt = `${data.brand} ${data.model}`;

    imageElement.onerror = () => {
      imageElement.src =
        "https://images.dealer.com/ddc/vehicles/2024/Audi/A8/Sedan/perspective/front-left/2024_24.png";
      imageElement.alt = "Default Car Image";
    };
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
});
