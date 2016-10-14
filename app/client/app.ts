import {MenuComponent} from './components/menu/menu.component';
import {AppController} from './app.controller';

let appDependencies : string[] = ['ui.router'];

let appModule = angular.module("app", appDependencies);

appModule.controller('appController', AppController)
         .component('maMenu', MenuComponent);

export default appModule;