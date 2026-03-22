FROM oven/bun:1.3.11

WORKDIR /app

COPY package.json .
COPY bunfig.toml .
COPY src/packages/database/package.json src/packages/database/
COPY src/apps/backend/package.json ./src/apps/backend/
RUN bun install --production

COPY . .
RUN rm -rf /app/src/apps/bot --no-preserve-root
RUN bun db:prod

CMD ["bun", "start:backend:prod"]