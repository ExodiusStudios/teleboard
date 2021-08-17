FROM node:14-alpine
WORKDIR /vindigo

# Install dependencies
COPY package.json .

# Copy only required packages
COPY packages/vindigo-server/package.json packages/vindigo-server/
COPY packages/vindigo-config/package.json packages/vindigo-config/
COPY packages/vindigo-client/package.json packages/vindigo-client/
COPY packages/vindigo-cli/package.json packages/vindigo-cli/
RUN yarn install

# Build the source
COPY . .

# Trigger the default setup and generation
# of most distribution files.
RUN node vindigo init --defaults --skip-migrate

# Start the app platform
VOLUME ["/vindigo/data"]
ENTRYPOINT ["sh", "./bootstrap.sh"]
CMD ["node", "vindigo", "run"]