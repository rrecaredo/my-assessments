import {ILayoutService} from './services';
import * as model from './models';

const home = {
    name: 'home',
    url: '/',
    views: {
        '@': {
            template: '<ma-home></ma-home>',
            controllerAs : 'vm'
        },
        'nav@home': {
            template: '<ma-menu menu-items="$resolve.menuItems"></ma-menu>',
            controllerAs: 'vm'
        },
        'body@home': {
            template: '<ma-dashboard></ma-dashboard>',
            controllerAs: 'vm'
        }
    }
};

const positions = {
    name : 'positions',
    parent: 'home',
    url : '/positions',
    views: {
        'body@home': {
            template: 'Positions',
            controllerAs: 'vm'
        }
    }
};

const assessments = {
    name : 'assessments',
    parent: 'home',
    url : '/assessments',
    views: {
        'body@home': {
            template: 'Assessments',
            controllerAs: 'vm'
        }
    }
};

const login = {
    name: 'login',
    url: '/login',
    template: '<ma-login></ma-login>',
    controllerAs: 'vm'
};

export let states = [home, positions, assessments, login,];

