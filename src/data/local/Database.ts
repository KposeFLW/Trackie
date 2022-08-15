import Realm from 'realm';

import {UserSchema} from './schema/UserSchema';
import {
  CoverMangaSchema,
  MangaSchema,
  ReadingStatusSchema,
} from './schema/MangaSchema';
import {GenreSchema} from './schema/GenreSchema';
import {CharacterDetailSchema, CharacterSchema} from './schema/CharacterSchema';
import {
  AuthorDetailSchema,
  AuthorSchema,
  SocialMediaSchema,
} from './schema/AuthorSchema';

class Database {
  private connection: Realm | undefined;

  async getConnection(): Promise<Realm> {
    if (!this.connection) {
      this.connection = await Realm.open({
        schema: [
          UserSchema,
          MangaSchema,
          ReadingStatusSchema,
          GenreSchema,
          CoverMangaSchema,
          CharacterSchema,
          CharacterDetailSchema,
          AuthorDetailSchema,
          AuthorSchema,
          SocialMediaSchema,
        ],
      });
    }
    return this.connection;
  }

  close() {
    if (this.connection) {
      this.connection.close();
    }
  }
}

export default new Database();
