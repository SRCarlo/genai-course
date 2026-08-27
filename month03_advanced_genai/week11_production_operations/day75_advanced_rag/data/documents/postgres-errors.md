# PostgreSQL Errors

PostgreSQL error code 23505 represents a unique_violation.

A unique violation occurs when an INSERT or UPDATE attempts to create
a duplicate value for a column or group of columns protected by a
unique constraint.

Applications should handle PostgreSQL error 23505 explicitly when
duplicate records are expected to be possible.

PostgreSQL transactions should be handled carefully when errors occur.
