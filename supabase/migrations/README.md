# Database Migrations

This directory contains SQL migration files for the Supabase database schema. These files are kept for:

1. **Documentation**: Track changes to the database schema
2. **Version Control**: Maintain history of database changes
3. **Team Collaboration**: Help other developers understand the database structure
4. **Local Development**: Set up new development environments
5. **Disaster Recovery**: Recreate the database if needed

## Files

- `000_check_schema.sql`: Query to check existing tables
- `001_check_columns.sql`: Query to check table columns
- `002_verify_schema.sql`: Query to verify schema setup
- `003_initial_schema.sql`: Initial database schema with tables and policies

## Current Schema

The database includes the following main tables:

- `users`: User accounts and authentication
- `profiles`: User profile information
- `block_spaces`: Block space management
- `blocks`: Individual blocks within spaces
- `announcements`: Block space announcements
- `announcement_interactions`: User interactions with announcements
- `forum_posts`: Forum discussions
- `forum_comments`: Comments on forum posts
- `forum_replies`: Replies to comments
- `chat_rooms`: Chat room management
- `chat_messages`: Chat messages
- `chat_participants`: Chat room participants
- `documents`: Document management
- `user_roles`: User role assignments

Each table has appropriate indexes and foreign key relationships. Row Level Security (RLS) policies are in place to ensure proper data access control. 