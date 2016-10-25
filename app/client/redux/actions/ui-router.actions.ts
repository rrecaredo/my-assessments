import * as actions from './actions';
import state from '../constants';

export const stateChangingAction = actions.actionCreator<{fromState : string, toState : string}>(state.router.STATE_CHANGING);
export const stateChangedAction  = actions.actionCreator<{fromState : string, toState : string}>(state.router.STATE_CHANGED);