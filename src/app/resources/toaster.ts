import { BroadcastService } from './broadcast.service';
import { autoinject } from 'aurelia-dependency-injection';
import { MdToastService } from 'aurelia-materialize-bridge';

@autoinject()
export class Toaster {

    private timeout: number = 5000;
    constructor(
        private toastService: MdToastService,
        private broadcaster: BroadcastService
    ) {
        broadcaster.subscribe(BroadcastService.TOAST, (event: IToastEvent) => {
            this.pop(event.message, event.type);
        });
    }

    pop(message: string, type: ToastEventType) {
        if (type === ToastEventType.ERROR)
            return this.error(message);
        if (type === ToastEventType.INFO)
            return this.info(message);
        if (type === ToastEventType.SUCCESS)
            return this.success(message);

    }

    info(message: string) {
        this.toastService.show(message, this.timeout, 'blue');
    }

    success(message: string) {
        this.toastService.show(message, this.timeout, 'green rounded');
    }

    error(message: string) {
        this.toastService.show(message, this.timeout, 'red');
    }
}

export interface IToastEvent {
    message: string;
    type: ToastEventType;
}

export enum ToastEventType {
    SUCCESS,
    ERROR,
    INFO
}
