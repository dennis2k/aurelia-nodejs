import {StorageService} from '../resources/storage.service';
import {UserModel} from './user.model';
import {ApiService} from '../resources/api.service';

export class UserService extends ApiService<UserModel> {
    protected resource: string = "/user";
    protected model: UserModel = new UserModel();

    setUserInStorage(content: any) {
        this.storageService.set(StorageService.USER,content);
    }

    public getUserFromStorage(): UserModel | undefined {
        let user = this.storageService.get<IAuth>(StorageService.USER);
        if (!user)
            return undefined;
        let userModel = new UserModel();
        userModel.initData(user);
        return userModel;
    }

    public removeUserFromStorage() {
        this.storageService.remove(StorageService.USER);
    }

}
interface IAuth {
    user: any;
    token: string;
}