import {GunModel} from '../resources/gun.model';

export class CatModel extends GunModel {
    name: string;
    age: number;
    friend: CatModel;
}