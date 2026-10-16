type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  module?: string;
  action?: string;
  [key: string]: unknown;
}

class ServerLogger {
  private formatLog(level: LogLevel, message: string, payload?: LogPayload) {
    const timestamp = new Date().toISOString();
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...payload,
    });
  }

  info(message: string, payload?: LogPayload) {
    console.log(this.formatLog("info", message, payload));
  }

  warn(message: string, payload?: LogPayload) {
    console.warn(this.formatLog("warn", message, payload));
  }

  error(message: string, payload?: LogPayload) {
    console.error(this.formatLog("error", message, payload));
  }

  debug(message: string, payload?: LogPayload) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.formatLog("debug", message, payload));
    }
  }
}

export const logger = new ServerLogger();
