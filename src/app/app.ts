import { Toaster } from './resources/toaster';
import { Router, RouterConfiguration } from 'aurelia-router';
import { FetchConfig } from 'aurelia-auth';
import { autoinject } from 'aurelia-framework';


@autoinject()
export class App {
  router: Router;

  constructor(
    private fetchConfig: FetchConfig,
    private toaster: Toaster) {

    this.fetchConfig.configure();
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Keeper';
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: '', name: 'login', moduleId: 'login/login', nav: true, title: 'Login' },
      { route: 'profile', name: 'profile', moduleId: 'profile/profile', nav: true, title: 'Profile' },
      { route: 'signup', name: 'signup', moduleId: 'login/signup', nav: true, title: 'Sign up' },
      { route: 'contracts', name: 'contracts', moduleId: 'contracts/contract-list', nav: true, title: 'Contracts' },
      { route: 'cats', name: 'cats', moduleId: 'cats/cat-list', nav: true, title: 'Cats' },
      { route: 'contracts/:name', name: 'contract-details', moduleId: 'contracts/contract-details', title: 'Contract Details' }
    ]);
    this.router = router;
  }
}
