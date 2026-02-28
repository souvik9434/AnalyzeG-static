# Requirements Document

## Introduction

AnalyzeG is a comprehensive review marketplace platform that connects B2C users who submit authentic product reviews with B2B companies seeking consumer insights. The platform uses a limited-time dual-stage B2C payout model: users can receive up to ₹40 instantly after authentic review verification, then receive the remaining amount from their 50% share when a company purchases the review. B2B companies can purchase aggregated consumer review data for market research and competitive analysis. The system includes a comprehensive admin portal for review verification, user management, and data delivery.

## Requirements

### Requirement 1: B2C User Management System

**User Story:** As a B2C user, I want to register, login, and manage my profile so that I can participate in the review marketplace and track my earnings.

#### Acceptance Criteria

1. WHEN a new user visits the registration page THEN the system SHALL provide email/password registration with Firebase Authentication
2. WHEN a user completes registration THEN the system SHALL create a user profile in Firestore with default B2C role
3. WHEN a registered user logs in THEN the system SHALL authenticate via Firebase Auth and redirect to B2C dashboard
4. WHEN a B2C user accesses their dashboard THEN the system SHALL display profile information, available products, and earnings summary
5. IF a user is not authenticated THEN the system SHALL redirect to login page for protected routes

### Requirement 2: Admin Management System

**User Story:** As an admin, I want a secure administrative interface to manage products, questionnaires, users, and review verification so that I can maintain platform quality and operations.

#### Acceptance Criteria

1. WHEN an admin accesses `/portal-admin` THEN the system SHALL verify admin custom claims before granting access
2. WHEN an admin manages products THEN the system SHALL provide full CRUD operations with image upload to Firebase Storage
3. WHEN an admin manages questionnaires THEN the system SHALL provide full CRUD operations for dynamic questionnaire creation
4. WHEN an admin views the review verification queue THEN the system SHALL display pending reviews with all submission data
5. WHEN an admin approves/rejects a review THEN the system SHALL update review status and trigger aggregation updates
6. WHEN an admin views user management THEN the system SHALL provide search, view, and account disable functionality
7. WHEN an admin accesses payout dashboard THEN the system SHALL display B2C users with pending payouts

### Requirement 3: Review Submission System

**User Story:** As a B2C user, I want to submit comprehensive video reviews for products so that I can earn money for providing valuable consumer insights.

#### Acceptance Criteria

1. WHEN a B2C user selects a product THEN the system SHALL display the associated questionnaire for that product
2. WHEN a user progresses through review submission THEN the system SHALL implement a multi-step flow with questionnaire completion
3. WHEN a user records videos THEN the system SHALL capture dual videos (activity demonstration + pros/cons analysis) using MediaRecorder API
4. WHEN a user uploads videos THEN the system SHALL use secure signed URLs from Cloud Functions for direct Storage upload
5. WHEN a user submits a review THEN the system SHALL store all data in Firestore with "pending" status
6. WHEN a user checks review status THEN the system SHALL display current status (pending/approved/rejected) with timestamps

### Requirement 4: B2B User System

**User Story:** As a B2B company representative, I want to register, browse available review data, and make purchases so that I can access consumer insights for business decisions.

#### Acceptance Criteria

1. WHEN a B2B user registers THEN the system SHALL assign B2B custom claims and create appropriate user profile
2. WHEN a B2B user logs in THEN the system SHALL redirect to B2B dashboard based on user claims
3. WHEN a B2B user accesses marketplace THEN the system SHALL display products with aggregated review counts and filtering options
4. WHEN a B2B user applies filters THEN the system SHALL filter products based on demographics, review count, and other criteria
5. WHEN a B2B user views purchase history THEN the system SHALL display all completed purchases with access links

### Requirement 5: Marketplace and Payment System

**User Story:** As a B2B user, I want to add review data to a cart and complete secure payments so that I can purchase the consumer insights I need.

#### Acceptance Criteria

1. WHEN a B2B user adds items to cart THEN the system SHALL maintain cart state using React Context or local storage
2. WHEN a B2B user proceeds to checkout THEN the system SHALL integrate with Razorpay/Stripe for secure payment processing
3. WHEN a payment is successful THEN the system SHALL trigger Cloud Function to create purchase record in Firestore
4. WHEN a purchase is completed THEN the system SHALL generate data bundles and provide secure access links
5. IF a payment fails THEN the system SHALL display appropriate error messages and maintain cart state

### Requirement 6: Data Aggregation and Delivery System

**User Story:** As a B2B user, I want to access purchased review data in professional formats so that I can integrate the insights into my business processes.

#### Acceptance Criteria

1. WHEN a review is approved THEN the system SHALL automatically update product aggregation data in `/product_aggregations` collection
2. WHEN a B2B purchase is completed THEN the system SHALL generate JSON and CSV data bundles via Cloud Functions
3. WHEN data bundles are ready THEN the system SHALL send email notifications with secure access links via SendGrid/Mailgun
4. WHEN a B2B user accesses data THEN the system SHALL provide 7-day signed URLs for secure download
5. WHEN accessing video content THEN the system SHALL differentiate between download and streaming based on user/brand type

### Requirement 7: Payout System

**User Story:** As a B2C user, I want to receive payments for my approved reviews so that I can be compensated for my contributions to the platform.

#### Acceptance Criteria

1. WHEN a review is approved and verified as authentic THEN the system SHALL support a limited-time instant payout of up to ₹40 and update user balance
2. WHEN the same review is purchased by a company THEN the system SHALL pay the remaining amount from the user's 50% share after subtracting any instant payout already paid
3. WHEN an admin triggers payouts THEN the system SHALL integrate with RazorpayX/Cashfree Payouts API for batch processing
4. WHEN payouts are processed THEN the system SHALL update user records and send confirmation notifications
5. WHEN a B2C user views dashboard THEN the system SHALL display current earnings, pending payouts, and payout history

### Requirement 8: Support and Communication System

**User Story:** As any platform user, I want to submit support tickets and receive assistance so that I can resolve issues and get help when needed.

#### Acceptance Criteria

1. WHEN a user submits a support ticket THEN the system SHALL create a record in `/supportTickets` collection with user details
2. WHEN an admin views support dashboard THEN the system SHALL display all tickets with status and priority filtering
3. WHEN an admin updates ticket status THEN the system SHALL notify the user via email
4. WHEN system events occur THEN the system SHALL send appropriate email notifications to relevant users

### Requirement 9: Data Intelligence and Analytics

**User Story:** As an admin or B2B user, I want access to advanced analytics and sentiment analysis so that I can gain deeper insights from the review data.

#### Acceptance Criteria

1. WHEN review text is processed THEN the system SHALL perform sentiment analysis using Google Cloud Natural Language API
2. WHEN an admin accesses analytics dashboard THEN the system SHALL display platform metrics (user growth, revenue, review volume)
3. WHEN aggregation is needed THEN the system SHALL provide admin-triggered functions for large-scale data processing
4. WHEN B2B users access purchased data THEN the system SHALL include sentiment scores and analytical insights

### Requirement 10: Security and Authentication

**User Story:** As a platform stakeholder, I want robust security measures to protect user data and ensure proper access control so that the platform maintains trust and compliance.

#### Acceptance Criteria

1. WHEN any user accesses the platform THEN the system SHALL implement proper authentication via Firebase Auth
2. WHEN users access role-specific features THEN the system SHALL verify custom claims (admin, b2b, b2c)
3. WHEN data is stored or transmitted THEN the system SHALL implement Firestore security rules and secure data handling
4. WHEN files are uploaded or accessed THEN the system SHALL use signed URLs and proper access controls
5. WHEN sensitive operations occur THEN the system SHALL log activities and implement proper error handling