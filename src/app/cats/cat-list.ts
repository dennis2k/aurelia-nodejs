import { CatModel } from './cat.model';
import { autoinject } from "aurelia-framework";
import { CatService } from './cat.service';
import { GunFilterOperator } from '../resources/gun.service';

@autoinject
export class CatList {
    cat: CatModel;

    constructor(public catService: CatService) {
        this.cat = new CatModel();
    }
    add(cat: CatModel) {
        this.catService.save(cat);
        this.cat = new CatModel();
    }

    update(cat: CatModel) {
        cat.age = 999999;
        this.catService.save(cat);
    }

    filterByAge(age: number) {
        (!age)
            ? this.catService.removeFilter("age", GunFilterOperator.GT)
            : this.catService.addFilter("age", GunFilterOperator.GT, age);
    }
}