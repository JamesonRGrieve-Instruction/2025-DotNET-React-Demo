# Use Node.js 18 as the base image
FROM node:24
# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

RUN npx prisma generate

# Start the application
CMD ["npm", "start"]
