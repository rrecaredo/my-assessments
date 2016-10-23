import * as model from '../models';

export interface ILayoutService {
    getNavigationItems(): model.INavigationItem[];
}

export class LayoutService implements ILayoutService {
    getNavigationItems(): model.INavigationItem[] {
        return [{ title : 'Home'       , state : 'home'        , icon : 'home'       },
                { title : 'Positions'  , state : 'positions'   , icon : 'people'     },
                { title : 'Assessments', state : 'assessments' , icon : 'assignment' }];
    }
}