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

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("licensePlateForm") as HTMLFormElement;
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const licensePlateInput = document.getElementById(
        "licensePlate",
      ) as HTMLInputElement;
      const licensePlate = licensePlateInput.value
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();
      try {
        const carDetails = await lookupCar(licensePlate);
        // Store car details in sessionStorage
        sessionStorage.setItem("carDetails", JSON.stringify(carDetails));
        // Redirect to the car details page
        window.location.href = "/car-details.html";
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to retrieve car details. Please try again later.");
      }
    });
  } else {
    console.error("Form is not found in the DOM.");
  }
});
