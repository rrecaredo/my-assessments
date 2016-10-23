import {Component} from '../../utils/decorators';
let template = require('./dashboard.template.html');
import {IUserInfo} from '../../models';

@Component({
    templateUrl  : template,
    selector : 'ma-dashboard'
})
export class DashboardComponent {

    userInfo : IUserInfo;

    /* @ngInject */
    constructor(private $rootScope : ng.IRootScopeService) {
    }

    $onInit() {
        this.userInfo = this.$rootScope['auth'];
    }
}