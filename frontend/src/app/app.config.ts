import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // HttpClient + allow DI interceptors (useful for REST endpoints like /upload)
    provideHttpClient(withInterceptorsFromDi()),

    // Keep this for REST calls
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

    // ✅ Apollo GraphQL with Authorization header (no setContext)
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const authLink = new ApolloLink((operation, forward) => {
        const token = localStorage.getItem('token'); // same key as AuthService

        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...(headers as any),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }));

        return forward(operation);
      });

      return {
        link: authLink.concat(httpLink.create({ uri: environment.graphqlUrl })),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
          mutate: { fetchPolicy: 'no-cache' },
        },
      };
    }),
  ],
};