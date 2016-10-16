import {Component} from '../../../utils/decorators';
import './login.scss';
let template = require('./login.template.html');

@Component({
    templateUrl  : template,
    selector : 'ma-login'
})
export class LoginComponent {

    /* @ngInject */
    constructor() { }

    $onInit() { }
}