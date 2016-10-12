import {GunService} from '../resources/gun.service';
import { CatModel } from './cat.model';

declare var Gun: any;
export class CatService extends GunService<CatModel> {

    constructor() {
        super("cats");
    }
}