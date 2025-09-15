import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Importar componentes VR (ajustar conforme disponibilidade)
// import { VRCardModule } from '../../projects/vr-card/src/public-api';
// import { VRButtonModule } from '../../projects/vr-button/src/public-api';
// import { VRTableModule } from '../../projects/vr-table/src/public-api';
// import { VRModalModule } from '../../projects/vr-modal/src/public-api';

@NgModule({
    declarations: [
        // Componentes locais
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // VRCardModule,
        // VRButtonModule,
        // VRTableModule,
        // VRModalModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // VRCardModule,
        // VRButtonModule,
        // VRTableModule,
        // VRModalModule
    ]
})
export class SharedModule { }