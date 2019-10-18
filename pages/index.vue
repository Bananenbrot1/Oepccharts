<template>
  <b-container
    class="mainwrapper"
    fluid
  >
    <b-row class="setheight">
      <client-only placeholder="Loading...">
        <b-col>
          <apexcharts
            type="bar"
            height=400
            :options="options_damen"
            :series="series_damen"
          ></apexcharts>
        </b-col>
        <b-col>
          <apexcharts
            type="bar"
            height=400
            :options="options_herren"
            :series="series_herren"
          ></apexcharts>
        </b-col>
      </client-only>
    </b-row>
    <div class="d-md-none">hide on screens wider than lg</div>
    <div class="d-none d-md-block">hide on screens smaller than lg</div>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import { fireDb } from "~/plugins/firebase.js";
const _ = require("lodash");

export default {
  components: {
    Apexcharts: () => import("vue-apexcharts")
  },

  computed: {
    ...mapState(["marken", "teams"])
  },
  created() {
    this.interval = setInterval(() => this.updateChart(), 30000);
  },
  mounted: function() {
    let herrenTeams = _.filter(this.teams, { color: "primary" });
    let damenTeams = _.filter(this.teams, { color: "danger" });
    let herrenTeamNames = _.map(herrenTeams, "name");
    let herrenTeamAmounts = _.map(herrenTeams, "amount");
    let damenTeamNames = _.map(damenTeams, "name");
    let damenTeamAmounts = _.map(damenTeams, "amount");

    this.options_herren.xaxis.categories = herrenTeamNames;
    this.series_herren[0].data = herrenTeamAmounts;
    this.options_damen.xaxis.categories = damenTeamNames;
    this.series_damen[0].data = damenTeamAmounts.map(function(x) {
      return (x * -1).toFixed(1);
    });
  },

  data() {
    return {
      options_herren: {
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        colors: ["#008FFB"],
        chart: {
          id: "vuechart-example",
          stacked: true
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        },
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          offsetY: -4,
          style: {
            fontSize: "30px",
            colors: ["#fff"]
          },
          formatter: function(val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        yaxis: {
          labels: {
            show: false
          }
        }
      },
      options_damen: {
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        colors: ["#FF4560"],
        chart: {
          id: "vuechart-example",
          stacked: true
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        },
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          offsetY: -4,
          style: {
            colors: ["#fff"],
            fontSize: "30px"
          },
          formatter: function(val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        yaxis: {
          labels: {
            show: false
          }
        }
      },
      series_herren: [
        {
          name: "Herren",
          data: [1.1, 0, 0, 0, 0, 0, 0, 0]
        }
      ],
      series_damen: [
        {
          name: "Damen",
          data: [0, 0, 0, 0, 0, 0, 0, 0]
        }
      ]
    };
  },
  methods: {
    async updateChart() {
      const ref = fireDb.collection("teams");
      let snap;
      let updateTeam = [];
      try {
        snap = await ref.orderBy("color", "desc").get();
      } catch (e) {
        console.error(e);
      }
      snap.forEach(doc => {
        updateTeam.push({
          id: String(doc.id),
          name: doc.data().name,
          amount: doc.data().amount,
          color: doc.data().color
        });
      });
      let herrenTeams = _.filter(updateTeam, { color: "primary" });
      let damenTeams = _.filter(updateTeam, { color: "danger" });
      let herrenTeamAmounts = _.map(herrenTeams, "amount");
      let damenTeamAmounts = _.map(damenTeams, "amount");
      this.series_herren = [{ data: herrenTeamAmounts }];
      this.series_damen = [
        {
          data: damenTeamAmounts.map(function(x) {
            return (x * -1).toFixed(1);
          })
        }
      ];
    }
  }
};
</script>

<style>
body {
  background-color: #3c3c3c;
}
</style>