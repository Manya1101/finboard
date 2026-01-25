# API Dashboard

A modular, configurable **API Dashboard** built with **Next.js**, **Redux Toolkit**, and **Tailwind CSS** that allows users to create, configure, and manage data widgets (Cards, Tables, Charts) powered by external APIs such as **Alpha Vantage**.

This project was developed as part of an internship assignment to demonstrate frontend architecture, API integration patterns, state management, and real-world constraints like CORS, rate limits, and API key security.

---

##  Features

*  **Live Link**

    *Deployed on Vercel:
    *https://vercel.com/manya1101s-projects/finboard/9gLkEJ6LYr2NaFT4mXySQ9RrWc19

*  **Dynamic Widgets**

  * Add, configure, refresh, and delete widgets
  * Widgets support multiple display modes:

    * **Card** – single value KPIs
    * **Table** – structured tabular data
    * **Chart** – time-series visualization

*  **API Integration (Alpha Vantage)**

  * Supports configurable API URLs, query params, headers, and refresh intervals
  * Automatic API key injection via environment variables
  * Graceful handling of rate limits and API errors

*  **State Management**

  * Global widget state managed using **Redux Toolkit**
  * Persistent widgets via `localStorage`
  * Drag-and-drop widget reordering

*  **Modern UI**

  * Built with **Tailwind CSS**
  * Responsive grid layout
  * Skeleton loaders and fallback UI

---

##  Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** JavaScript (ES6+)
* **State Management:** Redux Toolkit
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **Drag & Drop:** @dnd-kit
* **API Provider:** Alpha Vantage
* **Deployment:** Vercel

---

##  Environment Variables

This project uses environment variables to securely manage API keys.

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_ALPHA_VANTAGE_KEY=your_api_key_here
```

---

## API Integration Details

### Alpha Vantage

Alpha Vantage is used as the financial data provider for:

* Stock prices
* Time-series data
* Market-related datasets

Example endpoint used:

```
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL
```

### Data Normalization

Alpha Vantage responses are normalized into arrays to support tables and charts:

```js
[
  {
    date: "2026-01-23",
    open: 190.1,
    high: 195.3,
    low: 188.7,
    close: 193.4,
    volume: 51234123
  }
]
```

This normalized structure allows:

* X-axis → `date`
* Y-axis → `open`, `close`, `volume`, etc.

---

##  CORS & Rate Limit Handling 

### Why API tests may fail in the browser

Alpha Vantage does **not** allow unrestricted browser-based requests. As a result:

* `fetch()` calls may fail due to **CORS restrictions**
* Rate limits may trigger temporary blocks

This is expected behavior and **not a bug** in the project.

### How this project handles it

* API failures are caught and handled gracefully
* UI remains stable even when API requests fail
* Architecture supports easy migration to:

  * Next.js API routes
  * Backend proxy server

---

##  Testing the Dashboard

1. Click **Add Widget**
2. Enter widget name
3. Provide API URL (Alpha Vantage)
4. Select display mode (Card / Table / Chart)
5. Test API
6. Add widget

Widgets can be:

* Reordered via drag-and-drop
* Reconfigured or deleted
* Refreshed manually

---

## Deployment

The project is deployed using **Vercel**.

Deployment steps:

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variable:
   * `NEXT_PUBLIC_ALPHA_VANTAGE_KEY`
4. Deploy

---

##  Assignment Requirements Checklist

✔ Use of reliable financial API (Alpha Vantage)
✔ API key management via environment variables
✔ Rate limit & error handling
✔ Modular, extensible architecture
✔ Support for cards, tables, and charts
✔ Production deployment on Vercel

---

##  Future Improvements

* Backend API proxy for CORS-free requests
* User authentication & saved dashboards
* Advanced chart controls
* Multi-API support (Finnhub, IndianAPI)
* Export widgets as images or CSV

---

##  Key Learnings

* Real-world API integration constraints
* Importance of data normalization
* Scalable frontend architecture
* Handling unreliable external services gracefully

---

##  Author

Developed by **Manya Aggarwal**
