FROM node:20-alpine

WORKDIR /workspace/frontend/urban-atlas-web

COPY frontend/urban-atlas-web/package*.json ./
RUN npm install

COPY frontend/urban-atlas-web .

EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]

