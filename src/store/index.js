import Vue from 'vue'
import Vuex from 'vuex'
import {Database} from "@/classes/database.js";


Vue.use(Vuex)

export const store = new Vuex.Store({
    state: { 
        database: new Database(),
        profile: null,
        user: { id: null }
    },
    mutations: {},
    actions: {},
    getters: {}
})

