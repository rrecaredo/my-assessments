import {Component} from '../../common/decorators';
import {IMenuItem} from '../../models/menu.model';
import './menu.scss';
let template = require('./menu.template.html');

@Component({
    templateUrl  : template,
    bindings : {
        menuItems : "="
    }
})
export class MenuComponent {

    menuItems : IMenuItem[];

    /* @ngInject */
    constructor() {
    }

    $onInit() {
        this.menuItems = this.menuItems || [];
    }
}