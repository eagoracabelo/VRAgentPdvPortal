import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MinionKeys, CommandRequest, FileManagementRequest } from '../../domain/models/index';

@Injectable({
    providedIn: 'root'
})
export class MinionRepository {
    private readonly baseUrl = '/api/minions';

    constructor(private http: HttpClient) { }

    getAllMinions(): Observable<MinionKeys> {
        return this.http.get<MinionKeys>(this.baseUrl).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    acceptKey(keyId: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/${keyId}/accept`, {}).pipe(
            catchError(this.handleError)
        );
    }

    rejectKey(keyId: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/${keyId}/reject`, {}).pipe(
            catchError(this.handleError)
        );
    }

    denyKey(keyId: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/${keyId}/deny`, {}).pipe(
            catchError(this.handleError)
        );
    }

    getMinionInfo(minionId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/${minionId}/info`).pipe(
            catchError(this.handleError)
        );
    }

    executeCommand(minionId: string, command: CommandRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}/${minionId}/command`, command).pipe(
            catchError(this.handleError)
        );
    }

    updateVRAgentePdv(minionId: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/${minionId}/update`, {}).pipe(
            catchError(this.handleError)
        );
    }

    manageFile(minionId: string, fileRequest: FileManagementRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}/${minionId}/file`, fileRequest).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Erro desconhecido';

        if (error.error instanceof ErrorEvent) {
            // Erro do lado do cliente
            errorMessage = `Erro: ${error.error.message}`;
        } else {
            // Erro do lado do servidor
            errorMessage = `Erro ${error.status}: ${error.message}`;
        }

        console.error('Erro na API:', errorMessage);
        return throwError(() => errorMessage);
    }
}