const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const logStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  // Mask sensitive fields from body logs
  const SENSITIVE = ['password', 'confirmPassword', 'token', 'secret'];
  const safeBody = req.body ? { ...req.body } : {};
  SENSITIVE.forEach((k) => { if (safeBody[k]) safeBody[k] = '[REDACTED]'; });

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      ts: new Date().toISOString(),
      method,
      url: originalUrl,
      status: res.statusCode,
      ms: duration,
      ip: ip?.replace('::ffff:', ''),
      user: req.user?._id || 'anon',
    };

    // Console: color-coded by status
    const color =
      res.statusCode >= 500 ? '\x1b[31m' :   // red
      res.statusCode >= 400 ? '\x1b[33m' :   // yellow
      res.statusCode >= 300 ? '\x1b[36m' :   // cyan
      '\x1b[32m';                             // green
    const reset = '\x1b[0m';

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${color}${log.ts} ${method.padEnd(7)} ${String(res.statusCode)} ${originalUrl.padEnd(45)} ${duration}ms${reset}`
      );
    }

    // File log (JSON lines)
    logStream.write(JSON.stringify(log) + '\n');
  });

  next();
};

module.exports = requestLogger;
