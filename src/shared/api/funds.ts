import { db } from './fakeDb'
import { delay } from '../utils/delay'

export const getFunds = async () => {
  await delay(300)
  return db.funds
}