const API_BASE = "/api/sensors";

const tableBody = document.querySelector("#sensorsTable tbody");
const configPanel = document.getElementById("configPanel");
const configForm = document.getElementById("configForm");

function fetchSensors() {
  fetch(API_BASE)
    .then(res => res.json())
    .then(data => renderTable(data));
}

function renderTable(sensors) {
  tableBody.innerHTML = "";

  sensors.forEach(sensor => {
    const row = document.createElement("tr");

    const online = isOnline(sensor.lastSeen);

    row.innerHTML = `
      <td>${sensor.id}</td>
      <td>${sensor.name || "-"}</td>
      <td>${sensor.lastHumidity ?? "-"}</td>
      <td class="${online ? "online" : "offline"}">
        ${online ? "Online" : "Offline"}
      </td>
      <td>${sensor.thresholdMin ?? "-"}</td>
      <td>${sensor.thresholdMax ?? "-"}</td>
      <td>
        <button onclick="openConfig('${sensor.id}', '${sensor.name || ""}', ${sensor.thresholdMin}, ${sensor.thresholdMax})">
          Configura
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function isOnline(lastSeen) {
  if (!lastSeen) return false;
  const now = Date.now();
  return now - lastSeen < 5 * 60 * 1000;
}

function openConfig(id, name, min, max) {
  configPanel.classList.remove("hidden");

  document.getElementById("sensorId").value = id;
  document.getElementById("sensorName").value = name || "";
  document.getElementById("thresholdMin").value = min || "";
  document.getElementById("thresholdMax").value = max || "";
}

document.getElementById("cancelBtn").onclick = () => {
  configPanel.classList.add("hidden");
};

configForm.onsubmit = (e) => {
  e.preventDefault();

  const id = document.getElementById("sensorId").value;

  const payload = {
    name: document.getElementById("sensorName").value,
    thresholdMin: Number(document.getElementById("thresholdMin").value),
    thresholdMax: Number(document.getElementById("thresholdMax").value)
  };

  fetch(`${API_BASE}/${id}/config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).then(() => {
    configPanel.classList.add("hidden");
    fetchSensors();
  });
};

// refresh automatico ogni 5 secondi
setInterval(fetchSensors, 5000);

// primo caricamento
fetchSensors();
