import * as model from '../../models';
import {Component} from '../../utils/decorators';
import './home.scss';
let template = require('./home.template.html');

@Component({
    templateUrl  : template,
    selector : 'ma-home'
})
export class HomeComponent {
    /* @ngInject */
    constructor() {
    }
}