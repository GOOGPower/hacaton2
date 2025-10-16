FROM node:20-alpine
WORKDIR /app

COPY server/ /app/server/
COPY dist/ /app/dist

EXPOSE 3000

WORKDIR /app/server
CMD ["node", "run.cjs"]