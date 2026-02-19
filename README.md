# Gestione Mediatore Credito

Applicazione web per velocizzare la simulazione di mutui in fase di consulenza al cliente.

## Funzionalità principali
- Form web rapido con dati cliente/immobile.
- Calcolo rata mensile con ammortamento alla francese.
- Indicatori utili alla pre-valutazione:
  - LTV (Loan to Value)
  - Debt-to-Income prima/dopo mutuo
  - Rata massima consigliata
- Stima semplificata della probabilità di approvazione con note operative.

## Requisiti
- Node.js 14+

## Avvio locale
```bash
cd backend
npm install
npm start
```

Apri il browser su `http://localhost:3000`.

## API
### `POST /api/mortgage/calculate`
Body JSON di esempio:
```json
{
  "propertyValue": 220000,
  "requestedAmount": 160000,
  "annualRate": 3.5,
  "years": 25,
  "monthlyIncome": 3000,
  "monthlyDebts": 250,
  "applicantAge": 37
}
```

## Test
```bash
cd backend
npm test
```
