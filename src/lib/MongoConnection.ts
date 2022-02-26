import mongoose from 'mongoose';

interface CachedConnection {
  conn?: typeof mongoose;
  promise?: Promise<typeof import('mongoose')>;
}

export default class MongoConnection {
  static cached: CachedConnection = {};

  static async connectDb() {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }

    if (this.cached.conn) {
      return this.cached.conn;
    }

    if (!this.cached.promise) {
      try {
        this.cached.promise = mongoose
          .connect(MONGO_URI)
          .then((mongoose) => mongoose);
        console.log('Connecting to MongoDB');
      } catch (error) {
        const err = error as Error;
        console.log(`Error ${err.message}`);
      }
    }
    this.cached.conn = await this.cached.promise;
    if (this.cached.conn) {
      return this.cached.conn;
    }
    throw new Error('An error has occured while connecting to db');
  }
}
