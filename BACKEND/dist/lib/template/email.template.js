"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderFlyPyEmailTemplate = void 0;
const renderFlyPyEmailTemplate = ({ title, body, highlight, footer = "FlyPy • Plataforma educativa", logoUrl = "", }) => {
    return `
  <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&display=swap" rel="stylesheet" />
      <style>
        body {
          font-family: 'Space Grotesk', sans-serif;
          background-color: #0F1724;
          color: #D8EEF0;
          padding: 20px;
          font-size: 16px;
          line-height: 1.6;
        }
        .container {
          max-width: 480px;
          margin: auto;
          background: #0E1B26;
          border: 1px solid #2B3440;
          border-radius: 8px;
          padding: 24px;
        }
        .logo {
          text-align: center;
          margin-bottom: 16px;
        }
        .title {
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          color: #E6EEF3;
          margin-bottom: 12px;
        }
        .body {
          font-size: 16px;
          color: #D8EEF0;
          margin-bottom: 16px;
        }
        .highlight {
          font-size: 36px;
          font-weight: 700;
          color: #21A179;
          background-color: #0B1220;
          padding: 12px 24px;
          border-radius: 6px;
          text-align: center;
          letter-spacing: 2px;
          margin: 24px 0;
        }
        .footer {
          font-size: 12px;
          text-align: center;
          color: #7A8690;
          margin-top: 32px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="${logoUrl}" alt="FlyPy Logo" width="120" />
        </div>
        <div class="title">${title}</div>
        <div class="body">${body}</div>
        ${highlight ? `<div class="highlight">${highlight}</div>` : ""}
        <div class="footer">${footer}</div>
      </div>
    </body>
  </html>
  `;
};
exports.renderFlyPyEmailTemplate = renderFlyPyEmailTemplate;
