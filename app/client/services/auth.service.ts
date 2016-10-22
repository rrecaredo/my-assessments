export interface IAuthService {
    login(user : string, password : string): ng.IPromise<boolean>;
}

export class AuthService implements IAuthService {

    /* @ngInject */
    constructor(private $q : ng.IQService, private $http : ng.IHttpService, private apiUrl : string) {}

    login(user : string, password : string) {
        return this.$http.post(`${this.apiUrl}/users/login`, { user: user, password : password})
            .then((result) =>{

            }
        )
    }
}