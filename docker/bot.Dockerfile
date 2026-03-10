FROM oven/bun:1.3.10

WORKDIR /app

COPY . .
RUN rm -rf /app/src/apps/backend --no-preserve-root

RUN bun install --production --no-verify --no-cache --force
RUN cd src/packages/database && bun db:generate
RUN cd /app

CMD ["bun", "start:bot"]