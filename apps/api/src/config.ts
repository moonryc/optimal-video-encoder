import env from "env-var";
import settings from "./settings.json";
const getEnv = env.get;

const locationConfig = {
  watchDirectory: settings.inputDestination,
  destination: settings.outputDestination,
  tempDestination: `${settings.outputDestination}/temp`,
};

const redisConfig = {
  host: getEnv("REDIS_HOST").default("127.0.0.1").asString(), //TODO: get from env
  port: getEnv("REDIS_PORT").default(25683).asInt(), //TODO: get from env
  password: getEnv("REDIS_PASSWORD").default("0!TeyXvUS5ikCL").asString(),
  workerConcurrency: getEnv("WORKER_CONCURRENCY").default(6).asInt(),
  queueName: getEnv("QUEUE_NAME").default("video-transcoder").asString()
}

const postgresConfig = {
  host: getEnv("POSTGRES_HOST").default("127.0.0.1").asString(),
  port: getEnv("POSTGRES_PORT").default("5432").asInt(),
  username: getEnv("POSTGRES_USERNAME").default("app").asString(),
  password: getEnv("POSTGRES_PASSWORD").default("app").asString(),
  user: getEnv("POSTGRES_USER").default("moonryc").asString(),
  database: getEnv("POSTGRES_DATABASE").default("netflix_plus").asString()
}

export const CONFIG = {
  postgresConfig,
  locationConfig,
  redisConfig,
  cleanupOriginals: getEnv("CLEANUP_ORIGINALS").default("true").asBool(),
  disableDB: getEnv("DISABLE_DB").default("false").asBool(),
  logProgress: getEnv("LOG_PROGRESS").default("true").asBool(),
}

export const FOUR_K_RESOLUTION = {
  width: 3840,
  height: 2160
};
