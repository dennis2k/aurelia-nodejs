import { GunModel } from './gun.model';
declare var Gun: any;
export class GunService<T extends GunModel> {

    collection = new Map<string, T>();
    resource: any;
    private filters = new Map<string, IGunFilter>();
    private operators = {
        '>': (a, b) => parseInt(a, 10) > parseInt(b, 10),
        '>=': (a, b) => parseInt(a, 10) >= parseInt(b, 10),
        '<': (a, b) => parseInt(a, 10) < parseInt(b, 10),
        '<=': (a, b) => parseInt(a, 10) <= parseInt(b, 10),
        '==': (a, b) => a === b,
        '^=': (a: string, b) => a.startsWith(b),
        '!=': (a, b) => a !== b
    };

    constructor(uri: string) {
        this.resource = Gun("http://localhost:8080/gun").get(uri);
        this.addFilter("deleted", GunFilterOperator.EQ, false);
        this.resource.on().map((model: T, id: string) => {
            this.mapData(model, id);
        });
    }

    getById(id: string): T {
        return this.resource.path(id).val();
    }

    getAll() {
        let all = new Map<string, T>();
        this.resource.map().val((model: T, id: string) => {
            if (model && !model.deleted)
                all.set(id, model);
        });
        return all;
    }

    save(model: T) {
        this.resource.path(model._id).put(model);
    }

    remove(model: T) {
        model.deleted = true;
        this.save(model);
        this.collection.delete(model._id);
    }

    addFilter(property: string, op: string, value: any) {
        this.filters.set(property + op, {
            prop: property,
            op: op,
            val: value
        });
        this.resource.map().val((model: T, id: string) => {
            this.mapData(model, id);
        });
    }

    removeFilter(property: string, op: string) {
        this.filters.delete(property + op);
        this.resource.map().val((model: T, id: string) => {
            this.mapData(model, id);
        });
    }

    private mapData(model: T, id: string) {
        let pass: boolean = this.checkFilter(model);
        if (!pass && this.collection.has(id))
            this.collection.delete(id);
        if (model && pass)
            this.collection.set(id, model);
    }

    private checkFilter(model: T): boolean {
        let isValid = true;
        this.filters.forEach((filter) => {
            let valid = this.operators[filter.op](model[filter.prop], filter.val);
            if (!valid)
                isValid = false;
        });
        return isValid;
    }
}
export interface IGunFilter {
    prop: string;
    op: string;
    val: any;
}

export class GunFilterOperator {
    static GT: string = ">";
    static GTE: string = ">=";
    static LT: string = "<";
    static LTE: string = "<=";
    static EQ: string = "==";
    static STARTS_WITH: string = "^=";
    static NOT_EQ: string = "!=";
}