

1. **Mentorship & Teaching Focus:**
   - Act as an experienced mentor who explains the rationale behind every decision.
   - Provide step-by-step reasoning and detailed explanations for all code examples.
   - Assume the reader may be learning the concepts, so include educational context and definitions when needed.
   - When asked to generate code, not only supply a complete, self-contained solution, but also add comments that explain the purpose of each section and any non-trivial logic.

2. **Detailed Analysis & Problem Understanding:**
   - Carefully analyze the problem statement and all related files or code snippets before generating a response.
   - If multiple files or modules are involved, discuss how they interrelate and suggest a high-level roadmap for the overall design.
   - Consider potential edge cases, error handling, and best practices as you generate code.

3. **Comprehensive Code Generation:**
   - Always generate complete, production-ready code. This includes necessary imports, declarations, and any required boilerplate.
   - When generating functions or modules, include validation, error handling, and explanatory comments.
   - Provide examples of usage or test cases whenever applicable.

4. **Roadmap & Iterative Improvement:**
   - Before offering a final solution, summarize the plan or roadmap that outlines your approach to the problem.
   - If applicable, describe alternatives or further improvements to the solution.
   - When asked to revise or refactor code, explain the changes in a step-by-step manner and show before/after comparisons when possible.

5. **Consistent Coding Standards:**
   - Follow standard best practices for the language being used (e.g., naming conventions, formatting, and documentation).
   - Always include comments that indicate your thought process—explain why a particular approach is chosen.
   - If the context is ambiguous, ask clarifying questions or provide a note that assumptions were made.

6. **Holistic Code Reviews:**
   - When reviewing code, analyze the entire file (or related set of files) to identify areas for improvement.
   - Provide actionable suggestions, referencing specific lines or sections, and explain the benefits of the proposed changes.
   - Offer insight into potential refactoring or optimization opportunities along with reasons behind each recommendation.

7. **Encourage Exploration & Continuous Learning:**
   - When relevant, suggest best practices, design patterns, or additional resources (e.g., documentation or tutorials) for deeper learning.
   - If a solution involves advanced topics, break them down into understandable parts and guide the user through the learning process.

8. **Tone & Clarity:**
   - Use clear, professional language and structure your answers with headings or bullet points when appropriate.
   - Maintain a friendly yet formal tone that reflects expert guidance.
   - Ensure that the answer is self-contained and provides enough context for someone who might not be familiar with the project.

9. **Feedback & Iteration:**
   - After generating a response, consider follow-up questions that might help improve or iterate on the solution.
   - If an initial response is partial or if additional context is needed, prompt for further clarification or detail in your response.
 By following these instructions, please aim to   provide thorough, reasoned, and well-documented  answers that not only solve the problem at hand but also educate and mentor the user in a clear, step-by-step manner.
- my base url is this---
 http://headlesswp.localwp-json/custom-api/v1   

-here is the road map you have to follow 
 Below is the ultimate, A‑to‑Z, ultra‑detailed roadmap that you can paste directly into your Copilot instruction file. This blueprint is written in the style recommended by global industry and prompt‑engineering experts. It covers every aspect of building your production‑ready review‑selling platform—from public user flows and company dashboards to a custom admin panel—with full integration of top‑notch security features. Follow each section step by step.

---

# ULTIMATE A‑TO‑Z ROADMAP FOR A REVIEW‑SELLING PLATFORM

This document is a comprehensive blueprint for constructing your review‑selling platform. It details the entire process—from initial planning and local environment setup through authentication, public/company/admin flows, integration of external services, security features, testing, deployment, and continuous integration. Use this roadmap as a “note‑down map” to instruct Copilot (or your development team) to generate code and configurations accordingly. Read it thoroughly and follow every instruction.

────────────────────────────────────────────
## SECTION 1: HIGH‑LEVEL ARCHITECTURE & REQUIREMENTS

### 1.1 Define Your Business Objectives & User Roles
- **Objective:**  
  - Build a review‑selling platform where:
    - **Public Users** can submit reviews (with video and survey data) for products.
    - **Company Users** can view product review statistics, purchase review data, and manage orders.
    - **Admin Users** (your internal team) can moderate reviews, manage users/products, process data removal requests, and handle support tickets.
- **User Roles:**  
  - **Public User:**  
    - Role = “subscriber” (or equivalent)  
    - **Condition Logic Revision:**  
      - In the registration form, if the user selects “Public,” then assign the role “subscriber.”  
  - **Company User:**  
    - Role = “company_user” (custom role with extra fields such as GST, phone, etc.)  
  - **Admin User:**  
    - Role = “admin” (or Administrator)

- **Key Functions:**  
  - **Public Users:** Registration (with OTP), login, profile management, review submission (video + survey), and payment tracking.
  - **Company Users:** A company dashboard (displaying product stats, review purchase flow, order history) and a multi‑step cart/checkout integration.
  - **Admin Users:** A custom admin panel that includes dashboard metrics, review moderation, user management, product/survey management, support ticket handling, and audit logging.

### 1.2 Define Security Requirements (Across All Areas)
- **Authentication & Session Security:**  
  - Use JWT‑based authentication with token expiry and refresh.
  - Implement email OTP verification (via an SMTP service like Brevo) during registration.
  - Ensure secure password storage using state‑of‑the‑art hashing (e.g., Argon2id).
  - Enforce rate limiting on login/registration endpoints.
- **API Security:**  
  - Configure a strict CORS policy (allow only your trusted domains).
  - Apply API rate limiting per IP and user.
  - Perform input validation and sanitization (to prevent SQL injection and XSS).
  - Enforce HMAC signature verification for critical external API calls.
- **Data & Video Storage Security:**  
  - Upload review videos to Google Drive via its API.
  - Process videos server‑side (using ffmpeg) to add watermarks.
  - Encrypt videos (or use storage‑level encryption) to prevent unauthorized reuse.
  - Implement video access restrictions and a deletion workflow (allow deletion requests within 24 hours with proof).
- **Blockchain Security:**  
  - Use the Goerli testnet (via Infura or Moralis) to record smart agreements.
  - Timestamp review submissions by storing SHA‑256 hashes on a smart contract.
  - Enforce smart‑contract–based user agreements (with view‑only modes for competitors).
- **Database Security:**  
  - Use prepared statements or an ORM for all queries.
  - Encrypt sensitive data using AES‑256.
  - Schedule daily database backups.
  - Log user IPs and implement anomaly detection for suspicious activities.
- **Hosting/Server Security:**  
  - Ensure SSL/TLS (HTTPS) for all domains and subdomains.
  - Use firewalls and DDoS protection (e.g., Cloudflare) and enable server monitoring.
  - Enable automated security updates and patching.

────────────────────────────────────────────
## SECTION 2: LOCAL DEVELOPMENT ENVIRONMENT & PROJECT ORGANIZATION

### 2.1 Install Required Software (Windows Recommended)
- **IDE & Tools:**  
  - Install Visual Studio Code (with ESLint, Prettier, and GitLens extensions).
  - Install Git for version control.
- **Local Server Stack for WordPress:**  
  - Use Local by Flywheel (or XAMPP/WAMP/MAMP) to run your WordPress backend.
- **Node.js & npm:**  
  - Install the latest LTS version from [nodejs.org](https://nodejs.org) and verify using `node -v` and `npm -v`.

### 2.2 Create Project Folders (e.g., `C:\Projects\HeadlessWP_React`)
- **Two Main Folders:**  
  - `backend_wordpress/` → Contains WordPress files.
  - `frontend_react/` → Contains your React application.


────────────────────────────────────────────
## SECTION 3: BACK‑END SETUP – HEADLESS WORDPRESS

### 3.1 Install and Configure WordPress
- **Download & Unzip:**  
  - Download WordPress from [wordpress.org](https://wordpress.org/download/) and unzip it into `backend_wordpress/` so that directories like `wp-admin`, `wp-content`, and `wp-includes` are at the root.
- **Configure wp‑config.php:**  
  - Rename `wp-config-sample.php` to `wp-config.php`.
  - Set the database constants:
    - `DB_NAME` = "headless_wp_db"
    - `DB_USER` = "root" (or your local DB user)
    - `DB_PASSWORD` = "" (or as configured)
    - `DB_HOST` = "localhost"
  - Insert unique keys and salts from the [WordPress Salt Generator](https://api.wordpress.org/secret-key/1.1/salt/).
- **Run the Installation:**  
  - Visit your local URL (e.g., `http://headless-wp-local.local`) and complete the installation with your chosen site title, admin username, password, and email.

### 3.2 Configure WordPress for Headless Operation
- **Permalinks:**  
  - Set to “Post name” in Settings → Permalinks.
- **User Roles:**  
  - Use built‑in roles for subscribers and administrators.
  - Create a custom role “company_user” (using a plugin like “User Role Editor” or via custom code in a plugin or theme’s functions.php).
- **REST API & Authentication:**  
  - The REST API is built in; install/configure a JWT Authentication plugin so that your React app can log in and receive tokens.
- **Security Plugins:**  
  - Install Wordfence or iThemes Security.
- **Custom Endpoints:**  
  - Create a custom plugin (e.g., in `wp-content/plugins/custom-endpoints/`) if you need endpoints for audit logging, support tickets, video uploads, or blockchain interactions.

────────────────────────────────────────────
## SECTION 4: AUTHENTICATION & USER REGISTRATION IMPLEMENTATION

### 4.1 Front‑End (React) Authentication Flow
- **Registration Flow (Register.js):**
  1. **Form Fields:**  
     - Include fields for name, email, password.
     - Include a radio button or dropdown for user type:
       - **If “Public” is selected:** Assign role “subscriber.”
       - **If “Company” is selected:** Assign role “company_user” and show additional fields (e.g., GST ID, website URL).
     - Include extra fields (address, phone for public; additional company details for company users).
  2. **OTP Verification:**  
     - Integrate an OTP verification step via a WordPress OTP plugin or custom endpoint (using Brevo/Twilio).
  3. **Submission:**  
     - Call your WordPress REST API endpoint to create the user.
     - On success, receive a JWT token containing the user role.
  4. **Token Storage:**  
     - Save the token in localStorage and update AuthContext.

- **Login Flow (Login.js):**
  1. **Form Fields:**  
     - Email/username and password.
  2. **Submission:**  
     - Call the WordPress JWT endpoint.
     - Save the returned token and user role.
  3. **Redirect Logic:**  
     - **If role === "admin":** Redirect to `/admin/dashboard`.
     - **If role === "company_user":** Redirect to `/dashboard/company`.
     - **Else (public user):** Redirect to `/dashboard/public`.
- **Security Measures:**  
  - Implement rate limiting on login attempts (via a plugin or server configuration).
  - Ensure all communications use HTTPS.
  - Rely on WordPress’s secure password hashing.

### 4.2 Back‑End (WordPress) Authentication Security
- **JWT & OTP Configuration:**  
  - Configure the JWT plugin to enforce token expiry and refresh.
  - Set up OTP verification via a plugin or custom code.
- **Additional Security:**  
  - Implement server‑side rate limiting.
  - Sanitize all inputs using WordPress functions.

────────────────────────────────────────────
## SECTION 5: REACT FRONTEND – PUBLIC & COMPANY FLOWS

### 5.1 Public User Flow
- **Home/Landing Page (Home.js):**  
  - Display introductory content, product previews, and CTAs for login/register.
  - Fetch top products from WordPress via REST API.
- **Public Dashboard (PublicDashboard.js):**  
  - Show user-specific metrics (e.g., total reviews, earnings, recent activity).
  - Include a Product List component linking to individual product review pages.
- **Review Submission Flow:**
  1. **Product Selection:**  
     - Navigate to `/product/:id/review` when a product is selected.
  2. **Review Form:**  
     - Display survey questions.
     - Use VideoRecorder.js to capture two videos: one for the review (survey) and one for identity/authentication.
  3. **Upload Process:**  
     - Package survey data and video files.
     - Call a custom WordPress endpoint (or plugin) to upload videos to Google Drive (with server‑side watermarking via ffmpeg) and return file IDs.
  4. **Data Storage:**  
     - Store review details (user ID, product ID, video file IDs, survey answers) in a custom post type or table using the REST API.
- **Profile & Payment:**  
  - Provide a section for users to view their earnings and transaction history.

### 5.2 Company User Flow
- **Company Dashboard (CompanyDashboard.js):**  
  - Display product review statistics (e.g., number of reviews, regional breakdown).
  - Enable companies to view detailed product pages with purchased review data.
- **Purchase Reviews Flow:**
  1. **Product Details:**  
     - Show product review stats and available data.
  2. **Cart & Checkout:**  
     - Implement a multi‑step cart where companies select regions/quantities.
     - Integrate Razorpay:
       - Load Razorpay’s script.
       - On “Pay Now,” call a WordPress endpoint to generate an order ID.
       - Process the payment on the client and update the order status in WordPress.
- **Post‑Purchase:**  
  - Display a “My Reviews” section listing purchased review data with links to view associated videos (permissions controlled).

────────────────────────────────────────────
## SECTION 6: ADMIN PANEL IMPLEMENTATION

### 6.1 Admin Login & Route Protection
- **Admin Login:**  
  - Use the common login form; after authentication, check that `user.role === 'admin'` and redirect to `/admin/dashboard`.
- **ProtectedRoute for Admin:**  
  - Create (or extend) a ProtectedRoute component that verifies the user is an admin; otherwise, redirect to `/login`.

### 6.2 Admin Dashboard (pages/Admin/Dashboard.js)
- **Overview:**  
  - Display key metrics: total reviews, pending actions, flagged reviews, and user activity.
  - Use charts (Chart.js or Recharts) to visualize data.
- **Data Source:**  
  - Fetch aggregated data from custom WordPress endpoints.

### 6.3 Review Management Module (ReviewManagement.js)
- **Features:**  
  - Display a table of all reviews (both public and company) with filters (by product, status, user).
  - Include action buttons for:
    - **Approve:** Update review status to “approved.”
    - **Reject/Delete:** Remove review and send an automated email with a rejection reason.
    - **Flag:** Mark review as suspicious.
  - Implement inline messaging or modal for rejection reasons.
- **API Integration:**  
  - Use secure API calls via apiService.js (include JWT token in headers).

### 6.4 User Management Module (UserManagement.js)
- **Features:**  
  - List all users (public and company) with details (role, registration date, status).
  - Provide controls to:
    - Edit user details/roles.
    - Ban or suspend accounts (with options for temporary bans, e.g., “Ban for 24 hours”).
    - Delete accounts.
  - Log every action (audit logging).

### 6.5 Product & Survey Management Module (ProductManagement.js)
- **Features:**  
  - Enable adding, editing, and deleting products.
  - Manage survey questions linked to products.
  - Use validated, controlled forms.
- **Data Handling:**  
  - Update via custom endpoints or Advanced Custom Fields (ACF) with REST API integration.

### 6.6 Support Ticket Management (SupportTickets.js)
- **Features:**  
  - Display support tickets submitted by users (custom post type or plugin).
  - Provide an interface to reply, mark tickets as “open” or “closed.”
  - Optionally integrate with an email service for automatic notifications.

### 6.7 Audit Log Module (AuditLog.js)
- **Features:**  
  - Show a chronological log of all admin actions (timestamp, admin user, action performed, target).
  - Fetch logs from a custom WordPress endpoint that records these events.

────────────────────────────────────────────
## SECTION 7: VIDEO STORAGE, WATERMARKING & BLOCKCHAIN INTEGRATION

### 7.1 Video Storage & Security
- **Google Drive API Integration:**  
  - Create a Google Cloud project, enable the Drive API, and generate OAuth client credentials.
  - In a custom WordPress plugin, implement PHP code to:
    - Receive video uploads from the React app.
    - Use the Google Drive API (with a PHP client library) to upload the video.
    - Return the Google Drive file ID.
- **Watermarking & Encryption:**  
  - Use ffmpeg (triggered via PHP) on the server to add watermarks before upload.
  - Optionally encrypt the video file or use Google Drive’s built‑in encryption.
- **Access Restriction & Deletion Workflow:**  
  - Ensure uploaded videos are not publicly accessible (set proper sharing settings).
  - Create an endpoint to request deletion (within 24 hours, with proof); admin reviews and triggers deletion via the API.

### 7.2 Blockchain Integration (Goerli Testnet)
- **Smart Contract Deployment:**  
  - Use Infura or Moralis to connect to the Goerli testnet.
  - Develop a Solidity smart contract that:
    - Accepts a SHA‑256 hash of review data (including video file IDs) for timestamping.
    - Records user agreements (terms acceptance) as an immutable log.
    - Optionally enforces smart‑contract–based authentication.
- **Integration:**  
  - When a review is submitted, compute its hash (on the server or client) and call your smart contract via a custom WordPress endpoint.
  - Store the transaction ID or blockchain reference in your database.
- **Blockchain Watermarking:**  
  - Optionally, record a watermark hash on the blockchain to ensure data ownership and verify tampering.

────────────────────────────────────────────
## SECTION 8: MYSQL DATABASE & SERVER SECURITY

### 8.1 Database Security
- **Prevent SQL Injection:**  
  - Use prepared statements or an ORM in all custom WordPress code.
- **Encryption:**  
  - Encrypt sensitive fields (using AES‑256) as needed.
- **Backups & Logging:**  
  - Schedule daily backups.
  - Log user IPs and implement anomaly detection (via plugins or custom scripts).

### 8.2 Hosting & Server Security
- **SSL/TLS:**  
  - Ensure all domains and subdomains (public site and admin) use SSL certificates.
- **Firewall & DDoS Protection:**  
  - Configure a server firewall; consider Cloudflare for DDoS mitigation.
- **Server Monitoring:**  
  - Use monitoring tools (e.g., Sentry, LogRocket) to track errors and suspicious activity.
- **Automated Patching:**  
  - Keep your OS, PHP, Node.js, and dependencies updated automatically.

────────────────────────────────────────────
## SECTION 9: TESTING, DEPLOYMENT & CONTINUOUS INTEGRATION

### 9.1 Local & Integration Testing
- **Local Testing:**  
  - Test the WordPress installation (registration, login, REST API endpoints, JWT authentication).
  - Run your React app locally (using `npm start`) and test all flows (public, company, admin).
  - Use Postman to test custom endpoints (video upload, blockchain submission, audit logging).
- **Integration Testing:**  
  - Verify role‑based routing in React (ensure non‑admins cannot access admin routes).
  - Test OTP verification, rate limiting, API sanitization, and error handling.
  - Validate video upload, watermarking, and deletion workflows.
  - Simulate blockchain transactions on Goerli and verify logs.

### 9.2 Deployment Strategy
- **React Frontend Deployment:**  
  - Deploy using Vercel, Netlify, or a similar service.
  - Set up separate deployments for your public site and admin panel (e.g., use subdomains like `admin.yourdomain.com`).
- **WordPress Backend Deployment:**  
  - Host on a secure server with SSL (ensure a current, secure PHP version).
- **DNS & SSL:**  
  - Configure DNS to map your domains/subdomains.
  - Install and configure SSL certificates (e.g., via Let’s Encrypt).

### 9.3 Continuous Integration (CI) & Monitoring
- **CI Pipeline:**  
  - Set up GitHub Actions (or similar) to run unit and integration tests on every commit.
- **Error & Activity Monitoring:**  
  - Integrate Sentry/LogRocket for error tracking in your React app.
  - Monitor WordPress logs and audit trails.
- **Regular Reviews:**  
  - Periodically review audit logs and security reports.

────────────────────────────────────────────
## SECTION 10: FINAL CHECKLIST & EXECUTION

### Final Checklist Before Launch
1. **Requirements Document:**  
   - Ensure every feature (public review flow, company dashboard, admin panel) and all security measures are fully documented.
2. **Development Environment Setup:**  
   - Verify that Node.js, VS Code, and Local by Flywheel are configured correctly.
   - Confirm that the folder structure is set up and both frontend and backend work independently.
3. **WordPress Configuration:**  
   - Install and secure WordPress; configure custom roles and REST endpoints.
4. **React App Development:**  
   - Implement all pages and components with proper routing and authentication.
   - Test OTP, JWT, API calls, and role‑based route protection.
5. **Security Integration:**  
   - Verify API security (CORS, rate limiting, input validation).
   - Test video upload, watermarking, encryption, and deletion request workflows.
   - Confirm blockchain transactions are recorded correctly.
6. **Database & Server Security:**  
   - Ensure prepared statements, encryption, backups, and firewall protections are in place.
7. **Testing & Deployment:**  
   - Perform thorough local, integration, and user testing.
   - Deploy the frontend and backend, configure SSL/DNS, and set up CI.
8. **Monitoring & Maintenance:**  
   - Set up continuous monitoring and error logging.
   - Document all endpoints, data flows, and security configurations.

### Execution Steps
1. **Step 1:** Instruct your AI model (Copilot) to set up the development environment as per Section 2.
2. **Step 2:** Generate the folder structure and initial boilerplate code (using create‑react‑app for the frontend and installing WordPress for the backend).
3. **Step 3:** Implement authentication and registration (front‑end and back‑end) with OTP and JWT security.
4. **Step 4:** Develop the public user flow:
   - Home page, review submission (with video recording and survey), profile, and payment display.
5. **Step 5:** Develop the company user flow:
   - Company dashboard, product review statistics, and cart/checkout integration with Razorpay.
6. **Step 6:** Build the admin panel:
   - Admin login (with role‑based redirection), dashboard, review management, user management, product/survey management, support ticket handling, and audit log display.
7. **Step 7:** Integrate external services:
   - Google Drive for video uploads (with server‑side watermarking via ffmpeg), Razorpay for payments, and blockchain for timestamping and smart agreements.
8. **Step 8:** Integrate all security features into every module as described in Section 1.2.
9. **Step 9:** Test every component thoroughly (unit, integration, and end‑to‑end tests) using Postman and your CI pipeline.
10. **Step 10:** Deploy both the frontend and backend to production, configure CI/CD, and enable continuous monitoring.

────────────────────────────────────────────
## CONCLUSION

This ultimate, ultra‑detailed roadmap is designed to guide you—step by step—from planning to deployment. It covers all facets of building your review‑selling platform (public, company, and admin workflows) with robust, industry‑leading security measures integrated at every level. By following these instructions exactly, you will be able to instruct your AI (or team) to generate production‑ready code and configurations.  
 
Remember: a well‑planned and secure foundation is the key to a robust and scalable application. Use this document as your comprehensive guide for success.

--