import { pgTable, serial, text, real, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoURL: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cropRegistrations = pgTable('crop_registrations', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid'),
  villageName: text('village_name').notNull(),
  farmerName: text('farmer_name').notNull(),
  plannedCrop: text('planned_crop').notNull(),
  landSizeAcres: real('land_size_acres').notNull(),
  soilType: text('soil_type'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow(),
});
