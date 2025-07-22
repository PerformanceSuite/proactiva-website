# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page static website for the PROACTIVA Research Hub - a healthcare research organization focused on digital transformation and emerging technologies in healthcare delivery. The site serves as a landing page with research articles and an access request system for proprietary content.

## Project Structure

- `research-hub-landing.html` - The complete single-page website containing all HTML, CSS, and JavaScript

## Architecture

This is a **pure static HTML/CSS/JavaScript website** with no build process, dependencies, or server-side components:

- **Single-file architecture**: Everything is contained in one HTML file with embedded CSS and JavaScript
- **Client-side data persistence**: Uses localStorage for form submissions and admin functionality
- **Modal-based interactions**: Access requests and admin login use overlay modals
- **Responsive design**: Mobile-first approach with CSS Grid and Flexbox
- **No external dependencies**: Self-contained with system fonts and inline styles

## Key Components

### Content Sections
- Header with navigation and branding
- Hero section with main messaging
- Featured article (VA Digital Transformation research)
- Research areas grid (6 focus areas)
- Footer with links

### Interactive Features
- Access request modal with form submission
- Admin login system (hardcoded credentials: admin/proactiva2025)
- Admin dashboard for viewing and managing form submissions
- CSV export functionality for submissions
- Mobile-responsive navigation

### Data Flow
1. Form submissions → localStorage (`proactivaSubmissions`)
2. Admin login → Simple credential check
3. Admin dashboard → Read/display/manage localStorage data
4. CSV export → Generate and download client-side

## Development Workflow

Since this is a static HTML file:

1. **Editing**: Open `research-hub-landing.html` in any text editor
2. **Testing**: Open the file directly in a web browser (file:// protocol)
3. **No build process required** - changes are immediately visible on refresh

## Deployment

The website can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any web server (Apache, Nginx, etc.)

Simply upload the HTML file to the hosting service's document root.

## Admin Access

- **Username**: admin
- **Password**: proactiva2025
- Access via the "Member Login" button in the header
- Provides access to form submissions dashboard with export capabilities

## Form Data Management

Form submissions are stored in browser localStorage. To access programmatically:
- `viewSubmissions()` - View all submissions in console
- `downloadSubmissionsCSV()` - Download submissions as CSV
- `clearSubmissions()` - Clear all submission data