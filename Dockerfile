FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 sveltekit
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
USER sveltekit
EXPOSE 3000
ENV PORT=3000
CMD ["node", "build/index.js"]
