import {Entity} from '../resources/core.models';

export class UserModel extends Entity {
    email: string;
    password: string;
    displayName: string;
    picture: string;
    facebook: string;
    foursquare: string;
    google: string;
    github: string;
    linkedin: string;
    live: string;
    yahoo: string;
    twitter: string;
}