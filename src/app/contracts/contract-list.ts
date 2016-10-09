import { autoinject } from 'aurelia-dependency-injection';
import { ContractModel } from './contract.model';
import 'fetch';
import { ContractService } from "./contract.service";

@autoinject()
export class ContractList {

    searchAddress: string;
    contracts: ContractModel[] = [];
    switch: boolean = true;

    constructor(
        private contractService: ContractService) {
    }

    activate() {
        this.contractService
            .getAll()
            .then(response => {
                console.log(response);
                this.contracts = response;
            });
    }

    remove(contract: ContractModel) {
        this.contractService.remove(contract._id).then(() => {
            this.contracts.splice(this.contracts.indexOf(contract),1);
        })
    }

    loadSingle(contract: ContractModel) {
        this.contractService.getById(contract._id).then((res) => {
            contract.city = "OMFG OMFG";
            this.contractService.save(contract).then(res => console.log(res));
        });
    }

    toggle() {
        this.switch = !this.switch;
    }

    getByAddress(address: string) {
        this.contractService.getByAddress(address).then(res => console.log(res));
    }
}