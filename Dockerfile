FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install

COPY . /app

RUN bun run build

EXPOSE 3001

CMD ["bun", "run", "start"]