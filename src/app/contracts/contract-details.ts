import {Router} from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { ContractModel } from "./contract.model";
import { ContractService } from "./contract.service";

@autoinject()
export class ContractDetails {
    contract: ContractModel;

    constructor(
        private contractService: ContractService,
        private router: Router) {}

    save(contract: ContractModel) {
        console.log(contract);
        this.contractService.save(contract).then((r) => {
            this.router.navigateToRoute("contracts")
        });
    }

    activate() {
        this.contract = new ContractModel();
    }
}   