FROM node:24-alpine AS frontend-builder

WORKDIR /app

COPY ./Frontend/package*.json ./
RUN npm ci

COPY ./Frontend .
ARG VITE_TLDRAW_KEY
ENV VITE_TLDRAW_KEY=$VITE_TLDRAW_KEY
RUN npm run build


FROM node:24-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY ./Backend/package*.json ./
RUN npm ci --omit=dev

COPY ./Backend .
COPY --from=frontend-builder /app/dist ./public

EXPOSE 3000

CMD ["node", "server.js"]