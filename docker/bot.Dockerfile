FROM oven/bun:1.3.11

WORKDIR /app
COPY package.json .
COPY src/packages/database/package.json src/packages/database/
COPY src/apps/bot/package.json ./src/apps/bot/
RUN bun install --production

COPY . .
RUN rm -rf /app/src/apps/backend --no-preserve-root
RUN cd src/packages/database && bun db:generate

CMD ["bun", "start:bot"]