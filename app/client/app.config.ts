import {states} from './app.states';

export class Configuration {
    /* @ngInject */
    static httpInterceptorFactory() {
        return {
            request(config: ng.IRequestConfig) {
                if (config.url.indexOf(".html") === -1) {
                    Configuration.transformHeader(config);
                }
                return config;
            },
            response(response: any) {
            },
            responseError(response: any) {
            }
        };
    }

    /* @ngInject */
    static enableCors($httpProvider: ng.IHttpProvider) {

        ($httpProvider.defaults as any).useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];

        //$httpProvider.interceptors.push("httpInterceptor");
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

    private static transformHeader(config: ng.IRequestConfig) {
        // Add JWT Token
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

