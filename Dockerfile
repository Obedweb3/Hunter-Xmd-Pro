FROM node:18-bullseye-slim

# Install ffmpeg for audio/video processing
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install --production --legacy-peer-deps

COPY . .

# Create sessions directory
RUN mkdir -p sessions data

EXPOSE 9090

CMD ["node", "index.js"]
