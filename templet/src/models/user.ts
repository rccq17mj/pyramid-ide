import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, query as queryUsers } from '@/core/services/user';
import { userRequest } from "@/requests/user.request";
import { APP_CONFIG } from "@/core/configs/app.config";
import { API_CONFIG } from '@/core/configs/api.config';
import { httpService } from '@react-kit/http';
import user from 'mock/user';

export interface CurrentUser {
  avatar?: string;
  userId?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
  subscriptions: {
    init: Effect;
  }
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
    },
    *fetchCurrent(_, { call, put }) {
      // 获取用户信息
      let userInfo: CurrentUser = {};
      let congoToken = localStorage.getItem('congoToken');
      try {
        if(congoToken){
            const res = yield call(httpService.post, API_CONFIG.MAIN.GET_CURRENT_USER_INFO);
            userInfo.name =  res.data.data.nickname;
            userInfo.userId = res.data.data.id;
        }else{
          throw new Error('congoToken Is null');
        }
      } catch (error) {
        userInfo = yield call(queryCurrent);
      }
      yield put({
        type: 'saveCurrentUser',
        payload: userInfo,
      });
    }
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
  subscriptions: {
    init({ dispatch, history }) {
    }
  }
};

export default UserModel;
