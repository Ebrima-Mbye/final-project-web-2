// Path: frontend/src/app/models/user.model.ts
// This is a simple interface to define the structure of a User object
export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string; // JWT token, optional as it might only be present on login/register response
}