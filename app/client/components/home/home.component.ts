import * as model from '../../models';
import {ILayoutService} from '../../services';
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

    menuItems : model.IMenuItem[];

    /* @ngInject */
    constructor(layoutService : ILayoutService) {
        this.menuItems = layoutService.getMenuItems();
    }
}