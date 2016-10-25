declare namespace NgReduxDevTools {
    interface IDevToolsServiceProvider {
        instrument() : Function;
    }
}

declare module 'ng-redux-dev-tools' {
    export = NgReduxDevTools;
}