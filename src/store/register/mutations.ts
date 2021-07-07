import { getStoreAccessors } from 'typesafe-vuex';
import { RegisterState } from './state';
import { State } from '../state';

export const mutations = {
  setRegisterError(state: RegisterState, payload: boolean) {
    state.registerError = payload;
  },
};

const {commit} = getStoreAccessors<RegisterState | any, State>('');

export const commitSetRegisterError = commit(mutations.setRegisterError);
