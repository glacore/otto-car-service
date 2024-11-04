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
  const summaryTotal = document.getElementById("summary-total") as HTMLElement;
  const appointmentForm = document.querySelector('form') as HTMLFormElement;
  appointmentForm.addEventListener('submit', handleAppointmentSubmission);

  let currentAcquisitionType: string = "";
  let currentServices: string[] = [];
  let servicePrices: ServicePrice[] = [];

  let selectedDate: Date | null = null;
  let selectedTime: string | null = null;

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
        servicesHtml += `<li class="flex w-full justify-between">${service}<span class="font-semibold">€${Number(servicePrice.price).toFixed(2)}</span></li>`;
        total += Number(servicePrice.price);
      }
    });

    if (summaryServices) {
      summaryServices.innerHTML = servicesHtml;
    }
    if (summaryTotal) {
      summaryTotal.textContent = `€${total.toFixed(2)}`;
    }
  }

  const datepickerEl = document.getElementById(
    "datepicker",
  ) as HTMLInputElement;
  const summaryTimeEl = document.getElementById("summary-time") as HTMLElement;
  const timeButtonsContainer = document.querySelector(".ms-0") as HTMLElement;

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


    function updateSelectedTime(time: string | null) {
      selectedTime = time;
      updateSummaryTime();
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
        updateSelectedTime(target.textContent?.trim() || null);
        highlightSelectedTimeButton(target);
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
        "/assets/logo-placeholder";
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

  async function handleAppointmentSubmission(event: Event) {
    event.preventDefault();

    const licensePlate = (document.getElementById('licensePlate') as HTMLElement).textContent?.trim() || '';
    const acquisitionType = currentAcquisitionType.trim();
    const mileage = (document.getElementById('mileage-input') as HTMLInputElement).value.trim();
    const services = currentServices;
    const comments = (document.getElementById('comments') as HTMLTextAreaElement).value.trim();
    const fullName = (document.getElementById('fullName') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const phoneNumber = (document.getElementById('phoneNum') as HTMLInputElement).value.trim();
    const privacyAccepted = (document.getElementById('remember') as HTMLInputElement).checked;

    const errors = [];

    if (!licensePlate) errors.push("License plate is required");
    if (!acquisitionType) errors.push("Acquisition type is required");
    if (!mileage) errors.push("Mileage is required");
    if (services.length === 0) errors.push("At least one service must be selected");
    if (!fullName) errors.push("Full name is required");
    if (!email) errors.push("Email is required");
    if (!phoneNumber) errors.push("Phone number is required");
    if (!selectedDate) errors.push("Appointment date is required");
    if (!selectedTime) errors.push("Appointment time is required");
    if (!privacyAccepted) errors.push("You must accept the privacy policy");

    if (errors.length > 0) {
      displayErrors({ message: "Please correct the following errors:", errors });
      return;
    }

    const appointmentDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
    const appointmentTime = selectedTime || '';
    const totalPrice = parseFloat(summaryTotal.textContent?.replace('€', '') || '0');

    const appointmentDetails = {
      licensePlate,
      acquisitionType,
      mileage: parseInt(mileage),
      services,
      comments,
      fullName,
      email,
      phoneNumber,
      appointmentDate,
      appointmentTime,
      totalPrice,
      privacyAccepted,
    };

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentDetails),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(result));
      }

      if (result && result.id) {
        console.log('Appointment created:', result);
        window.location.href = `/car-details-success.html?uuid=${result.id}`;
      } else {
        throw new Error('No appointment ID returned from server');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          displayErrors(errorData);
        } catch {
          displayErrors({ message: error.message });
        }
      } else {
        displayErrors({ message: 'An unknown error occurred' });
      }
    }
  }

  function displayErrors(errorData: any) {
    const errorContainer = document.getElementById('error-container');
    if (!errorContainer) return;

    errorContainer.innerHTML = '';
    errorContainer.classList.remove('hidden');

    const errorTitle = document.createElement('p');
    errorTitle.textContent = errorData.message;
    errorTitle.className = 'font-bold';
    errorContainer.appendChild(errorTitle);

    if (Array.isArray(errorData.errors)) {
      const errorList = document.createElement('ul');
      errorList.className = 'list-disc pl-5 mt-2';
      errorData.errors.forEach((error: any) => {
        const errorItem = document.createElement('li');
        if (typeof error === 'object' && error !== null) {
          errorItem.textContent = `${error.property}: ${Object.values(error.constraints).join(', ')}`;
        } else {
          errorItem.textContent = error.toString();
        }
        errorList.appendChild(errorItem);
      });
      errorContainer.appendChild(errorList);
    }

    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const modalLicensePlateForm = document.getElementById('modalLicensePlateForm') as HTMLFormElement;
  if (modalLicensePlateForm) {
    modalLicensePlateForm.addEventListener('submit', handleLicensePlateSubmit);
  }

  function handleLicensePlateSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const licensePlateInput = form.querySelector('input[name="modalLicensePlate"]') as HTMLInputElement | null;
    
    if (!licensePlateInput) {
      console.error('License plate input not found');
      alert('An error occurred. Please try again.');
      return;
    }

    const licensePlate = licensePlateInput.value.trim().toUpperCase();

    if (licensePlate) {
      fetchCarDetails(licensePlate);
    } else {
      alert('Please enter a valid license plate.');
    }
  }

  async function fetchCarDetails(licensePlate: string) {
    try {
      const response = await fetch(`/api/lookup/${licensePlate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch car details');
      }
      const carDetails = await response.json();
      sessionStorage.setItem('carDetails', JSON.stringify(carDetails));
      window.location.href = '/car-details.html';
    } catch (error) {
      console.error('Error fetching car details:', error);
      alert('Error fetching car details. Please try again.');
    }
  }

});
