/**
 * Глобален middleware за обработка на грешки.
 * Трябва да се регистрира след всички маршрути в app.js.
 * Използва status, зададен в err.status, или 500 по подразбиране.
 */
export default function errorHandler(err, req, res, next) {
  // Ако грешката вече е отговорила, предаваме към следващия middleware
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  const message = err.message || 'Възникна грешка на сървъра';
  // Можеш да логнеш грешката тук, например с console.error или външна библиотека
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(status).json({ message });
}