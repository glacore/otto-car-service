document.addEventListener("DOMContentLoaded", () => {
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