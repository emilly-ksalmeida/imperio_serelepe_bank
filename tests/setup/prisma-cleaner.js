import { prisma, prismaImport } from "../../src/model/db.js"
import { PrismaCleaner } from "@ubie/prisma-cleaner"

export const cleaner = new PrismaCleaner({
  prisma,
  models: prismaImport.dmmf.datamodel.models,
})

export { prisma }