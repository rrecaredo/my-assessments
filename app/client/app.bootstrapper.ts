import './app';
import './assets/styles/_global.scss';
import './assets/styles/base/_lists.scss';
import './assets/styles/base/_page.scss';
import './app.scss';
import './assets/styles/vendor/ng-redux-dev-tools.css';

function requireAll(r : any) { r.keys().forEach(r); }
requireAll(require.context('.', true, /\.html$/));

angular.element(document).ready(() => {
    angular.bootstrap(document, ['app']);
});