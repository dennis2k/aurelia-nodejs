import { UserService } from '../users/user.service';
import { UserModel } from '../users/user.model';
import { BroadcastService } from '../resources/broadcast.service';
import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-dependency-injection';
import { AuthService } from 'aurelia-auth';

@autoinject
export class Nav {

    user: UserModel;

    constructor(
        private authService: AuthService,
        private router: Router,
        private broadcastServie: BroadcastService,
        private userService: UserService) {

        this.user = this.userService.getUserFromStorage();
        this.broadcastServie.subscribe(BroadcastService.AUTHORIZED, () => {
            setTimeout(() => {
                this.user = this.userService.getUserFromStorage();
            }, 200);
        });
        this.broadcastServie.subscribe(BroadcastService.LOGOUT, () => {
            this.user = undefined;
            this.userService.removeUserFromStorage();
        });
    }

    logout() {
        this.authService.logout(undefined).then(() => {
            this.router.navigateToRoute('login');
        });
    }
}