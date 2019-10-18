import { fireDb } from "~/plugins/firebase.js";
const _ = require("lodash");

export const state = () => ({
  marken: [],
  teams: []
});

export const mutations = {
  pushMarke(state, marke) {
    state.marken.push(marke);
  },
  pushTeam(state, team) {
    state.teams.push(team);
  },
  addAmount(state, team) {
    state.teams[team.index].amount =
      state.teams[team.index].amount + team.amount;
  },
  removeAmount(state, team) {
    state.teams[team.index].amount =
      state.teams[team.index].amount - team.amount;
  }
};

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch("getmarken");
    await dispatch("getteams");
  },

  async getmarken({ commit }) {
    const ref = fireDb.collection("marken");
    let snap;
    try {
      snap = await ref.orderBy("order").get();
    } catch (e) {
      console.error(e);
    }
    snap.forEach(doc => {
      commit("pushMarke", {
        id: String(doc.id),
        wert: doc.data().wert,
        amount: doc.data().amount
      });
    });
  },

  async getteams({ commit }) {
    const ref = fireDb.collection("teams");
    let snap;
    try {
      snap = await ref.orderBy("color", "desc").get();
    } catch (e) {
      console.error(e);
    }
    snap.forEach(doc => {
      commit("pushTeam", {
        id: String(doc.id),
        name: doc.data().name,
        amount: doc.data().amount,
        color: doc.data().color
      });
    });
  },

  async addAmountToTeam({ commit, state }, team) {
    let index = _.findIndex(state.teams, { id: team.id });
    commit("addAmount", { index: index, amount: team.amount });

    const ref = fireDb.collection("teams").doc(team.id);

    try {
      await ref.set({ amount: state.teams[index].amount }, { merge: true });
    } catch (e) {
      alert(e);
      commit("addAmount", { index: index, amount: team.amount });
    }
  }
};
