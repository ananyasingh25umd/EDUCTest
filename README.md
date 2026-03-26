# Transcript Analysis Web App

This is a full-stack web application that allows teachers to upload classroom transcripts and analyze speaker turns.

## Features

- User authentication (Sign up / Log in) using Supabase Auth
- Upload transcript files (CSV format)
- Store files in Supabase Storage
- Backend parsing using Supabase Edge Functions
- Counts:
  - Number of Teacher turns
  - Number of Student turns
- Results displayed in a clean dashboard UI

## Tech Stack

- Frontend: React (Vite)
- Styling: CSS
- Backend: Supabase
  - Authentication
  - Database (PostgreSQL)
  - Storage
  - Edge Functions

## How it works

1. User signs up or logs in
2. Uploads a CSV transcript file
3. File is stored in Supabase Storage
4. Edge Function parses the transcript
5. Counts teacher and student turns
6. Results are stored in the database and displayed in UI

## Example Output

- Teacher Turns: 12  
- Student Turns: 8  

## Live Demo

https://educ-test.vercel.app/

## Notes

- This is a demo project for educational purposes
- Data is not isolated per user (shared database)

