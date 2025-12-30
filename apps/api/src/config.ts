import env from "env-var";

const getEnv = env.get;

const locationConfig = {
  watchDirectory: getEnv("WATCH_DIR").default("./encoder-output/pending-conversion-files").asString(),
  destination: getEnv("DESTINATION_DIR").default("./encoder-output/converted-files").asString(),
  tempDestination: getEnv("TEMP_DIR").default("./encoder-output/converted-files/temp").asString(),
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
  frontendDir: getEnv("FRONTEND_DIR").default("./apps/frontend/dist").asString(),
  uploadDir: getEnv("UPLOAD_DIR").default("./encoder-output/pending-conversion-files").asString(),
  logOutputLocation: getEnv("LOG_OUTPUT_LOCATION").default("encoder-output/logs").asString(),
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
