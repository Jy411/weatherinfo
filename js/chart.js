let labels = [];
let precipData = [];

function getHistory() {
  labels = [];
  precipData = [];
  let cityText = document.getElementById("city").innerText;
  let timeNow = new Date(unformatTime);
  let hh = timeNow.getHours();
  let dd = timeNow.getDate();
  if (dd < 10) {
    dd = "0" + dd;
  }
  let mm = timeNow.getMonth() + 1;
  if (mm < 10) {
    mm = "0" + mm;
  }
  let yyyy = timeNow.getFullYear();
  let endFormat = `${yyyy}-${mm}-${dd}:${hh}`;

  let yesterday = new Date(unformatTime);
  yesterday.setDate(yesterday.getDate()-1);
  hh = yesterday.getHours();
  dd = yesterday.getDate();
  if (dd < 10) {
    dd = "0" + dd;
  }
  mm = yesterday.getMonth() + 1;
  if (mm < 10) {
    mm = "0" + mm;
  }
  yyyy = yesterday.getFullYear();
  let startFormat = `${yyyy}-${mm}-${dd}:${hh}`;

  const data = getObject(`https://api.weatherbit.io/v2.0/history/hourly?city=${cityText}&start_date=${startFormat}&end_date=${endFormat}&units=${tempUnit}&key=${apiKey}`);
  for (let i = 0; i < 24; i++) {
    let date = new Date(data.data[i].timestamp_utc);
    labels.push(date.getHours());
    precipData.push(data.data[i].precip);
  }
}
getHistory();

function precipChart() {
  const data = {
    labels: labels,
    datasets: [{
      label: 'Precipitation',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: precipData,
    }]
  };

  const config = {
    type: 'line',
    data,
    options: {}
  };

  var myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
}
precipChart();

function redoChart() {
  let chartDiv = document.getElementById("chartDisplay");
  chartDiv.innerHTML = "";
  let chart = document.createElement("canvas");
  chart.setAttribute("id", "myChart")
  chartDiv.append(chart);
  getHistory();
  precipChart();
}