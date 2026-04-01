import {
    HttpErrorResponse,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest
} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, finalize, shareReplay, switchMap, throwError} from 'rxjs';
import {AuthService} from './auth.service';

let refreshRequest$: ReturnType<AuthService['refresh']> | null = null;

export const authTokenInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const auth = inject(AuthService);

    if (isAuthRequest(req.url)) {
        return next(req);
    }

    auth.isAuth;

    const accessToken = auth.accessToken;

    const authReq = accessToken ? addAccessToken(req, accessToken) : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status !== 401 && error.status !== 403) {
                return throwError(() => error);
            }

            if (!auth.refreshToken && !auth.isAuth) {
                auth.logout();
                return throwError(() => error);
            }

            if (!refreshRequest$) {
                refreshRequest$ = auth.refresh().pipe(
                    shareReplay(1),
                    finalize(() => {
                        refreshRequest$ = null;
                    })
                );
            }

            return refreshRequest$.pipe(
                switchMap(tokens => {
                    return next(addAccessToken(req, tokens.access_token));
                }),
                catchError(refreshError => {
                    return throwError(() => refreshError);
                })
            );
        })
    );
};

const addAccessToken = (req: HttpRequest<unknown>, accessToken: string) => {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`
        }
    });
};

const isAuthRequest = (url: string): boolean => {
    return url.includes('/auth/token') || url.includes('/auth/refresh');
};
