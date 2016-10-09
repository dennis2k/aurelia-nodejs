export class Query {
    private _select: any;
    private _sort: string;
    private _skip: number;
    private _limit: number;
    private _count: boolean = false;
    private _distinct: string;
    private _populate: string[] = [];
    private _query: any = { $and: [] };

    private isQueryEmpty(): boolean {
        return (this._query.$and.length === 0);
    }

    addCriteria(criteria: any): Query {
        this._query.$and.push(criteria);
        return this;
    }

    select(fields: string[]): Query {
        this._select = {};
        fields.forEach((field) => {
            this._select[field] = 1;
        });
        return this;
    }

    query(query: any): Query {
        this._query = query;
        return this;
    }

    populate(relations: string[]): Query {
        this._populate = relations;
        return this;
    }

    distinct(property: string): Query {
        this._distinct = property;
        return this;
    }

    isCount(): boolean {
        return this._count;
    }

    count(): void {
        this._count = true;
    }

    removeCount(): void {
        this._count = false;
    }

    sort(property: string): Query {
        this._sort = property;
        return this;
    }

    skip(skip: number): Query {
        this._skip = skip;
        return this;
    }

    limit(limit: number): Query {
        this._limit = limit;
        return this;
    }
    removePagination(): Query {
        this._skip = undefined;
        this._limit = undefined;
        return this;
    }

    pagination(currentPage: number, itemPerPage: number): Query {
        this.limit(itemPerPage);
        this.skip((currentPage - 1) * itemPerPage);
        return this;
    }

    serialize(): string {
        let filter: any = {};
        filter.query = (this.isQueryEmpty()) ? {} : this._query;
        let relations = "";
        this._populate.forEach((relation) => {
            relations += "," + relation;
        });
        relations = relations.replace(/(^,)|(,$)/g, "");
        if (relations.length > 0)
            filter.populate = relations;
        if (this._skip)
            filter.skip = this._skip;
        if (this._limit)
            filter.limit = this._limit;
        if (this._sort)
            filter.sort = this._sort;
        if (this._distinct)
            filter.distinct = this._distinct;
        if (!this._count) {
            if (this._select)
                filter.select = this._select;
        }

        return "?query=" + JSON.stringify(filter.query);
    }
}