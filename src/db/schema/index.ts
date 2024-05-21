import {
  pgTableCreator,
  index,
  pgEnum,
  varchar,
  integer,
  smallint,
  text,
  uniqueIndex,
  bigint,
  timestamp,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const keyStatus = pgEnum("key_status", [
  "expired",
  "invalid",
  "valid",
  "default",
]);
export const keyType = pgEnum("key_type", [
  "stream_xchacha20",
  "secretstream",
  "secretbox",
  "kdf",
  "generichash",
  "shorthash",
  "auth",
  "hmacsha256",
  "hmacsha512",
  "aead-det",
  "aead-ietf",
]);
export const aalLevel = pgEnum("aal_level", ["aal3", "aal2", "aal1"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "plain",
  "s256",
]);
export const factorStatus = pgEnum("factor_status", ["verified", "unverified"]);
export const factorType = pgEnum("factor_type", ["webauthn", "totp"]);
export const action = pgEnum("action", [
  "ERROR",
  "TRUNCATE",
  "DELETE",
  "UPDATE",
  "INSERT",
]);
export const equalityOp = pgEnum("equality_op", [
  "in",
  "gte",
  "gt",
  "lte",
  "lt",
  "neq",
  "eq",
]);
export const oneTimeTokenType = pgEnum("one_time_token_type", [
  "phone_change_token",
  "email_change_token_current",
  "email_change_token_new",
  "recovery_token",
  "reauthentication_token",
  "confirmation_token",
]);

export const pgTable = pgTableCreator((name) => `quote-table__${name}`);

export const authors = pgTable(
  "author",
  {
    id: integer("id").primaryKey().notNull(),
    firstName: varchar("firstName", { length: 255 }).notNull(),
    lastName: varchar("lastName", { length: 255 }).notNull(),
    birthYear: smallint("birthYear"),
    deathYear: smallint("deathYear"),
    nationality: varchar("nationality", { length: 255 }),
    biography: text("biography"),
  },
  (table) => {
    return {
      authorId: uniqueIndex("authorId_idx").on(table.id),
      authorNameIdx: index("author_authorName_idx").on(
        table.firstName,
        table.lastName,
      ),
      authorNationalityIdx: index("author_authorNationality_idx").on(
        table.nationality,
      ),
    };
  },
);

export const cities = pgTable(
  "city",
  {
    id: integer("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    stateId: integer("stateId").references(() => states.id),
    countryId: integer("countryId")
      .references(() => countries.id)
      .notNull(),
  },
  (table) => {
    return {
      cityNameIdx: index("city_cityName_idx").on(table.name),
      cityId: uniqueIndex("city_cityId_indx").on(table.id),
    };
  },
);

export const books = pgTable(
  "book",
  {
    id: integer("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    publicationYear: varchar("publicationYear", { length: 10 }),
    isbn: varchar("isbn", { length: 20 }),
    publisherId: integer("publisherId")
      .references(() => publishers.id)
      .notNull(),
    summary: text("summary"),
    citation: varchar("citation", { length: 500 }),
    sourceLink: varchar("sourceLink", { length: 500 }),
    rating: integer("rating"),
  },
  (table) => {
    return {
      bookIsbnIdx: index("book_bookIsbn_idx").on(table.isbn),
      bookPublisherIdx: index("book_bookPublisher_idx").on(table.publisherId),
      bookRatingIdx: index("book_bookRating_idx").on(table.rating),
      bookTitleIdx: index("book_bookTitle_idx").on(table.title),
      bookIsbnUnique: uniqueIndex("book_isbn_unique").on(table.isbn),
    };
  },
);

export const countries = pgTable(
  "country",
  {
    id: integer("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      countryNameIdx: index("country_countryName_idx").on(table.name),
      countryId: uniqueIndex("country_countryId_idx").on(table.id),
      countryNameUnique: uniqueIndex("country_name_unique").on(table.name),
    };
  },
);

export const genres = pgTable(
  "genre",
  {
    id: integer("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
  },
  (table) => {
    return {
      genreGenreNameIdx: index("genre_genreName_idx").on(table.name),
      genreId: uniqueIndex("genre_genreId_idx").on(table.id),
      genreNameUnique: uniqueIndex("genre_name_unique").on(table.name),
    };
  },
);

export const publishers = pgTable(
  "publisher",
  {
    id: integer("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    cityId: integer("cityId")
      .references(() => cities.id)
      .notNull(),
    stateId: integer("stateId")
      .references(() => states.id)
      .notNull(),
    countryId: integer("countryId")
      .references(() => countries.id)
      .notNull(),
  },
  (table) => {
    return {
      publisherId: uniqueIndex("publisher_publisherId_idx").on(table.id),
      publisherPublisherNameIdx: index("publisher_publisherName_idx").on(
        table.name,
      ),
      publisherNameUnique: uniqueIndex("publisher_name_unique").on(table.name),
    };
  },
);

export const states = pgTable(
  "state",
  {
    id: integer("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    abbreviation: varchar("abbreviation", { length: 8 }),
    countryId: bigint("countryId", { mode: "number" })
      .references(() => countries.id)
      .notNull(),
  },
  (table) => {
    return {
      stateId: uniqueIndex("state_stateId_idx").on(table.id),
      stateAbbreviationUnique: uniqueIndex("state_abbreviation_unique").on(
        table.abbreviation,
      ),
      stateNameUnique: uniqueIndex("state_name_unique").on(table.name),
      stateNameIdx: index("state_stateName_idx").on(table.name),
    };
  },
);

export const tags = pgTable(
  "tag",
  {
    id: integer("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
  },
  (table) => {
    return {
      tagId: uniqueIndex("tag_tagId_idx").on(table.id),
      tagNameUnique: uniqueIndex("tag_name_unique").on(table.name),
      tagNameIdx: index("tag_tagName_idx").on(table.name),
    };
  },
);

export const topics = pgTable(
  "topic",
  {
    id: integer("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
  },
  (table) => {
    return {
      topicId: uniqueIndex("topic_topicId_idx").on(table.id),
      topicNameUnique: uniqueIndex("topic_name_unique").on(table.name),
      topicNameIdx: index("topic_topicName_idx").on(table.name),
    };
  },
);

export const types = pgTable(
  "type",
  {
    id: integer("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
  },
  (table) => {
    return {
      typeNameUnique: uniqueIndex("type_name_unique").on(table.name),
      typeId: uniqueIndex("type_typeId_idx").on(table.id),
      typeNameIdx: index("type_quoteToTypeName_idx").on(table.name),
    };
  },
);

export const users = pgTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    clerkId: text("clerk_id"),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    image: varchar("image", { length: 255 }),
  },
  (table) => {
    return {
      emailIdx: index("user_email_idx").on(table.email),
      clerkIdIdx: index("user_clerkId_idx").on(table.clerkId),
    };
  },
);

export const quotes = pgTable(
  "quote",
  {
    id: bigint("id", { mode: "number" }).primaryKey().notNull(),
    userId: text("userId")
      .references(() => users.id)
      .notNull(),
    text: text("text").notNull(),
    bookId: integer("bookId")
      .references(() => books.id)
      .notNull(),
    context: text("context"),
    pageNumber: text("pageNumber"),
    createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }),
    quotedBy: bigint("quotedBy", { mode: "number" }).references(
      () => authors.id,
    ),
    isImportant: boolean("isImportant"),
    isPrivate: boolean("isPrivate"),
  },
  (table) => {
    return {
      bookIdIdx: index("quote_bookId_idx").on(table.bookId),
      isImportantIdx: index("quote_isImportant_idx").on(table.isImportant),
      quotedByIdx: index("quote_quotedBy_idx").on(table.quotedBy),
      userIdIdx: index("quote_userId_idx").on(table.userId),
    };
  },
);

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .primaryKey()
      .notNull(),
    userId: text("userId")
      .references(() => users.id)
      .notNull(),
    expires: timestamp("expires", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("session_userId_idx").on(table.userId),
    };
  },
);

export const booksToAuthors = pgTable(
  "book_to_author",
  {
    bookId: integer("bookId")
      .references(() => books.id)
      .notNull(),
    authorId: bigint("authorId", { mode: "number" })
      .references(() => authors.id)
      .notNull(),
  },
  (table) => {
    return {
      bookToAuthorPrimaryKey: primaryKey({
        columns: [table.bookId, table.authorId],
        name: "book_to_author_pkey",
      }),
    };
  },
);

export const booksToGenres = pgTable(
  "book_to_genre",
  {
    bookId: integer("bookId")
      .references(() => books.id)
      .notNull(),
    genreId: integer("genreId")
      .references(() => genres.id)
      .notNull(),
  },
  (table) => {
    return {
      bookToGenrePrimaryKey: primaryKey({
        columns: [table.bookId, table.genreId],
        name: "book_to_genre_pkey",
      }),
    };
  },
);

export const countriesToCities = pgTable(
  "country_to_city",
  {
    countryId: integer("countryId")
      .references(() => countries.id)
      .notNull(),
    cityId: integer("cityId")
      .references(() => cities.id)
      .notNull(),
  },
  (table) => {
    return {
      countryToCityPrimaryKey: primaryKey({
        columns: [table.countryId, table.cityId],
        name: "country_to_city_pkey",
      }),
    };
  },
);

export const countriesToStates = pgTable(
  "country_to_state",
  {
    countryId: integer("countryId")
      .references(() => countries.id)
      .notNull(),
    stateId: integer("stateId")
      .references(() => states.id)
      .notNull(),
  },
  (table) => {
    return {
      countryToStatePrimaryKey: primaryKey({
        columns: [table.countryId, table.stateId],
        name: "country_to_state_pkey",
      }),
    };
  },
);

export const publishersToBooks = pgTable(
  "publisher_to_book",
  {
    publisherId: integer("publisherId")
      .references(() => publishers.id)
      .notNull(),
    bookId: integer("bookId")
      .references(() => books.id)
      .notNull(),
  },
  (table) => {
    return {
      publisherToBookPrimaryKey: primaryKey({
        columns: [table.publisherId, table.bookId],
        name: "publisher_to_book_pkey",
      }),
    };
  },
);

export const publishersToCities = pgTable(
  "publisher_to_city",
  {
    publisherId: integer("publisherId")
      .references(() => publishers.id)
      .notNull(),
    cityId: integer("cityId")
      .references(() => cities.id)
      .notNull(),
  },
  (table) => {
    return {
      publisherToCityPrimaryKey: primaryKey({
        columns: [table.publisherId, table.cityId],
        name: "publisher_to_city_pkey",
      }),
    };
  },
);

export const quotesToAuthors = pgTable(
  "quote_to_author",
  {
    quoteId: bigint("quoteId", { mode: "number" })
      .references(() => quotes.id)
      .notNull(),
    authorId: bigint("authorId", { mode: "number" })
      .references(() => authors.id)
      .notNull(),
  },
  (table) => {
    return {
      quoteToAuthorPrimaryKey: primaryKey({
        columns: [table.quoteId, table.authorId],
        name: "quote_to_author_pkey",
      }),
    };
  },
);

export const quotesToTags = pgTable(
  "quote_to_tag",
  {
    quoteId: bigint("quoteId", { mode: "number" })
      .references(() => quotes.id)
      .notNull(),
    tagId: integer("tagId")
      .references(() => tags.id)
      .notNull(),
  },
  (table) => {
    return {
      quoteToTagPrimaryKey: primaryKey({
        columns: [table.quoteId, table.tagId],
        name: "quote_to_tag_pkey",
      }),
    };
  },
);

export const quotesToTopics = pgTable(
  "quote_to_topic",
  {
    quoteId: bigint("quoteId", { mode: "number" })
      .references(() => quotes.id)
      .notNull(),
    topicId: integer("topicId")
      .references(() => quotes.id)
      .notNull(),
  },
  (table) => {
    return {
      quoteToTopicPrimaryKey: primaryKey({
        columns: [table.quoteId, table.topicId],
        name: "quote_to_topic_pkey",
      }),
    };
  },
);

export const quotesToTypes = pgTable(
  "quote_to_type",
  {
    quoteId: bigint("quoteId", { mode: "number" })
      .references(() => quotes.id)
      .notNull(),
    typeId: integer("typeId")
      .references(() => types.id)
      .notNull(),
  },
  (table) => {
    return {
      quoteToTypePrimaryKey: primaryKey({
        columns: [table.quoteId, table.typeId],
        name: "quote_to_type_pkey",
      }),
    };
  },
);

export const statesToCities = pgTable(
  "state_to_city",
  {
    stateId: integer("stateId")
      .references(() => states.id)
      .notNull(),
    cityId: integer("cityId")
      .references(() => cities.id)
      .notNull(),
  },
  (table) => {
    return {
      stateToCityPrimaryKey: primaryKey({
        columns: [table.stateId, table.cityId],
        name: "state_to_city_pkey",
      }),
    };
  },
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
  },
  (table) => {
    return {
      verificationTokenPrimaryKey: primaryKey({
        columns: [table.identifier, table.token],
        name: "verification_token_pkey",
      }),
    };
  },
);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId").references(() => users.id),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refreshToken: text("refresh_token"),
    refreshTokenExpiresIn: integer("refresh_token_expires_in"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 255 }),
  },
  (table) => {
    return {
      userIdIdx: index("account_userId_idx").on(table.userId),
      accountPrimaryKey: primaryKey({
        columns: [table.provider, table.providerAccountId],
        name: "account_pkey",
      }),
    };
  },
);
