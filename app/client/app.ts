import {MenuComponent, HomeComponent, DashboardComponent, LoginComponent} from './components';
import {AppController} from './app.controller';
import {Configuration} from './app.config';
import {LayoutService, AuthService} from './services';

import './assets/styles/vendor/angular-material.css';
import ms from './utils/make-selector';

let appDependencies: string[] = ['ui.router', 'toastr', 'ngMaterial'];

let appModule = angular.module("app", appDependencies);

appModule.config(Configuration.enableCors)
    .config(Configuration.exceptionConfig)
    .config(Configuration.statesConfig)
    .factory("httpInterceptor", Configuration.httpInterceptorFactory)
    .constant('apiUrl', 'http://localhost:8080') //TODO: Inject this value with webpack according to the enviroment.
    .controller('appController', AppController)
    .service('layoutService', LayoutService)
    .service('authService', AuthService)
    .component(ms(HomeComponent), HomeComponent)
    .component(ms(LoginComponent), LoginComponent)
    .component(ms(MenuComponent), MenuComponent)
    .component(ms(DashboardComponent), DashboardComponent);

appModule.config(function ($mdThemingProvider : ng.material.IThemingProvider) {
    $mdThemingProvider.theme('altTheme')
        .primaryPalette('teal');

    $mdThemingProvider.setDefaultTheme('altTheme');
});


appModule.run(function ($rootScope: ng.IRootScopeService) {

    $rootScope.$on('$stateChangeStart', function (evt: any, to: any, params: any) {
        console.log(evt, to, params);
    });
});

export default appModule;