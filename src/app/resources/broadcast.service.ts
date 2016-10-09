import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class BroadcastService extends EventAggregator {
    static TOAST: string = "toast";
    static API_ERROR: string = "api:error";
    static UNAUTHORIZED: string = "api:unauthorized";
    static AUTHORIZED: string = "auth:authenticate";
    static LOGOUT: string = "auth:logout";
    private static LOGIN: string = "auth:login";

    constructor(private ea: EventAggregator) {
        super();
        this.forward();

    }

    private forward() {
        this.ea.subscribe(BroadcastService.AUTHORIZED, () => {
            this.publish(BroadcastService.AUTHORIZED);
        });
        this.ea.subscribe(BroadcastService.LOGIN, () => {
            this.publish(BroadcastService.AUTHORIZED);
        });
        this.ea.subscribe(BroadcastService.LOGIN, () => {
            this.publish(BroadcastService.LOGIN);
        });
        this.ea.subscribe(BroadcastService.LOGOUT, () => {
            this.publish(BroadcastService.LOGOUT);
        });
    }
}