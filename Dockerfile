# 1. Base image
FROM node:18-alpine AS base

# 2. Set working dir
WORKDIR /app

# 3. Copy files needed for install
COPY package.json package-lock.json ./

# 4. Install prod dependencies
RUN npm ci --omit=dev

# 5. Copy remaining app code
COPY . .

# 6. Build app
RUN npm run build

# 7. Serve the app
CMD ["npm", "start"]
