import {Component} from '../../utils/decorators';
import * as model from '../../models';
import {IAuthService} from '../../services';
import './sub-navigation.scss';
let template = require('./sub-navigation.template.html');

@Component({
    templateUrl  : template,
    selector : 'ma-subnavigation',
    bindings : {
        items : "="
    }
})
export class SubNavigationComponent {

    items : model.INavigationItem[];

    /* @ngInject */
    constructor(private authService : IAuthService) { }

    logout() {
        this.authService.logout();
    }

    $onInit() {
        this.items = this.items || [];
    }
}