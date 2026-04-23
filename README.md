# Invoice Management App

## Overview
This is a responsive Invoice Management Application built with React. It allows users to create, manage, and track invoices with full CRUD functionality and proper status flow.

## Core Features
- Create, Read, Update, Delete (CRUD) invoices
- Save invoices as Draft
- Mark invoices as Paid
- Filter invoices by status (Draft, Pending, Paid)
- Light/Dark mode toggle (persisted)
- Fully responsive (mobile, tablet, desktop)
- Form validation with clear feedback
- LocalStorage persistence

## Status Flow
The app follows real-world invoice logic:

- Draft → Pending → Paid

**Meaning:**
- Draft: Not completed or saved for later
- Pending: Sent and awaiting payment
- Paid: Completed (locked from editing)

## Tech Stack
- React (Vite)
- JavaScript (ES6+)
- CSS (custom styling)
- LocalStorage (data persistence)

## Setup Instructions

1. Extract the project zip  
2. Open terminal in the project folder  
3. Run:

```bash
npm install
npm run dev
```
# open in browser 

```bash
https://
```
# Accessibility

Semantic HTML elements
Keyboard navigation support
Focus trapping in modals
ESC key closes modal/drawer
Labels properly linked to inputs

# UI/UX Highlights

Smooth form scrolling with sticky action buttons
Clear validation feedback
Interactive hover states
Clean dark mode with readable white text

# Trade-offs

Uses LocalStorage instead of backend
No authentication or multi-user system
No API integration

# Future Improvements

Add backend (Node/Express or Firebase)
Authentication system
Cloud data persistence
Advanced animations (Framer Motion)
