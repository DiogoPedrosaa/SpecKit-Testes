import { MongoClient, Db } from 'mongodb'
import { config } from 'dotenv'

config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'tibia_bazaar'

class MongoSetup {
  public client: MongoClient | null = null
  public db: Db | null = null

  async connect(): Promise<void> {
    this.client = new MongoClient(MONGODB_URI)
    await this.client.connect()
    this.db = this.client.db(MONGODB_DB_NAME)
    console.log('Connected to MongoDB')
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
      console.log('Disconnected from MongoDB')
    }
  }
}

export const mongoSetup = new MongoSetup()
