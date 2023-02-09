/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-underscore-dangle */
import { PrismaClient } from '@prisma/client'

declare global {
  var __db: PrismaClient | undefined
}

if (!global.__db) {
  global.__db = new PrismaClient()
}

const db: PrismaClient = global.__db

export default db
