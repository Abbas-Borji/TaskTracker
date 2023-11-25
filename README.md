# TaskTracker
A comprehensive guide to help you navigate through this app.

### Database
1. Create database tables using Prisma after manually creating the database  
`npx prisma db push`

2. Populate the database with predefined data using Prisma  
`npx prisma db seed`

3. Apply a migration after you do changes to the Prisma schema  
`npx prisma migrate dev --name first-migration`

4. After your first migration, you can easily reset and recreate the database  
`npx prisma migrate reset --force` or `npm run db-recreate`  
The above command does the following:
    1. Drops all tables in the database.
    2. Creates new tables based on your latest Prisma schema and migrations.
    3. Runs the seed script to populate the database.
