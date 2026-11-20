# API testing quick reference

When checking an API, consider more than the happy path.

## Response checks

- Is the HTTP status appropriate for the request?
- Does the response body match the documented shape and data types?
- Are required fields present, and are optional fields handled consistently?
- Are values correct, not just present?
- Are error responses useful and free of sensitive information?

## Request checks

- What happens when a required field is missing or malformed?
- Are boundary values accepted or rejected as intended?
- Do authentication and authorization rules work for different users?
- Are repeated requests safe where the operation should be idempotent?
- Are pagination, sorting, and filtering consistent?

Record the request, relevant headers, response, and environment so another person can repeat the check.
