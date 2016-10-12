declare var Gun: any;
export class GunModel {
    _id: string;
    deleted: boolean = false;

    constructor() {
        this._id = Gun.text.random(12);
    }
}