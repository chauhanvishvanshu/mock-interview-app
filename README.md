# Mock Interview App (Static Frontend)

A simple static frontend for a mock interview application. This repository contains plain HTML, CSS, JavaScript and media assets for a client-side prototype of the app.

Summary
- Type: Static frontend (HTML/CSS/JS)
- Deploy: Can be hosted as static site (GitHub Pages, any static hosting, or served locally)
- Pages included: index, about, contact_us, register, login, interview dashboard, results

Repository structure
- .gitattributes
- index.html — Main landing/home page
- about.html — About page
- contact_us.html — Contact / support page
- login.html — Login page (client-side)
- register.html — Registration page (client-side)
- interview_dash.html — Interview dashboard / interviewer view
- results.html — Candidate/interview results page
- video-poster.webp — Poster image asset
- videos/ — Directory with any included video assets
- scripts/ — Directory for JS files or helper scripts (may be empty)

How to view locally
- Option A — Open directly:
  - Double-click index.html or open it from your browser (good for simple HTML/CSS prototypes).
- Option B — Serve with a simple HTTP server (recommended to avoid CORS or media path issues):
  - Python 3:
    - python3 -m http.server 8000
    - Then visit http://localhost:8000
  - Node (http-server):
    - npm install -g http-server
    - http-server -p 8000
    - Then visit http://localhost:8000
- Option C — Use VS Code Live Server extension for live reload while editing.

Deploying (static host / GitHub Pages)
- GitHub Pages:
  - Ensure the repository is pushed to GitHub.
  - In repository Settings → Pages, set source to branch "main" (root).
  - GitHub will publish the site at https://<your-username>.github.io/<repo-name>/ (allow a few minutes).
- Any static host (Netlify, Vercel, Surge) will accept the repo as-is.

Notes about the app
- This repo appears to be a client-side prototype. Server-side features (authentication, scheduling, persistent storage) are not included here.
- If you integrate a backend or APIs, update the pages to use the API endpoints and add environment/config instructions here.

Editing and adding content
- HTML templates are present at the repository root. Edit the corresponding .html files to update content.
- Place additional JS/CSS files in the scripts/ directory and link them from the HTML pages.
- Place new video/media assets in the videos/ directory and reference them with relative paths.

Suggested next docs to add (optional)
- CONTRIBUTING.md — Contribution guidelines
- LICENSE — Add a license (e.g., MIT) if you want to make the project open source
- CHANGELOG.md — Track notable changes and releases

Contributing
- Fork the repository
- Make changes on a branch
- Open a pull request explaining the changes

Contact
- Maintainer: chauhanvishvanshu  
- Repo: https://github.com/chauhanvishvanshu/mock-interview-app

License
- Add a LICENSE file to indicate project licensing (none is present in the repository currently).
