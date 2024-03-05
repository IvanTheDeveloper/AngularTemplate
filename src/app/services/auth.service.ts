import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Auth, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly COOKIE_KEY = 'my_auth_token';

  constructor(private cookieService: CookieService, private auth: Auth) { }

  updateCookieToken() {
    const currentUser = this.auth.currentUser
    if (currentUser) {
      currentUser.getIdToken().then(
        (token) => { this.cookieService.set(this.COOKIE_KEY, token) }
      ).catch(
        () => console.log('Couldnt retrieve token')
      )
    }
  }

  isAuthenticated(): boolean {
    return this.cookieService.check(this.COOKIE_KEY)
  }

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  signinWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout(): Promise<void> {
    this.cookieService.delete(this.COOKIE_KEY);
    return signOut(this.auth)
  }

  getUsername() {
    return this.auth.currentUser?.email //displayName
  }

}