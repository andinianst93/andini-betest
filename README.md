## Authorization
- For the authorization, I used the session cookie. The session cookie is created when the user sign up and logs in and is destroyed when the user logs out. 
- The server checks if the session cookie is valid and if the user is authorized to access the requested resource. 
- If the session cookie is not valid, the server returns a 401 Unauthorized response. 

## Database and Redis Name
- Since I use my own Database and Redis, please kindly understand that I cannot provide the access to my Database and Redis.
- If you want to test the code, please kindly use your own Database and Redis.
- .env.example file is provided for you to set up your own Database and Redis.

