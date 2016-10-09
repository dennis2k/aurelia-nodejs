import { C } from '../resources/criteria';
import { ApiService } from '../resources/api.service';
import { autoinject } from "aurelia-framework";
import { ContractModel } from "./contract.model";

@autoinject()
export class ContractService extends ApiService<ContractModel> {

    protected resource: string = "/contract";
    protected model: ContractModel = new ContractModel();
    protected useCache: boolean = true;
    protected notifyOnCreate: boolean = true;
    protected notifyOnUpdate: boolean = true;
    protected notifyOnDelete: boolean = true;

    getByAddress(address: string) {
        let query = this.createQuery();
        query.addCriteria(
            C.startWith('address', address)
        );
        return this.getAll(query, true);
    }
}
