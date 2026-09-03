let vuelos = [
  { numero: 'LA2045', aerolinea: 'LATAM', origen: 'Lima (LIM)', destino: 'Cusco (CUZ)', salida: '06:30', llegada: '08:05', puerta: '12', estado: 'Programado', motivo: '' },
  { numero: 'AV204', aerolinea: 'Avianca', origen: 'Lima (LIM)', destino: 'Bogotá (BOG)', salida: '09:15', llegada: '12:40', puerta: '5', estado: 'En vuelo', motivo: '' },
  { numero: 'LA2050', aerolinea: 'LATAM', origen: 'Lima (LIM)', destino: 'Cusco (CUZ)', salida: '10:00', llegada: '11:35', puerta: '14', estado: 'Retrasado', motivo: 'condiciones climáticas en destino' },
  { numero: 'H2301', aerolinea: 'Sky Airline', origen: 'Lima (LIM)', destino: 'Arequipa (AQP)', salida: '07:20', llegada: '08:45', puerta: '3', estado: 'Aterrizado', motivo: '' },
  { numero: 'LA2088', aerolinea: 'LATAM', origen: 'Lima (LIM)', destino: 'Piura (PIU)', salida: '13:10', llegada: '14:35', puerta: '9', estado: 'Cancelado', motivo: 'falla técnica' }
];

document.querySelectorAll('.tab-btn').forEach(function (boton) {
  boton.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
    document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
    boton.classList.add('active');
    document.getElementById(boton.dataset.tab).classList.add('active');
    if (boton.dataset.tab === 'actualizacion') poblarSelectVuelos();
  });
});

function filaVuelo(v) {
  const claseEstado = 'estado-' + v.estado.replace(/\s+/g, '');
  return '<tr>' +
    '<td>' + v.numero + '</td>' +
    '<td>' + v.aerolinea + '</td>' +
    '<td>' + v.origen + ' → ' + v.destino + '</td>' +
    '<td>' + v.salida + '</td>' +
    '<td>' + v.llegada + '</td>' +
    '<td>' + v.puerta + '</td>' +
    '<td><span class="estado-badge ' + claseEstado + '">' + v.estado + '</span></td>' +
    '</tr>';
}

function renderTablaRegistro() {
  document.getElementById('tablaRegistro').innerHTML = vuelos.map(filaVuelo).join('');
}

function validarNumeroVuelo(numero) {
  return /^[A-Z]{2}\d{3,4}$/.test(numero.toUpperCase());
}

document.getElementById('formRegistro').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const numero = document.getElementById('numero').value.trim().toUpperCase();
  const salida = document.getElementById('horaSalida').value;
  const llegada = document.getElementById('horaLlegada').value;
  const errorEl = document.getElementById('errorRegistro');

  if (!validarNumeroVuelo(numero)) {
    errorEl.textContent = 'El número de vuelo debe tener el formato XX000, ej: LA2045';
    return;
  }
  if (llegada <= salida) {
    errorEl.textContent = 'La hora de llegada debe ser posterior a la hora de salida';
    return;
  }

  errorEl.textContent = '';
  vuelos.push({
    numero: numero,
    aerolinea: document.getElementById('aerolinea').value.trim(),
    origen: document.getElementById('origen').value.trim(),
    destino: document.getElementById('destino').value.trim(),
    salida: salida,
    llegada: llegada,
    puerta: document.getElementById('puerta').value.trim(),
    estado: 'Programado',
    motivo: ''
  });

  renderTablaRegistro();
  evento.target.reset();
});

document.getElementById('btnBuscar').addEventListener('click', function () {
  const texto = document.getElementById('buscarTexto').value.trim().toLowerCase();
  const estadoFiltro = document.getElementById('filtroEstado').value;

  const resultado = vuelos.filter(function (v) {
    const coincideTexto = !texto ||
      v.numero.toLowerCase().includes(texto) ||
      v.aerolinea.toLowerCase().includes(texto) ||
      v.origen.toLowerCase().includes(texto) ||
      v.destino.toLowerCase().includes(texto);
    const coincideEstado = !estadoFiltro || v.estado === estadoFiltro;
    return coincideTexto && coincideEstado;
  });

  document.getElementById('tablaConsulta').innerHTML = resultado.map(filaVuelo).join('');
});

function poblarSelectVuelos() {
  const select = document.getElementById('selectVuelo');
  select.innerHTML = vuelos.map(function (v) {
    return '<option value="' + v.numero + '">' + v.numero + ' — ' + v.origen + ' → ' + v.destino + '</option>';
  }).join('');
}

document.getElementById('formActualizacion').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const numero = document.getElementById('selectVuelo').value;
  const nuevoEstado = document.getElementById('nuevoEstado').value;
  const motivo = document.getElementById('motivo').value.trim();

  const vuelo = vuelos.find(function (v) { return v.numero === numero; });
  if (!vuelo) return;

  vuelo.estado = nuevoEstado;
  vuelo.motivo = motivo;

  document.getElementById('confirmacionActualizacion').textContent =
    'Vuelo ' + numero + ' actualizado a "' + nuevoEstado + '"' + (motivo ? ' — Motivo: ' + motivo : '');

  renderTablaRegistro();
  document.getElementById('motivo').value = '';
});

document.getElementById('btnGenerarReporte').addEventListener('click', function () {
  const total = vuelos.length;
  const conteoRutas = {};
  vuelos.forEach(function (v) {
    const ruta = v.origen + ' → ' + v.destino;
    conteoRutas[ruta] = (conteoRutas[ruta] || 0) + 1;
  });

  let rutaTop = '—';
  let maxConteo = 0;
  for (const ruta in conteoRutas) {
    if (conteoRutas[ruta] > maxConteo) {
      maxConteo = conteoRutas[ruta];
      rutaTop = ruta;
    }
  }

  const retrasados = vuelos.filter(function (v) { return v.estado === 'Retrasado'; }).length;
  const cancelados = vuelos.filter(function (v) { return v.estado === 'Cancelado'; }).length;
  const pctRetrasados = total ? Math.round((retrasados / total) * 100) : 0;
  const pctCancelados = total ? Math.round((cancelados / total) * 100) : 0;

  document.getElementById('statsReporte').innerHTML =
    '<div class="stat-card"><div class="valor">' + total + '</div><div class="etiqueta">Total de vuelos</div></div>' +
    '<div class="stat-card"><div class="valor">' + rutaTop + '</div><div class="etiqueta">Ruta más frecuente</div></div>' +
    '<div class="stat-card"><div class="valor">' + pctRetrasados + '%</div><div class="etiqueta">Vuelos retrasados</div></div>' +
    '<div class="stat-card"><div class="valor">' + pctCancelados + '%</div><div class="etiqueta">Vuelos cancelados</div></div>';
});

renderTablaRegistro();
