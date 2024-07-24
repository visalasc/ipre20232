FROM node:16-alpine

# Create app directory
WORKDIR /MIMIC-CXR-T

# Copy the files that declares the dependencies (in this case using yarn)
COPY package.json ./
COPY yarn.lock ./

# Install the dependencies
RUN yarn install

COPY . .
# CMD ["sh", "-c", "yarn sequelize-cli db:migrate:undo:all"]
# Run command to start the process runing a shell command using node
CMD ["sh", "-c", "yarn dev"]


# This is for documentation only, the port muyst be exposed manually or in compose definition.
EXPOSE 3000