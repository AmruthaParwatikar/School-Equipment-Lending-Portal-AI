
# Database Schema (Example - MongoDB)

Collections:

users:
- _id
- name
- email
- passwordHash
- role ('student','staff','admin')

equipment:
- _id
- name
- category
- condition
- quantity
- available

loans:
- _id
- equipmentId
- userId
- quantity
- dueDate
- status ('pending','issued','returned','rejected')
- createdAt
