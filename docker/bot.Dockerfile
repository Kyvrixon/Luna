FROM oven/bun:1.3.11

WORKDIR /app

COPY package.json .
COPY bunfig.toml .
COPY src/packages/database/package.json src/packages/database/
COPY src/packages/ai/package.json src/packages/ai/
COPY src/apps/bot/package.json ./src/apps/bot/
RUN bun install --production

COPY . .
RUN rm -rf /app/src/apps/backend --no-preserve-root
RUN bun db:prod

CMD ["bun", "start:bot:prod"]