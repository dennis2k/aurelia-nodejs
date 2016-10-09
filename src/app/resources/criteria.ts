export class C {

    static or(...conditions: any[]) {
        let or = { $or: [] };
        conditions.forEach((cond) => {
            or.$or.push(cond);
        });
        return or;
    }

    static and(...conditions: any[]) {
        let and = { $and: [] };
        conditions.forEach((cond) => {
            and.$and.push(cond);
        });
        return and;
    }

    static in(property: string, strings: string[]) {
        let crit = {};
        crit[property] = { $in: strings };
        return crit;
    }

    static equals(property: string, value: any) {
        let crit = {};
        crit[property] = { $eq: value };
        return crit;
    }

    static elementMatch(property: string, match: any) {
        let crit = {};
        crit[property] = { $elemMatch: match };
        return crit;
    }

    static notElementMatch(property: string, match: any) {
        let crit = {};
        crit[property] = { $not: { $elemMatch: match } };
        return crit;
    }

    static notEquals(property: string, value: any) {
        let crit = {};
        crit[property] = { $ne: value };
        return crit;
    }

    static regex(property: string, value: any) {
        let crit = {};
        crit[property] = value;
        return crit;
    }

    static startWith(property: string, value: any) {
        let crit = {};
        crit[property] = "~^(" + value + ")";
        return crit;
    }

    static contains(property: string, value: any) {
        let crit = {};
        crit[property] = { $regex: value };
        return crit;
    }

    static lt(property: string, value: any) {
        let crit = {};
        crit[property] = { $lt: value };
        return crit;
    }

    static lte(property: string, value: any) {
        let crit = {};
        crit[property] = { $lte: value };
        return crit;
    }

    static gt(property: string, value: any) {
        let crit = {};
        crit[property] = { $gt: value };
        return crit;
    }

    static gte(property: string, value: any) {
        let crit = {};
        crit[property] = { $gte: value };
        return crit;
    }
}