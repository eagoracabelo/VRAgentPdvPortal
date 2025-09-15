import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-file-manager',
    templateUrl: './file-manager.component.html',
    styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {
    @Input() minionId!: string;
    @Input() loading: boolean = false;
    @Output() onManageFile = new EventEmitter<{ sourcePath: string, destinationPath: string }>();

    fileForm!: FormGroup;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.fileForm = this.fb.group({
            sourcePath: ['', [Validators.required]],
            destinationPath: ['', [Validators.required]]
        });
    }

    manageFile(): void {
        if (this.fileForm.valid) {
            const { sourcePath, destinationPath } = this.fileForm.value;
            this.onManageFile.emit({ sourcePath, destinationPath });
        }
    }

    resetForm(): void {
        this.fileForm.reset();
    }
}