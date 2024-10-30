## Authorization
- For the authorization, I used the session cookie. The session cookie is created when the user sign up and logs in and is destroyed when the user logs out. 
- The server checks if the session cookie is valid and if the user is authorized to access the requested resource. 
- If the session cookie is not valid, the server returns a 401 Unauthorized response. 

