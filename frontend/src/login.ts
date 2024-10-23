import "./main.css";
import 'flowbite';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form') as HTMLFormElement;
  loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const email = (form.querySelector('#email') as HTMLInputElement).value;
  const password = (form.querySelector('#password') as HTMLInputElement).value;

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('adminToken', data.token);
    window.location.href = '/appointments.html';
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please check your credentials and try again.');
  }
}
