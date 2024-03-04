FROM node:16.13.0-alpine3.14 AS dev
ENV NODE_ENV development

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g serve

# Copy the rest of the files
COPY . .

# Build the app
RUN npm run build

# Switch to build stage
RUN cd build

CMD ["serve", "-s", ".", "-l", "3000"]
