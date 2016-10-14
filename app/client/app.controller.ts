import {IMenuItem} from './models/menu.model';

export class AppController {

    menuItems : IMenuItem[] = [];

    /* @ngInject */
    constructor() {
        this.menuItems.push({ title : 'Dashboard'  , url : '/#' });
        this.menuItems.push({ title : 'Positions'  , url : '/#/positions' });
        this.menuItems.push({ title : 'Assessments', url : '/#/assessments' });
    }
}