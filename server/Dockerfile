FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json .

RUN npm install

COPY . .

# Expose port
EXPOSE 3333

# Run app
CMD ["npm", "start"]