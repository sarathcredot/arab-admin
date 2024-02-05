// Interceptors.ts
import { ApolloLink, Observable, Operation, NextLink, InMemoryCache } from '@apollo/client';
import { useNavigate } from 'react-router';

// Request Interceptor
export const requestInterceptor = new ApolloLink(
  (operation: Operation, forward: NextLink): Observable<any> => {
    // Modify the operation before it is sent
    operation.setContext({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    // Call the next link in the chain
    return forward(operation);
  }
);

// Response Interceptor
export const responseInterceptor = new ApolloLink(
  (operation: Operation, forward: NextLink): Observable<any> => {
    return new Observable((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          console.log('GraphQL Result:', result);
          // Check if there are errors in the result
          if (result.errors && result.errors.some((error: any) => error.extensions?.code === "UNAUTHORIZED")){
            console.log("Redirecting to login page");
            localStorage.removeItem("admin_token");
            window.location.href="/login"
          } else {
            observer.next(result);
          }
        
        },
        error: (error) => {
          // Handle errors globally
          console.error('GraphQL Error:', error);
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }
);



const getAuthToken = () => {
  return localStorage.getItem("admin_token") || null;
};

export const authLink = new ApolloLink((operation, forward) => {
  const token = getAuthToken();
  operation.setContext(({ headers }: any) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));
  return forward(operation);
});