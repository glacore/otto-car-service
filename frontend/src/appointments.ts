import 'flowbite';
import "./main.css";
import { Datepicker } from 'flowbite';
import { redirectIfNotAdmin } from './auth.js';
import flatpickr from "flatpickr/dist/flatpickr.js"

// Add this at the top of the file, after any imports
interface AppointmentDetails {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  acquisitionType: string;
  mileage: number;
  services: string[];
  comments: string;
  appointmentDate: string;
  appointmentTime: string;
  licensePlate: string;
}

interface Appointment {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  acquisition_type: string;
  mileage: number;
  services: string[];
  comments: string;
  appointment_date: string;
  appointment_time: string;
  licensePlate: string;
}

let allAppointments: Appointment[] = [];
let totalAppointments: number = 0;
let currentPage: number = 1;
const appointmentsPerPage: number = 10;

let modalElement: HTMLElement | null = null;

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM content loaded');
  redirectIfNotAdmin();

  try {
    console.log('Loading initial page');
    await loadPage(1);
    setupSearchFunctionality();
  } catch (error) {
    console.error('Error initializing appointments page:', error);
  }

  // Add event listeners for time buttons
  const timeButtons = document.querySelectorAll('.time-button');
  timeButtons.forEach(button => {
    button.addEventListener('click', () => {
      timeButtons.forEach(btn => btn.classList.remove('bg-primary', 'text-white'));
      button.classList.add('bg-primary', 'text-white');
    });
  });

  const closeModalButton = document.getElementById('close-modal-button');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
  }

  // Add event listener for clicking outside the modal to close it
  modalElement = document.getElementById('crud-modal');
  if (modalElement) {
    modalElement.addEventListener('click', (event) => {
      if (event.target === modalElement) {
        closeModal();
      }
    });
  }

  // Add event listener for the Escape key to close the modal
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
});

async function fetchAppointments(page: number = 1): Promise<{ appointments: Appointment[], total: number }> {
  try {
    const response = await fetch(`/api/appointments?page=${page}&limit=${appointmentsPerPage}`);
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    const data = await response.json();
    console.log('Fetched appointments:', data);
    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

function displayAppointments(appointments: Appointment[]) {
  console.log('Displaying appointments:', appointments);
  if (!appointments || appointments.length === 0) {
    console.log('No appointments to display');
    const tableBody = document.querySelector('tbody');
    if (tableBody) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No appointments found</td></tr>';
    }
    return;
  }

  const tableBody = document.querySelector('tbody');
  if (!tableBody) {
    console.error('Table body not found');
    return;
  }

  tableBody.innerHTML = '';

  appointments.forEach(appointment => {
    const row = document.createElement('tr');
    row.className = 'bg-white border-b hover:bg-neutrals00';
    row.innerHTML = `
      <td class="w-4 p-4">
        <div class="flex items-center">
          <input id="checkbox-table-${appointment.id}" type="checkbox" class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary">
          <label for="checkbox-table-${appointment.id}" class="sr-only">checkbox</label>
        </div>
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center text-gray-900">
          <div class="ps-3">
            <div class="text-base font-semibold">${appointment.full_name}</div>
            <div class="font-normal text-gray-500">${appointment.email}</div>
            <div class="font-normal text-gray-500">${appointment.phone_number}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4">
        ${appointment.acquisition_type} | ${appointment.mileage} KM
      </td>
      <td class="px-6 py-4">
        ${appointment.services.join(', ')} | ${appointment.comments || 'No comments'}
      </td>
      <td class="px-6 py-4">
        ${new Date(appointment.appointment_date).toLocaleDateString()} <span>${appointment.appointment_time}</span>
      </td>
      <td class="px-6 py-4">
        <button data-modal-target="crud-modal" data-modal-toggle="crud-modal" class="font-medium text-primary hover:underline duration-200 edit-appointment" type="button" data-id="${appointment.id}">
          Edit Appointment
        </button>
      </td>
    `;
    tableBody.appendChild(row);

    // Add event listener to the edit button
    const editButton = row.querySelector('.edit-appointment');
    if (editButton) {
      editButton.addEventListener('click', (event) => {
        console.log('Edit button clicked', appointment);
        openEditModal(appointment);
      });
    }
  });

  updatePagination();
}

function updatePagination() {
  console.log('Updating pagination, total appointments:', totalAppointments);
  const totalPages = Math.ceil(totalAppointments / appointmentsPerPage);
  const paginationContainer = document.getElementById('pagination-container');
  if (!paginationContainer) {
    console.error('Pagination container not found');
    return;
  }

  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i.toString();
    pageButton.classList.add('px-3', 'py-1', 'border', 'rounded', 'mr-2');
    if (i === currentPage) {
      pageButton.classList.add('bg-primary', 'text-white');
    }
    pageButton.addEventListener('click', () => loadPage(i));
    paginationContainer.appendChild(pageButton);
  }
}

async function loadPage(page: number) {
  try {
    currentPage = page;
    const data = await fetchAppointments(page);
    console.log('Fetched data:', data);
    if (data && Array.isArray(data)) {
      allAppointments = data;
      totalAppointments = data.length;
    } else if (data && typeof data === 'object' && Array.isArray(data.appointments)) {
      allAppointments = data.appointments;
      totalAppointments = data.total || data.appointments.length;
    } else {
      console.error('Unexpected data structure:', data);
      allAppointments = [];
      totalAppointments = 0;
    }
    console.log('Loaded appointments:', allAppointments);
    console.log('Total appointments:', totalAppointments);
    displayAppointments(allAppointments);
    updatePagination();
  } catch (error) {
    console.error('Error loading page:', error);
  }
}

function setupSearchFunctionality() {
  const searchInput = document.getElementById('table-search-users') as HTMLInputElement;
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredAppointments = allAppointments.filter(appointment => 
      appointment.full_name.toLowerCase().includes(searchTerm) ||
      appointment.email.toLowerCase().includes(searchTerm) ||
      appointment.phone_number.toLowerCase().includes(searchTerm)
    );
    displayAppointments(filteredAppointments);
  });
}

function openEditModal(appointment: Appointment) {
  console.log('Opening modal for appointment:', appointment);
  openModal();

  // Populate the modal fields with appointment details
  const nameInput = document.getElementById('name') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const phoneNumInput = document.getElementById('phoneNum') as HTMLInputElement;
  const acquisitionTypeSelect = document.getElementById('acquisitionType') as HTMLSelectElement;
  const mileageInput = document.getElementById('mileage') as HTMLInputElement;
  const servicesSelect = document.getElementById('services') as HTMLSelectElement;
  const commentsTextarea = document.getElementById('comments') as HTMLTextAreaElement;

  if (nameInput) nameInput.value = appointment.full_name;
  if (emailInput) emailInput.value = appointment.email;
  if (phoneNumInput) phoneNumInput.value = appointment.phone_number;
  if (mileageInput) mileageInput.value = appointment.mileage.toString();
  if (commentsTextarea) commentsTextarea.value = appointment.comments;

  // Populate acquisition type options and select the correct one
  if (acquisitionTypeSelect) {
    const acquisitionTypes = ['Personal', 'Business', 'Lease'];
    acquisitionTypeSelect.innerHTML = acquisitionTypes.map(type => 
      `<option value="${type}" ${type === appointment.acquisition_type ? 'selected' : ''}>${type}</option>`
    ).join('');
  }

  // Populate services options and select the correct ones
  if (servicesSelect) {
    const allServices = ['Detailing', 'Purchase Inspection', 'Consultation'];
    servicesSelect.innerHTML = allServices.map(service => 
      `<option value="${service}" ${appointment.services.includes(service) ? 'selected' : ''}>${service}</option>`
    ).join('');
  }

  // Set the appointment date
  const datepicker = document.getElementById('datepicker') as HTMLInputElement;
  if (datepicker) {
    flatpickr(datepicker, {
      dateFormat: "Y-m-d",
      defaultDate: appointment.appointment_date
    });
  }

  // Set the appointment time
  const timeButtonsContainer = document.getElementById('time-buttons');
  if (timeButtonsContainer) {
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'];
    timeButtonsContainer.innerHTML = timeSlots.map(time => 
      `<button type="button" class="time-button px-3 py-1 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-200 ${time === appointment.appointment_time ? 'bg-primary text-primary' : ''}">${time}</button>`
    ).join('');

    // Add event listeners to time buttons
    const timeButtons = timeButtonsContainer.querySelectorAll('.time-button');
    timeButtons.forEach(button => {
      button.addEventListener('click', () => {
        timeButtons.forEach(btn => btn.classList.remove('bg-primary', 'text-primary'));
        button.classList.add('bg-primary', 'text-primary');
      });
    });
  }

  // Add event listener to the save changes button
  const form = document.getElementById('edit-appointment-form');
  if (form) {
    form.addEventListener('submit', (event) => handleSaveChanges(event, appointment));
  }
}

async function handleSaveChanges(event: Event, appointment: Appointment) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const updatedAppointment: Partial<AppointmentDetails> = {
    id: appointment.id,
    fullName: formData.get('name') as string,
    email: formData.get('email') as string,
    phoneNumber: formData.get('phoneNum') as string,
    acquisitionType: formData.get('acquisitionType') as string,
    mileage: parseInt(formData.get('mileage') as string),
    services: formData.getAll('services') as string[],
    comments: formData.get('comments') as string,
    appointmentDate: formData.get('datepicker') as string,
    appointmentTime: (document.querySelector('.time-button.bg-primary') as HTMLButtonElement)?.textContent || '',
    licensePlate: appointment.licensePlate, // Add this line
  };

  try {
    console.log('Sending updated appointment:', updatedAppointment);
    const response = await fetch(`/api/appointments/${updatedAppointment.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAppointment),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update appointment: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const updatedData = await response.json();
    console.log('Appointment updated:', updatedData);

    // Update the appointment in the allAppointments array
    const index = allAppointments.findIndex(a => a.id === updatedData.id);
    if (index !== -1) {
      allAppointments[index] = updatedData;
    }

    displayAppointments(allAppointments);
    closeModal();
  } catch (error: unknown) {
    console.error('Error updating appointment:', error);
    if (error instanceof Error) {
      alert(`Error updating appointment: ${error.message}`);
    } else {
      alert('An unknown error occurred while updating the appointment');
    }
  }
}

function openModal() {
  modalElement = document.getElementById('crud-modal');
  if (modalElement) {
    modalElement.classList.remove('hidden');
    modalElement.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }
}

function closeModal() {
  if (modalElement) {
    modalElement.classList.add('hidden');
    modalElement.classList.remove('flex');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Initial load
loadPage(1);
