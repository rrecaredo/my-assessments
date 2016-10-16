import {Component} from '../../utils/decorators';
let template = require('./dashboard.template.html');

@Component({
    templateUrl  : template,
    selector : 'ma-dashboard'
})
export class DashboardComponent {

    /* @ngInject */
    constructor() {
    }

    $onInit() {
    }
}