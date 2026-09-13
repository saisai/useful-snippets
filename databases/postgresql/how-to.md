how to list tables Inside the psql interactive prompt, use the meta-command

```
\dt
Include system tables: \dtS

Include sizes and descriptions: \dt+

List tables in a specific schema: \dt schema_name.*
```

## Using Standard SQL
```
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
  AND table_schema NOT IN ('pg_catalog', 'information_schema');
```

## Alternatively, query the PostgreSQL system catalog directly:
```
SELECT schemaname, tablename, tableowner
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
```

## To describe table
```
\d table_name

Include table size, storage details, and column descriptions: \d+ table_name

Describe a table in a specific schema: \d schema_name.table_name
```

Using Standard SQL

To inspect columns, data types, and nullability from an application or external client, query information_schema.columns:

```
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'table_name'
  AND table_schema = 'public' -- replace with your schema if different
ORDER BY ordinal_position;
```

To list foreign keys, primary keys, and unique constraints for the table:

```
SELECT 
    tc.constraint_name, 
    tc.constraint_type, 
    kcu.column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'table_name';
```