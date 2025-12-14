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

const sonnarRadarrConfig = {
  sonnarUrl: getEnv("SONNAR_URL").default("http://sonarr.greatrat.box.ca/api/v3").asString(),
  sonnarApiKey: getEnv("SONNAR_API_KEY").default("1f50f9001b0f49eea3390ce45f8010f1").asString(),
  radarrUrl: getEnv("RADARR_URL").default("http://radarr.greatrat.box.ca/api/v3").asString(),
  radarrApiKey: getEnv("RADARR_API_KEY").default("727e9c63c3f94027be30f2024358915c").asString()
}

const mariaConfig = {
  socketPath: getEnv("MARIA_SOCKET").default("/home/moonryc/.config/mysql/mysqld.sock").asString(),
  user: getEnv("MARIA_USER").default("moonryc").asString(),
  database: getEnv("MARIA_DATABASE").default("netflix_plus").asString()
}

export const CONFIG = {
  mariaConfig,
  locationConfig,
  redisConfig,
  sonnarRadarrConfig,
  cleanupOriginals: getEnv("CLEANUP_ORIGINALS").default("true").asBool(),
  disableDB: getEnv("DISABLE_DB").default("false").asBool(),
  logProgress: getEnv("LOG_PROGRESS").default("true").asBool(),
}

export const FOUR_K_RESOLUTION = {
  width: 3840,
  height: 2160
};
