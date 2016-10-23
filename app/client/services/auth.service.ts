import * as model from '../models/';

export interface IAuthService {
    login(user: string, password: string): ng.IPromise<boolean>;
    logout(): void;
    getToken() : any;
}

export class AuthService implements IAuthService {

    /* @ngInject */
    constructor(private $http: ng.IHttpService, private apiUrl: string, private store: any,
                private $state : ng.ui.IStateService, private $rootScope : ng.IRootScopeService) {
    }

    login(user: string, password: string): ng.IPromise<boolean> {
        return this.$http.post(`${this.apiUrl}/users/login`, {user: user, password: password})
            .then((result: any) => {
                    if (result.data && result.data.success && result.data.success.success) {
                        const auth = _.pick(result.data, ['token', 'name', 'user', 'role']);

                        this.store.set('auth', auth);
                        this.$rootScope['auth'] = auth;

                        return true;
                    }

                    return false;
                }
            )
    }

    logout() {
        this.store.remove('auth');
        delete this.$rootScope['auth'];
        this.$state.go('login');
    }

    getToken() : any {
        let authObj : model.IUserInfo = this.store.get('auth') || {};
        return authObj.token;
    }
}