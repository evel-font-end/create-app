import Vue from 'vue'
import Vuex from 'vuex'
import { createStore } from 'vuex'
import user from './modules/user'
// 全局
import state from './public/state'
import mutations from './public/mutations'
import * as getters from './public/getters'
import * as actions from './public/actions'
export default createStore({
  state,
  mutations,
  getters,
  actions,
  modules: {
    user
  }
})
