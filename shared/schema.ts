/**
 * TranscendBody - Database Schema Definition
 * 
 * This file defines the complete database schema for the personal transformation
 * tracking application using Drizzle ORM and PostgreSQL.
 * 
 * Database Tables:
 * - users: User accounts and profiles
 * - global_activities: System-wide activities available to all users
 * - daily_trackers: Daily completion tracking for each user
 * - tracker_entries: Individual activity entries within daily trackers
 * - sessions: User session data for authentication
 * 
 * Features:
 * - Type-safe database operations with TypeScript
 * - Zod validation schemas for input validation
 * - Proper foreign key relationships
 * - Indexed columns for performance
 * - Comprehensive type definitions
 */

import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  date,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for traditional authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  preferredName: varchar("preferred_name", { length: 100 }),
  gender: varchar("gender", { length: 10 }),               // ⬅️ new field
  age: integer("age"),                                     // ⬅️ new field
  role: varchar("role").notNull().default("user"),
  plan: varchar("plan", { length: 50 }), // 'basic' or 'pro'
  accountabilityLevel: varchar("accountability_level", { length: 50 }),
  tier: varchar("tier", { length: 50 }),
  isAdmin: boolean("is_admin").notNull().default(false), // <-- NEW FIELD
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activities table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // 'workout', 'nutrition', 'recovery', 'mindset'
  timeOfDay: varchar("time_of_day"), // 'morning', 'afternoon', 'evening', 'night'
  isCustom: boolean("is_custom").notNull().default(false),
  isGlobal: boolean("is_global").notNull().default(false), // <-- NEW FIELD
  difficulty: varchar("difficulty", { length: 10 }).notNull().default('easy'), // 'easy', 'medium', 'hard'
  createdBy: varchar("created_by"), // FK to users.id, null if preloaded
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  // Add unique constraint on (title, category)
  index("IDX_activities_title_category").on(table.title, table.category),
  // Unique constraint
  { unique: [table.title, table.category] }
]);

// Global Activities table (canonical, admin-managed)
export const globalActivities = pgTable("global_activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  timeOfDay: varchar("time_of_day"),
  isCustom: boolean("is_custom").notNull().default(false),
  difficulty: varchar("difficulty", { length: 10 }).notNull().default('easy'),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_global_activities_title_category").on(table.title, table.category),
  { unique: [table.title, table.category] }
]);

// Demo Activities table (for demo/test accounts only)
export const demoActivities = pgTable("demo_activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  timeOfDay: varchar("time_of_day"),
  isCustom: boolean("is_custom").notNull().default(false),
  difficulty: varchar("difficulty", { length: 10 }).notNull().default('easy'),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_demo_activities_title_category").on(table.title, table.category),
  { unique: [table.title, table.category] }
]);

// Daily trackers table
export const dailyTrackers = pgTable("daily_trackers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  date: date("date").notNull(),
  completionRate: integer("completion_rate").notNull().default(0), // percentage
  createdAt: timestamp("created_at").defaultNow(),
});

// Tracker entries table
export const trackerEntries = pgTable("tracker_entries", {
  id: serial("id").primaryKey(),
  trackerId: integer("tracker_id").notNull(),
  activityId: integer("activity_id").notNull(),
  timeSlot: varchar("time_slot").notNull(), // 'morning', 'afternoon', 'evening', 'night'
  status: varchar("status").notNull().default("pending"), // 'pending', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  customActivities: many(activities),
  dailyTrackers: many(dailyTrackers),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  creator: one(users, {
    fields: [activities.createdBy],
    references: [users.id],
  }),
  trackerEntries: many(trackerEntries),
}));

export const dailyTrackersRelations = relations(dailyTrackers, ({ one, many }) => ({
  user: one(users, {
    fields: [dailyTrackers.userId],
    references: [users.id],
  }),
  entries: many(trackerEntries),
}));

export const trackerEntriesRelations = relations(trackerEntries, ({ one }) => ({
  tracker: one(dailyTrackers, {
    fields: [trackerEntries.trackerId],
    references: [dailyTrackers.id],
  }),
  activity: one(activities, {
    fields: [trackerEntries.activityId],
    references: [activities.id],
  }),
}));

// Types and schemas
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export const insertDailyTrackerSchema = createInsertSchema(dailyTrackers).omit({
  id: true,
  createdAt: true,
  completionRate: true,
});
export type InsertDailyTracker = z.infer<typeof insertDailyTrackerSchema>;
export type DailyTracker = typeof dailyTrackers.$inferSelect;

export const insertTrackerEntrySchema = createInsertSchema(trackerEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTrackerEntry = z.infer<typeof insertTrackerEntrySchema>;
export type TrackerEntry = typeof trackerEntries.$inferSelect;

// Extended types for API responses
export type TrackerEntryWithActivity = TrackerEntry & {
  activity: Activity;
};

export type DailyTrackerWithEntries = DailyTracker & {
  entries: TrackerEntryWithActivity[];
};
// User Registration Schema
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  preferredName: z.string().optional(),
  gender: z.enum(["male", "female", "nonbinary", "other"]).optional(),
  age: z.number().optional(),
  role: z.string().optional().default("user"),
  plan: z.enum(["basic", "pro"]).optional().default("basic"), // <-- Only basic/pro
  tier: z.enum(["bronze", "silver", "gold"]).optional().default("bronze"),
  accountabilityLevel: z.enum(["beginner", "intermediate", "master"]).optional().default("beginner"),
  isAdmin: z.boolean().optional().default(false), // <-- NEW FIELD
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export const drizzleSchema = { users, activities, dailyTrackers, trackerEntries, sessions };
