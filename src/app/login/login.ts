import {UserService} from '../users/user.service';
import { Toaster } from '../resources/toaster';
import { AuthService } from 'aurelia-auth';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject()
export class Login {

    email: string;
    password: string;

    constructor(
        private auth: AuthService,
        private router: Router,
        private toaster: Toaster,
        private userService: UserService) { };

    login(email: string, password: string) {
        return this.auth.login(email, password)
            .then(response => {
                this.userService.setUserInStorage(response.user);
                this.router.navigateToRoute('profile');
            })
            .catch((err) => {
                this.toaster.error("Wrong username / password");
            });
    };

    authenticate(name: string) {
        return this.auth.authenticate(name, true, true)
            .then((response) => {
                this.userService.setUserInStorage(response.user);
                this.router.navigateToRoute('profile');
            })
            .catch((err) => {
                this.toaster.error("Wrong username / password");
            });
    }
}