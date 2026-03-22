FROM oven/bun:1.3.11

WORKDIR /app

COPY package.json .
COPY bunfig.toml .
COPY src/packages/database/package.json src/packages/database/
RUN bun install --production

WORKDIR /app/src/packages/database
COPY src/packages/database/ .
COPY .env.prod .

CMD ["bun", "db:init:prod"]