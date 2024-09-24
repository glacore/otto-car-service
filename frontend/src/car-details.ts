import "./main.css";
import { Datepicker } from 'flowbite';
import type { DatepickerOptions, DatepickerInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';


// import { Modal } from 'flowbite'
// import type { ModalOptions, ModalInterface } from 'flowbite'

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
  const carDetailsElement = document.getElementById("carDetails");
  if (!carDetailsElement) {
    console.error("Car details element not found");
    return;
  }

  const carDetailsJSON = sessionStorage.getItem("carDetails");

  if (carDetailsJSON) {
    try {
      const carDetails: CarDetails = JSON.parse(carDetailsJSON);
      displayCarDetails(carDetails, carDetailsElement);
    } catch (error) {
      console.error("Error parsing car details:", error);
      carDetailsElement.innerHTML =
        "<p>Error loading car details. Please try again.</p>";
    }
  } else {
    carDetailsElement.innerHTML =
      "<p>No car details available. Please go back and enter a license plate.</p>";
  }
});

function displayCarDetails(data: CarDetails, element: HTMLElement): void {
  element.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">Car Information</h2>
    <p><strong>License Plate:</strong> ${data.licensePlate}</p>
    <p><strong>Brand:</strong> ${data.brand}</p>
    <p><strong>Model:</strong> ${data.model}</p>
    <p><strong>Color:</strong> ${data.color}</p>
    <p><strong>Fuel Type:</strong> ${data.fuelType}</p>
    <p><strong>Seats:</strong> ${data.seats}</p>
    <p><strong>Engine Capacity:</strong> ${data.engineCapacity}</p>
    <p><strong>Cylinders:</strong> ${data.cylinders}</p>
    <p><strong>First Registration Date:</strong> ${data.firstRegistrationDate}</p>
  `;
}


