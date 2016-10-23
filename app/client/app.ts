import {SubNavigationComponent, HomeComponent, DashboardComponent, LoginComponent} from './components';
import {AppController} from './app.controller';
import {Configuration} from './app.config';
import {LayoutService, AuthService} from './services';

import './assets/styles/vendor/angular-material.css';
import ms from './utils/make-selector';

let appDependencies: string[] = ['ui.router', 'toastr', 'ngMaterial', 'angular-storage', 'ngMdIcons'];

let appModule = angular.module("app", appDependencies);

appModule.config(Configuration.enableCors)
    .factory("httpInterceptor", Configuration.httpInterceptorFactory)
    .config(Configuration.registerInterceptors)
    .config(Configuration.exceptionConfig)
    .config(Configuration.statesConfig)
    .config(Configuration.materialConfig)
    .run(Configuration.stateHandlers)
    .constant('apiUrl', 'http://localhost:8080') //TODO: Inject this value with webpack according to the enviroment.
    .controller('appController', AppController)
    .service('layoutService', LayoutService)
    .service('authService', AuthService)
    .component(ms(HomeComponent), HomeComponent)
    .component(ms(LoginComponent), LoginComponent)
    .component(ms(SubNavigationComponent), SubNavigationComponent)
    .component(ms(DashboardComponent), DashboardComponent)
    .config((storeProvider : any) => { storeProvider.setStore('sessionStorage'); });

export default appModule;