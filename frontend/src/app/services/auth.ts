import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../graphql/auth.gql';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private apollo: Apollo) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  loggedIn$() {
    return this.loggedInSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.loggedInSubject.next(true);
  }

  clearSession() {
    localStorage.removeItem(this.tokenKey);
    this.loggedInSubject.next(false);
    this.apollo.client.clearStore();
  }

  // ✅ Backend expects: login(usernameOrEmail, password)
  async login(usernameOrEmail: string, password: string) {
    const res: any = await firstValueFrom(
      this.apollo.mutate({
        mutation: LOGIN_MUTATION,
        variables: { usernameOrEmail, password },
        fetchPolicy: 'no-cache',
      })
    );

    const token = res?.data?.login?.token;
    if (!token) throw new Error(res?.data?.login?.message || 'Invalid username/email or password');
    this.setToken(token);
  }

  async signup(username: string, email: string, password: string) {
    const res: any = await firstValueFrom(
      this.apollo.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { username, email, password },
        fetchPolicy: 'no-cache',
      })
    );

    const token = res?.data?.signup?.token;
    if (!token) throw new Error(res?.data?.signup?.message || 'Signup failed');
    this.setToken(token);
  }
}