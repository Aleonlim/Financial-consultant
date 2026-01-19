import { db } from './fakeDb'
import { delay } from '../utils/delay'

export const getCategories = async () => {
  await delay(300)
  return db.categories
}