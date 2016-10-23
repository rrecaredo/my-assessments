import {ILayoutService} from './services';
import * as model from './models';

const home = {
    name: 'home',
    url: '/',
    data : {
        requiresLogin : true
    },
    views: {
        '@': {
            template: '<ma-home></ma-home>',
            controllerAs: 'vm'
        },
        'nav@home': {
            template: '<ma-subnavigation items="$resolve.menuItems"></ma-subnavigation>',
            controllerAs: 'vm'
        },
        'body@home': {
            template: '<ma-dashboard></ma-dashboard>',
            controllerAs: 'vm'
        }
    }
};

const positions = {
    name: 'positions',
    parent: 'home',
    url: '/positions',
    data : {
        requiresLogin : true,
        roles : ['admin']
    },
    views: {
        'body@home': {
            template: 'Positions',
            controllerAs: 'vm'
        }
    }
};

const assessments = {
    name: 'assessments',
    parent: 'home',
    url: '/assessments',
    data : {
        requiresLogin : true,
        roles : ['admin']
    },
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
    data : {
        requiresLogin : false
    },
    template: '<ma-login></ma-login>',
    controllerAs: 'vm'
};

export let states = [home, positions, assessments, login];