import {computedFrom} from 'aurelia-framework';
import {Entity} from '../resources/core.models';

export class ContractModel extends Entity {

    name: string;
    address: string;
    city: string;
    zip: string;

    @computedFrom('name','address')
    get fullName() {
        return this.name + this.address;
    }
}