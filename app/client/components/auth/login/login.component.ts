import {Component} from '../../../utils/decorators';
import {IAuthService} from '../../../services'
import './login.scss';
let template = require('./login.template.html');

@Component({
    templateUrl  : template,
    selector     : 'ma-login'
})
export class LoginComponent implements ng.IComponentOptions{

    public username : string;
    public password : string;

    /* @ngInject */
    constructor(private authService : IAuthService, private $state : ng.ui.IStateService) { }

    login(user : string, password : string) {
        this.authService.login(user, password).then((result : boolean) => {
            if (result) {
                this.$state.go('home');
            }
        }, (reason : any) => {
            console.log(reason);
        });
    }

    $onInit() {
        this.username = '';
        this.password = '';
    }
}