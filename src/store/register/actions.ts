import { api } from '@/api';
import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'typesafe-vuex';

import { RegisterState } from './state';
import { MainState } from '../main/state';
import { State } from '../state';
import { commitSetRegisterError } from './mutations';
import { dispatchLogIn } from '../main/actions';

type RegisterContext = ActionContext<RegisterState, State>;

export const actions = {
  async actionRegister(context: RegisterContext, payload) {
    try {
      const response = await api.register(payload);
      if (response.data) {
        dispatchLogIn(context, { username: payload.email, password: payload.password });
      }
    } catch (error) {
      commitSetRegisterError(context, true);
    }
  },
};

const { dispatch } = getStoreAccessors<MainState | any, State>('');

export const dispatchRegister = dispatch(actions.actionRegister);
