'use strict';

const express = require('express');
const path = require('path');
const { calculateMortgageScenario } = require('./src/mortgage');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/mortgage/calculate', (req, res) => {
  try {
    const result = calculateMortgageScenario(req.body || {});
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message || 'Dati non validi'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
