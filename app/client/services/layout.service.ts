import * as model from '../models';

export interface ILayoutService {
    getMenuItems(): model.IMenuItem[];
}

export class LayoutService implements ILayoutService {
    getMenuItems(): model.IMenuItem[] {
        return [{ title : 'Dashboard'  , state : 'home' },
                { title : 'Positions'  , state : 'positions' },
                { title : 'Assessments', state : 'assessments' }];
    }
}