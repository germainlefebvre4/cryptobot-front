import { mutations } from './mutations';
import { actions } from './actions';
import { RegisterState } from './state';

const defaultState: RegisterState = {
  newUser: null,
  registerLoading: false,
  registerError: false,
};

export const registerModule = {
  state: defaultState,
  mutations,
  actions,
};
