# Optimal Video Encoder

A self-hosted video transcoding solution designed for Plex users. Batch convert your media library to a universally compatible MP4 format that works seamlessly across all Plex apps and devices, including the "Watch Together" feature.

## Why?

Plex's built-in optimization creates duplicate files that eat up storage. Different video formats and codecs cause playback issues across devices, especially during Watch Together sessions. This tool solves both problems by converting videos to a standardized format before they hit your Plex library.

## Features

- Web-based UI for uploading and monitoring conversions
- Automatic transcoding to universally compatible MP4
- 4K downsampling for better streaming compatibility
- Real-time progress tracking
- Background job queue with automatic retry on failures
- Batch processing with configurable concurrency

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

```bash
git clone https://github.com/moonryc/optimal-video-encoder.git
cd optimal-video-encoder
docker compose up
```

Open http://localhost:3333 in your browser.

## Usage

1. Access the web UI at `http://localhost:3333`
2. Upload video files through the interface
3. Monitor conversion progress in real-time
4. Find converted files in `./encoder-output/converted-files/`

## How It Works

```
Upload → Queue → FFmpeg Transcoding → Output
```

1. Videos are uploaded via the web UI to `encoder-output/pending-conversion-files/`
2. A job is added to the BullMQ queue backed by Redis
3. The worker picks up the job and runs FFmpeg transcoding
4. Converted files are saved to `encoder-output/converted-files/`
5. Original files are cleaned up automatically (configurable)

## Configuration

Key environment variables can be modified in `docker-compose.yml`:

| Variable | Default | Description |
|----------|---------|-------------|
| `WORKER_CONCURRENCY` | `1` | Number of parallel encoding jobs |
| `CLEANUP_ORIGINALS` | `true` | Delete original files after conversion |
| `UPLOAD_DIR` | `/encoder-output/pending-conversion-files` | Upload destination |
| `DESTINATION_DIR` | `/encoder-output/converted-files` | Output directory |

## Tech Stack

- **Frontend**: React, Material UI
- **Backend**: Express, TypeORM, BullMQ
- **Database**: PostgreSQL
- **Queue**: Redis
- **Transcoding**: FFmpeg via fluent-ffmpeg

## Development

For local development without Docker:

```bash
# Start PostgreSQL and Redis
docker compose up postgres redis

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev
```

## License

MIT
