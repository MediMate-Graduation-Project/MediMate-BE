FROM node:lts AS development
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma

RUN yarn

COPY . .
RUN yarn pmg
RUN yarn build

FROM node:lts AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


WORKDIR /usr/src/app

COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/package.json ./
COPY --from=development /usr/src/app/yarn.lock ./
COPY --from=development /usr/src/app/dist ./dist
# COPY --from=development /usr/src/app/dist/modules/mail/templates ./dist/src/modules/mail/templates
COPY ./prisma/ ./prisma/

CMD ["yarn", "start:migrate:prod"]


