import env from "env-var";

const getEnv = env.get;

const locationConfig = {
  watchDirectory: "", //settings.inputDestination,
  destination: "",//settings.outputDestination,
  tempDestination: "",//`${settings.outputDestination}/temp`,
};

const redisConfig = {
  host: getEnv("REDIS_HOST").default("localhost").asString(),
  port: getEnv("REDIS_PORT").default(6379).asInt(),
  password: getEnv("REDIS_PASSWORD").default("").asString(),
  workerConcurrency: getEnv("WORKER_CONCURRENCY").default(6).asInt(),
  queueName: getEnv("QUEUE_NAME").default("video-transcoder").asString()
}

const postgresConfig = {
  host: getEnv("POSTGRES_HOST").default("localhost").asString(),
  port: getEnv("POSTGRES_PORT").default(5432).asInt(),
  username: getEnv("POSTGRES_USERNAME").default("app").asString(),
  password: getEnv("POSTGRES_PASSWORD").default("app").asString(),
  user: getEnv("POSTGRES_USER").default("app").asString(),
  database: getEnv("POSTGRES_DATABASE").default("optimal_video_encoder").asString()
}

export const CONFIG = {
  postgresConfig,
  locationConfig,
  redisConfig,
  disableTranscoder: getEnv("DISABLE_TRANSCODER").default("false").asBool(),
  disableFileWatch: getEnv("DISABLE_FILE_WATCH").default("true").asBool(),
  cleanupOriginals: getEnv("CLEANUP_ORIGINALS").default("false").asBool(),
  disableDB: getEnv("DISABLE_DB").default("false").asBool(),
  logProgress: getEnv("LOG_PROGRESS").default("true").asBool(),
}

export const FOUR_K_RESOLUTION = {
  width: 3840,
  height: 2160
};
