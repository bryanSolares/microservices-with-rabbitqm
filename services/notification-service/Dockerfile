FROM node:18

WORKDIR /app

COPY package.json ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["node", "index.js"]
