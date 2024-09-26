import "./main.css";
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

document.addEventListener("DOMContentLoaded", function () {
  const carTitleElement = document.getElementById("carTitle");
  const licensePlateElement = document.getElementById("licensePlate");
  const fuelTypeElement = document.getElementById("fuelType");
  const colorElement = document.getElementById("color");
  const yearElement = document.getElementById("year");
  const registrationDateElement = document.getElementById("registrationDate");
  const carImageElement = document.getElementById(
    "carImage",
  ) as HTMLImageElement;

  if (
    !carTitleElement ||
    !licensePlateElement ||
    !fuelTypeElement ||
    !colorElement ||
    !yearElement ||
    !registrationDateElement ||
    !carImageElement
  ) {
    console.error("One or more required elements not found");
    return;
  }

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
});

function displayCarDetails(
  data: CarDetails,
  titleElement: HTMLElement,
  licensePlateElement: HTMLElement,
  fuelTypeElement: HTMLElement,
  colorElement: HTMLElement,
  yearElement: HTMLElement,
  registrationDateElement: HTMLElement,
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

  // Set car image (you may want to implement a more sophisticated image selection logic)
  const imagePath = `/assets/logo-${data.brand.toLowerCase()}.svg`;
  console.log(imagePath);
  imageElement.src = imagePath;
  imageElement.alt = `${data.brand} ${data.model}`;

  // If the image doesn't exist, fall back to a default image
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
