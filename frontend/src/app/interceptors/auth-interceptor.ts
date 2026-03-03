import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    // 🚫 Don't attach JWT to Cloudinary requests
    const isCloudinary =
      req.url.includes('cloudinary.com') ||
      req.url.includes('api.cloudinary.com');

    // ✅ Only attach token to your backend GraphQL URL
    const isGraphQL = req.url.startsWith(environment.graphqlUrl);

    if (!token || isCloudinary || !isGraphQL) {
      return next.handle(req);
    }

    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(cloned);
  }
}