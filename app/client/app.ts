import {MenuComponent, HomeComponent, DashboardComponent, LoginComponent} from './components';
import {AppController} from './app.controller';
import {Configuration} from './app.config';
import {LayoutService} from './services';
import ms from './utils/make-selector';

let appDependencies : string[] = ['ui.router', 'toastr'];

let appModule = angular.module("app", appDependencies);

appModule.config(Configuration.enableCors)
         .config(Configuration.exceptionConfig)
         .config(Configuration.statesConfig)
         .factory("httpInterceptor", Configuration.httpInterceptorFactory)
         .controller('appController', AppController)
         .service('layoutService', LayoutService)
         .component(ms(HomeComponent), HomeComponent)
         .component(ms(LoginComponent), LoginComponent)
         .component(ms(MenuComponent), MenuComponent)
         .component(ms(DashboardComponent), DashboardComponent);

appModule.run(function($rootScope : ng.IRootScopeService) {

    $rootScope.$on('$stateChangeStart', function(evt : any, to : any, params : any) {
        console.log(evt, to, params);
    });
});

export default appModule;