# Build stage
FROM node:20.17-alpine AS build

WORKDIR /tmp/app

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Production stage
FROM nginx:alpine

# Vite outputs to dist/ (CRA used build/)
COPY --from=build /tmp/app/dist/ /UI

COPY default.conf /etc/nginx/conf.d/
RUN chown -R nginx:nginx /UI

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
