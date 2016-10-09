import {autoinject} from 'aurelia-dependency-injection';
import {AuthService} from 'aurelia-auth';
import {NavigationInstruction, RouteConfig} from 'aurelia-router';

@autoinject
export class Profile {

    constructor(private authService: AuthService) {
    }

    canActivate(params: any, routeConfig: RouteConfig, navigationInstruction: NavigationInstruction) {
        return this.authService.isAuthenticated();
    }

}