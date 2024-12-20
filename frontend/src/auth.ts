import { jwtDecode } from 'jwt-decode';

export function isAdminLoggedIn(): boolean {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;

  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch (error) {
    return false;
  }
}

export function redirectIfNotAdmin() {
  if (!isAdminLoggedIn()) {
    window.location.href = '/login.html';
  }
}
