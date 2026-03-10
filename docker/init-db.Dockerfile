FROM oven/bun:1.3.10

WORKDIR /app
COPY package.json .
COPY src/packages/database/package.json src/packages/database/
RUN bun install --production

WORKDIR /app/src/packages/database
COPY src/packages/database/ .
COPY .env .

CMD ["bun", "db:init"]