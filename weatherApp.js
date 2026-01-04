/* SASSy Weather — client-side demo
   IMPORTANT: Replace 'YOUR_API_KEY_HERE' with your Visual Crossing API key.
   This demo uses the Visual Crossing Timeline API to fetch hourly data across a 48-hour window:
   now - 24 hours .. now + 24 hours.
*/
const fetchWeatherData = async () => {
  const apiKey = 'V4VLASA5XVRG2A9DMHRFRQE7F';
  const location = '37821';
  const unitGroup = 'metric';
  const contentType = 'json';
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&key=${apiKey}&contentType=${contentType}`;
  
  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const weatherData = await response.json();
    console.log(weatherData);
  } catch (error) {
    console.error('Error fetching weather data: ', error);
  }
};

fetchWeatherData();
const API_KEY = 'V4VLASA5XVRG2A9DMHRFRQE7F'; 
const BASE = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

const el = {
  input: document.getElementById('location-input'),
  useLoc: document.getElementById('use-location'),
  refresh: document.getElementById('refresh'),
  status: document.getElementById('status'),
  temp: document.getElementById('temp'),
  condition: document.getElementById('condition'),
  wind: document.getElementById('wind'),
  rain: document.getElementById('rain'),
  place: document.getElementById('place'),
  timeline: document.getElementById('timeline'),
};

function setStatus(msg, isError = false) {
  el.status.textContent = msg;
  el.status.style.color = isError ? '#c23d3d' : 'inherit';
}

function formatHour(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

function formatDateISO(d) {
  // returns YYYY-MM-DD
  return d.toISOString().slice(0,10);
}

function nowRange() {
  const now = new Date();
  const past = new Date(now.getTime() - 24*60*60*1000);
  const future = new Date(now.getTime() + 24*60*60*1000);
  return { start: formatDateISO(past), end: formatDateISO(future) };
}

async function fetchWeatherFor(location) {
  setStatus('Loading…');
  try {
    const { start, end } = nowRange();
    const url = `${BASE}/${encodeURIComponent(location)}/${start}/${end}?unitGroup=metric&include=hours&elements=datetime,temp,conditions,windspd,precipprob&key=${API_KEY}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Network error (${r.status})`);
    const data = await r.json();
    renderData(data);
    setStatus('Updated');
  } catch (err) {
    setStatus('Failed to load weather — ' + err.message, true);
  }
}

function renderData(data) {
  // data.resolvedAddress, data.days[].hours (each hour includes datetime, temp, conditions, windspd, precipprob)
  const locationLabel = data.resolvedAddress || 'Unknown location';
  el.place.textContent = locationLabel;

  // find nearest current hour by timestamp
  const hours = (data.days || []).flatMap(d => (d.hours || []).map(h => {
    // Visual Crossing returns datetime local time string like "2026-01-03T13:00:00"
    return Object.assign({}, h, { timeISO: h.datetime });
  }));

  if (!hours.length) {
    setStatus('No hourly data', true);
    return;
  }

  // pick the middle hour (closest to now)
  const now = new Date();
  let closest = hours.reduce((a,b) => Math.abs(new Date(a.timeISO) - now) < Math.abs(new Date(b.timeISO) - now) ? a : b, hours[0]);

  el.temp.textContent = Math.round(closest.temp) + '°';
  el.condition.textContent = closest.conditions || '-';
  el.wind.textContent = `${Math.round(closest.windspd || 0)} km/h`;
  el.rain.textContent = `${Math.round(closest.precipprob || 0)}%`;

  // Build timeline: sort by time
  hours.sort((a,b) => new Date(a.timeISO) - new Date(b.timeISO));

  el.timeline.innerHTML = '';
  hours.forEach(h => {
    const item = document.createElement('div');
    item.className = 'hour';
    const time = document.createElement('div'); time.className = 'h-time'; time.textContent = formatHour(new Date(h.timeISO));
    const temp = document.createElement('div'); temp.className = 'h-temp'; temp.textContent = Math.round(h.temp) + '°';
    const desc = document.createElement('div'); desc.className = 'h-desc'; desc.textContent = h.conditions || '';
    item.appendChild(time);
    item.appendChild(temp);
    item.appendChild(desc);
    el.timeline.appendChild(item);
  });
}

function handleSearch() {
  const v = el.input.value.trim();
  if (!v) {
    setStatus('Enter a location (city, postal code, or place)', true);
    return;
  }
  fetchWeatherFor(v);
}

function handleUseLocation() {
  if (!navigator.geolocation) {
    setStatus('Geolocation not supported', true);
    return;
  }
  setStatus('Locating…');
  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude } = pos.coords;
    const location = `${latitude},${longitude}`;
    el.input.value = location;
    fetchWeatherFor(location);
  }, err => {
    setStatus('Unable to get location: ' + err.message, true);
  }, { timeout: 10000 });
}

function init() {
  // wire up controls
  el.refresh.addEventListener('click', handleSearch);
  el.useLoc.addEventListener('click', handleUseLocation);
  el.input.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });

  // initial sample: default to London for users without location (or you can choose a different fallback)
  el.input.value = 'London';
  fetchWeatherFor(el.input.value);
}


document.addEventListener('DOMContentLoaded', init);

