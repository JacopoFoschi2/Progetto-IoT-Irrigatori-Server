<script>
export default {
  name: "GreenhouseDashboard",
  data() {
    return {
      sensors: [],
      showConfigPanel: false,
      newPumpPin: null, // <-- nuovo: pin per nuova pompa
      currentSensor: {
        id: "",
        name: "",
        thresholdMin: null,
        thresholdMax: null,
      },
      pumps: [], // <-- nuovo: pompe del sensore selezionato
      API_BASE: "/api/sensors",
      API_PUMPS: "/api/pumps", // <-- nuovo
    };
  },
  methods: {
    fetchSensors() {
      fetch(this.API_BASE)
        .then((res) => res.json())
        .then((data) => {
          this.sensors = data;
        });
    },
    isOnline(lastSeen) {
      if (!lastSeen) return false;
      const now = Date.now();
      return now - lastSeen < 5 * 60 * 1000;
    },
    // Recupera le pompe collegate a un sensore
    fetchPumps(sensorId) {
      fetch(`${this.API_PUMPS}/${sensorId}`)
        .then(res => res.json())
        .then(data => {
          this.pumps = data;
        });
    },

    // Aggiunge una pompa a un sensore
    addPump(sensorId, pin) {
      fetch(`${this.API_PUMPS}/${sensorId}/${pin}`, { method: "POST" })
        .then(() => this.fetchPumps(sensorId));
    },

    // Rimuove una pompa da un sensore
    removePump(sensorId, pin) {
      fetch(`${this.API_PUMPS}/${sensorId}/${pin}`, { method: "DELETE" })
        .then(() => this.fetchPumps(sensorId));
    },

    // Apri pannello config e carica le pompe
    openConfig(sensor) {
      this.currentSensor = { ...sensor };
      this.showConfigPanel = true;
      this.fetchPumps(sensor.id); // <-- nuovo: carica pompe
    },
    openConfig(sensor) {
      this.currentSensor = { ...sensor }; // copia i valori
      this.showConfigPanel = true;
    },
    cancelConfig() {
      this.showConfigPanel = false;
    },
    saveConfig() {
      fetch(`${this.API_BASE}/${this.currentSensor.id}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.currentSensor.name,
          thresholdMin: this.currentSensor.thresholdMin,
          thresholdMax: this.currentSensor.thresholdMax,
        }),
      }).then(() => {
        this.showConfigPanel = false;
        this.fetchSensors();
      });
    },
  },
  mounted() {
    this.fetchSensors();
    setInterval(this.fetchSensors, 5000);
  },
};
</script>


<template>
  <div>
    <h1>Dashboard Serra</h1>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Umidità</th>
          <th>Stato</th>
          <th>Threshold Min</th>
          <th>Threshold Max</th>
          <th>Azione</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sensor in sensors" :key="sensor.id">
          <td>{{ sensor.id }}</td>
          <td>{{ sensor.name || '-' }}</td>
          <td>{{ sensor.lastHumidity ?? '-' }}</td>
          <td :class="isOnline(sensor.lastSeen) ? 'online' : 'offline'">
            {{ isOnline(sensor.lastSeen) ? 'Online' : 'Offline' }}
          </td>
          <td>{{ sensor.thresholdMin ?? '-' }}</td>
          <td>{{ sensor.thresholdMax ?? '-' }}</td>
          <td>
            <button @click="openConfig(sensor)">Configura</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form configurazione -->
    <div v-if="showConfigPanel" id="configPanel">
      <h2>Configura sensore</h2>
      <form @submit.prevent="saveConfig">
        <input type="hidden" v-model="currentSensor.id" />

        <label>
          Nome:
          <input type="text" v-model="currentSensor.name" />
        </label>

        <label>
          Threshold Min:
          <input type="number" v-model.number="currentSensor.thresholdMin" />
        </label>

        <label>
          Threshold Max:
          <input type="number" v-model.number="currentSensor.thresholdMax" />
        </label>

        <button type="submit">Salva</button>
        <button type="button" @click="cancelConfig">Annulla</button>
      </form>
      <!-- Se ci sono pompe, mostriamo la sezione di gestione -->
      <div v-if="pumps.length > 0" style="margin-top: 20px;">
        <h3>Pompe collegate</h3>
        <ul>
          <li v-for="pump in pumps" :key="pump.pin">
            Pompa Pin: {{ pump.pin }}
            <button @click="removePump(currentSensor.id, pump.pin)">Rimuovi</button>
          </li>
        </ul>

        <label>
          Aggiungi Pompa (Pin):
          <input type="number" v-model.number="newPumpPin" />
          <button type="button" @click="addPump(currentSensor.id, newPumpPin)">Aggiungi</button>
        </label>
      </div>
    </div>
  </div>
</template>


<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 40px;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f0f0f0;
}

.online {
  color: green;
  font-weight: bold;
}

.offline {
  color: red;
  font-weight: bold;
}

#configPanel {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  width: 300px;
}

label {
  display: block;
  margin: 10px 0;
}
</style>
