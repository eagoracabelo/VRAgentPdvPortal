import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandRequest, FileManagementRequest, MinionKeys } from '../../domain/models/index';

@Injectable({
    providedIn: 'root'
})
export class MinionRepository {
    private readonly baseUrl = '/api/minions';

    constructor(private http: HttpClient) { }

    getAllMinions(): Observable<MinionKeys> {
        return this.http.get<MinionKeys>(this.baseUrl);
    }

    acceptKey(keyId: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/${keyId}/accept`, {});
    }

    executeCommand(minionId: string, command: CommandRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}/${minionId}/command`, command);
    }

    updateVRAgentePdv(minionId: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/${minionId}/update`, {});
    }

    manageFile(minionId: string, fileRequest: FileManagementRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}/${minionId}/file`, fileRequest);
    }
}