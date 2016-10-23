import {states} from './app.states';
import {IAuthService} from './services/auth.service';

export class Configuration {
    /* @ngInject */
    static httpInterceptorFactory(store : any) {
        return {
            request(config: ng.IRequestConfig) {
                if (config.url.indexOf(".html") === -1) {
                    Configuration.transformHeader(config, store);
                }

                return config;
            }
        };
    }

    /* @ngInject */
    static registerInterceptors($httpProvider : ng.IHttpProvider) {
        $httpProvider.interceptors.push("httpInterceptor");
    }

    /* @ngInject */
    static enableCors($httpProvider: ng.IHttpProvider) {

        ($httpProvider.defaults as any).useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
    }

    /* @ngInject */
    static exceptionConfig($provide: ng.auto.IProvideService) {
        $provide.decorator("$exceptionHandler", Configuration.extendExceptionHandler);
    }

    /* @ngInject */
    static statesConfig($stateProvider: ng.ui.IStateProvider, $urlRouterProvider : ng.ui.IUrlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        states.forEach((state) => {
            $stateProvider.state(state);
        });
    }

    /* @ngInject */
    static stateHandlers($rootScope: ng.IRootScopeService, authService : IAuthService, $state : ng.ui.IStateService) {
        //TODO: Convert to a provider and allow configuration (login, unauthorized)
        $rootScope.$on('$stateChangeStart', (evt: any, to: any, params: any) => {

            if (to.name === 'login' && authService.getToken())
                $state.go('home');

            else if (to.data && to.data.requiresLogin) {
                if (!authService.getToken()) {
                    evt.preventDefault();
                    $state.go('login');
                }
            }

            console.log(evt, to, params);
        });
    }

    /* @ngInject */
    static materialConfig($mdThemingProvider : ng.material.IThemingProvider) {
        $mdThemingProvider.theme('altTheme').primaryPalette('teal');
        $mdThemingProvider.setDefaultTheme('altTheme');
    }

    private static transformHeader(config: ng.IRequestConfig, store : any) {
        let authObj = store.get('auth');

        if (authObj && authObj.token)
            config.headers["Authorization"] = store.get('auth').token;
    };

    /* @ngInject */
    private static extendExceptionHandler($delegate: ng.IExceptionHandlerService, $injector: ng.auto.IInjectorService) {
        return (exception: any, cause: any) => {
            $delegate(exception, cause);
            let toastr = $injector.get("toastr") as Toastr;
            toastr.error(exception.message, "", { closeButton: true });
        };
    }
}

