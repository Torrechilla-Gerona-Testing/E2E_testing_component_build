this is my .env file for the Midterms exam:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL= "postgresql://postgres.ffrixcgkpstjpyyjoapp:Noycutie100804@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# DATABASE_URL="postgresql://postgres.ffrixcgkpstjpyyjoapp:

HOW TO SET UP FOR TESTING:
1. Clone the repository
2. In VSCode, locate the folder "to-do-list-app" (E2E_testing_component_build > Midterm Folder > to-do-list-app)
3. Run "npm i" to install dependencies
4. Create a .env file in the root
5. Paste the database url: DATABASE_URL= "postgresql://postgres.ffrixcgkpstjpyyjoapp:Noycutie100804@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
6. Run "npm run dev" to open the web app
7. Run "npx playwright test --ui" to open the testing interface
8. Run tests
