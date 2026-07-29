FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install leaflet react-leaflet@4.2.1
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
