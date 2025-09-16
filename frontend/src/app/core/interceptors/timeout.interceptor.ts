import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Aumentar timeout para APIs Salt que podem demorar mais
        const timeoutValue = req.url.includes('/api/salt') ? 30000 : 10000; // 30s para Salt API, 10s para outras

        return next.handle(req).pipe(
            timeout(timeoutValue)
        );
    }
}