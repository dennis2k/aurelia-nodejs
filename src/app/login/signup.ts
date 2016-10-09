import {UserModel} from '../users/user.model';
import {UserService} from '../users/user.service';
import { Router } from 'aurelia-router';
import { inject, NewInstance } from 'aurelia-framework';
import { ValidationController, ValidationRules } from 'aurelia-validation';
import { MaterializeFormValidationRenderer } from 'aurelia-materialize-bridge';

@inject(NewInstance.of(ValidationController),UserService, Router)
export class Signup {
    user = new UserModel();
    confirmPassword = '';
    controller = undefined;

  rules = ValidationRules
    .ensure('user.displayName')
      .minLength(4)
      .required()
    .ensure('user.email')
      .required()
        .withMessage('We need your email')
      .email()
    .ensure('user.password')
        .required()
        .minLength(4)
    .ensure('confirmPassword')
        .required()
    .rules;

  constructor(
        controller: ValidationController,
        private userService: UserService,
        private router: Router) {
    this.controller = controller;
    this.controller.addRenderer(new MaterializeFormValidationRenderer());
  }

  signup() {
    this.controller.validate()
        .then(v => {
            return this.userService.save(this.user);
        })
        .then(() => {
            this.router.navigateToRoute('login');
        });
  }
}
