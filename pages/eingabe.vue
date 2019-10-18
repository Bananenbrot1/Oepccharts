<template>
  <b-container fluid>
    <b-modal
      id="modal"
      :title="selectedTeam"
      hide-footer
    >
      <b-button
        v-for="marke in marken"
        v-bind:key="marke.id"
        block
        variant="primary"
        size="lg"
        class="p-4"
        @click="sendAmount(marke.amount)"
      >
        {{marke.wert}}
      </b-button>
    </b-modal>
    <div class="p-1">
    </div>
    <b-row
      v-for="team in teams"
      v-bind:key="team.id"
      class="p-2"
    >
      <b-col>
        <b-button
          size="lg"
          :variant="team.color"
          block
          class="p-4"
          @click="sendInfo(team)"
        >
          <h3>{{ team.name }}</h3>
          {{team.amount}} Liter
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { fireDb } from "~/plugins/firebase.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      selectedTeam: "",
      selectedTeamID: ""
    };
  },

  computed: {
    ...mapState(["marken", "teams"])
  },

  methods: {
    sendInfo(team) {
      this.selectedTeam = team.name;
      this.selectedTeamID = team.id;
      this.$bvModal.show("modal");
    },
    sendAmount(amount) {
      this.$store.dispatch("addAmountToTeam", {
        id: this.selectedTeamID,
        amount: amount
      });
      this.$bvModal.hide("modal");
    }
  }
};
</script>

<style>
</style>