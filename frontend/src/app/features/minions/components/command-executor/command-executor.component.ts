import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-command-executor',
    templateUrl: './command-executor.component.html',
    styleUrls: ['./command-executor.component.scss']
})
export class CommandExecutorComponent implements OnInit {
    @Input() minionId!: string;
    @Input() loading: boolean = false;
    @Output() onExecuteCommand = new EventEmitter<string>();

    commandForm!: FormGroup;
    commandHistory: string[] = [];

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.commandForm = this.fb.group({
            command: ['', [Validators.required]]
        });
    }

    executeCommand(): void {
        if (this.commandForm.valid) {
            const command = this.commandForm.get('command')?.value;
            this.onExecuteCommand.emit(command);
            this.addToHistory(command);
            this.commandForm.reset();
        }
    }

    private addToHistory(command: string): void {
        if (!this.commandHistory.includes(command)) {
            this.commandHistory.unshift(command);
            if (this.commandHistory.length > 10) {
                this.commandHistory.pop();
            }
        }
    }

    selectFromHistory(command: string): void {
        this.commandForm.patchValue({ command });
    }
}