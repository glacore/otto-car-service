document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get('uuid');
  
    if (!uuid) {
      alert('No appointment UUID provided');
      return;
    }
  
    try {
      const response = await fetch(`/api/appointments/${uuid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointment details');
      }
  
      const appointmentDetails = await response.json();
      console.log('Appointment details:', appointmentDetails);
      displayAppointmentDetails(appointmentDetails);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      alert('Failed to load appointment details. Please try again.');
    }
  });
  
  function displayAppointmentDetails(details: any) {
    // Update the HTML elements with the appointment details
    document.getElementById('licensePlate')!.textContent = details.license_plate || 'N/A';
    document.getElementById('acquisitionType')!.textContent = details.acquisition_type || 'N/A';
    document.getElementById('mileage')!.textContent = details.mileage ? details.mileage.toString() : 'N/A';
    document.getElementById('services')!.textContent = Array.isArray(details.services) ? details.services.join(', ') : 'N/A';
    document.getElementById('comments')!.textContent = details.comments || 'N/A';
    document.getElementById('fullName')!.textContent = details.full_name || 'N/A';
    document.getElementById('email')!.textContent = details.email || 'N/A';
    document.getElementById('phoneNumber')!.textContent = details.phone_number || 'N/A';
  
    // Format the appointment date
    const appointmentDate = details.appointment_date ? new Date(details.appointment_date) : null;
    const formattedDate = appointmentDate ? 
      `${appointmentDate.getDate().toString().padStart(2, '0')}-${(appointmentDate.getMonth() + 1).toString().padStart(2, '0')}-${appointmentDate.getFullYear()}` : 
      'N/A';
    document.getElementById('appointmentDate')!.textContent = formattedDate;
  
    document.getElementById('appointmentTime')!.textContent = details.appointment_time || 'N/A';
  
    // Format the price in euros
    document.getElementById('totalPrice')!.textContent = details.total_price ? `€${parseFloat(details.total_price).toFixed(2)}` : 'N/A';
  }

