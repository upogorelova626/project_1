import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {catchError, tap, throwError} from 'rxjs';
import {AuthRequest, Login} from './auth.interface';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly cookieService = inject(CookieService);
    private readonly router = inject(Router);

    private readonly baseUrl = 'https://icherniakov.ru/yt-course/auth';

    accessToken: string | null = null;
    refreshToken: string | null = null;

    get isAuth(): boolean {
        if (!this.accessToken) {
            this.accessToken = this.cookieService.get('accessToken') || null;
            this.refreshToken = this.cookieService.get('refreshToken') || null;
        }

        return !!this.accessToken;
    }

    login(body: Login) {
        const fd = new FormData();

        fd.append('username', body.username);
        fd.append('password', body.password);

        return this.http
            .post<AuthRequest>(`${this.baseUrl}/token`, fd)
            .pipe(tap(tokens => this.saveTokens(tokens)));
    }

    refresh() {
        if (!this.refreshToken) {
            this.refreshToken = this.cookieService.get('refreshToken') || null;
        }

        if (!this.refreshToken) {
            this.logout();
            return throwError(() => new Error('Refresh token is missing'));
        }

        return this.http
            .post<AuthRequest>(`${this.baseUrl}/refresh`, {
                refresh_token: this.refreshToken
            })
            .pipe(
                tap(tokens => this.saveTokens(tokens)),
                catchError(error => {
                    this.logout();
                    return throwError(() => error);
                })
            );
    }

    logout() {
        this.accessToken = null;
        this.refreshToken = null;

        this.cookieService.delete('accessToken');
        this.cookieService.delete('refreshToken');

        this.router.navigate(['/login']);
    }

    private saveTokens(tokens: AuthRequest) {
        this.accessToken = tokens.access_token;
        this.refreshToken = tokens.refresh_token;

        this.cookieService.set('accessToken', tokens.access_token);
        this.cookieService.set('refreshToken', tokens.refresh_token);
    }
}
