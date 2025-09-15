
import {
    Injectable,
    Pipe,
    PipeTransform
} from '@angular/core';


@Injectable()
@Pipe({
    name: 'translator',
    pure: true,
})
export class StatusLabelPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        throw new Error('Method not implemented.');
    }

}