import { UserToken } from '@/api/interfaces/user.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private key = 'token-auth';

  saveToken(authRespueta: UserToken) {
    let data = JSON.stringify(authRespueta);
    localStorage.setItem(this.key, data);
  }

  getToken(): UserToken | null {
    const objetoString = localStorage.getItem(this.key);
    if (objetoString) {
      return JSON.parse(objetoString);
    }
    return null;
  }

  removeToken() {
    localStorage.removeItem(this.key);
  }

  isValidToken() {
    const token = this.getToken()?.token;
    if (!token) {
      return false;
    }
    const today = new Date();
    return new Date(this.getToken()!.expiración).getTime() > today.getTime();
  }

  isTokenRefresh() {
    const token = this.getToken()?.token;
    if (!token) {
      return false;
    }

    let diferanciaEnMilisegundos = Math.floor(
      Math.abs(
        new Date(this.getToken()!.expiración).getTime() - new Date().getTime(),
      ),
    );
    let segundos = Math.floor(diferanciaEnMilisegundos / 1000);
    console.log(segundos);
    return segundos <= 3800;
  }
}
