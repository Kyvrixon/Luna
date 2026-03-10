FROM oven/bun:1.3.10

WORKDIR /app
COPY package.json .
COPY src/packages/database/package.json src/packages/database/
COPY src/apps/backend/package.json ./src/apps/backend/
RUN bun install --production

COPY . .
RUN rm -rf /app/src/apps/bot --no-preserve-root
RUN cd src/packages/database && bun db:generate

CMD ["bun", "start:backend"]