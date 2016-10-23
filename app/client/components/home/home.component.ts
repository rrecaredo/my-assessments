import * as model from '../../models';
import {ILayoutService, IAuthService} from '../../services';
import {Component} from '../../utils/decorators';
import './home.scss';
let template = require('./home.template.html');

@Component({
    templateUrl  : template,
    selector : 'ma-home',
    bindings : {
        menuItems : '<'
    }
})
export class HomeComponent {

    menuItems : model.INavigationItem[];
    userInfo  : any = {};

    /* @ngInject */
    constructor(layoutService : ILayoutService, authService : IAuthService) {
        this.userInfo = authService.getToken();
        this.menuItems = layoutService.getNavigationItems();
    }
}