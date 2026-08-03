```
curl -X 'POST' \
  'http://127.0.0.1:5000/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "securepassword123"
}'
```


```
curl -X 'POST' \
  'http://127.0.0.1:5000/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "securepassword123"
}'
```

```
curl -X 'GET' \
  'http://127.0.0.1:5000/auth/protected' \
  -H 'accept: application/json' \
  -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc4NDE5MTMxMywianRpIjoiOGFhOTNlYzEtYjhmMy00YjBmLWJjOTYtMWQyZjU4NTI4ZmMwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3ODQxOTEzMTMsImNzcmYiOiJhMGEyOWViYy0wMzAwLTRhN2UtOTFiNy00NjFjYzcwNTg1N2IiLCJleHAiOjE3ODQxOTIyMTN9.Q68sDXgQrlKvwQArbQfIJJ66_TTzChDLZiYQsjkaYUs'
```