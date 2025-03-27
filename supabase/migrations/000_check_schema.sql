-- Check existing tables and their columns
SELECT 
    t.table_name,
    array_agg(c.column_name::text) as columns
FROM 
    information_schema.tables t
    JOIN information_schema.columns c 
        ON c.table_name = t.table_name
WHERE 
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
GROUP BY 
    t.table_name; 