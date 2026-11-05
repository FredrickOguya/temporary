import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  name: text('name').notNull(),
  passwordHash: text("password_hash").notNull().default(""),
  token: text("token")
})

export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  url: text('url').notNull(),
  likes: integer('likes').notNull().default(0),
  year: integer('year').notNull(),
  userId: integer("user_id").notNull().references(() => users.id)
})

export const usersRelations = relations(users,({many}) => ({
  blogs: many(blogs),
  readingList: many(readingList),
}))

export const blogRelations = relations(blogs,({ one, many }) => ({
  user: one(users, {
    fields: [blogs.userId],
    references: [users.id]
  }),
  readingList: many(readingList),
}))

export const readingList = pgTable("reading_list", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  blogId: integer("blog_id").references(() => blogs.id),
  read: boolean("read").notNull().default(false)
})

export const readingListRelations = relations(readingList, ({ one }) => ({
  user: one(users, {
    fields: [readingList.userId],
    references: [users.id]
  }),
  blog: one(blogs, {
    fields: [readingList.blogId],
    references: [blogs.id]
  })
}))