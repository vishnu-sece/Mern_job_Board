# MERN Job Board - Complete Flow Test

## Test the Complete Application Flow

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```

### 3. Test Authentication Flow

#### Employer Registration & Login
1. Go to `/register`
2. Register as employer:
   - Name: Test Employer
   - Email: employer@test.com
   - Password: password123
   - Role: employer
3. Should auto-login and redirect to home
4. Verify navbar shows "Post Job" button
5. Logout and login again - should persist auth state

#### Job Seeker Registration & Login
1. Register as candidate:
   - Name: Test Candidate
   - Email: candidate@test.com
   - Password: password123
   - Role: candidate
2. Should auto-login and redirect to home
3. Verify navbar shows "My Applications" button

### 4. Test Job Flow

#### Employer Posts Job
1. Login as employer
2. Click "Post Job" in navbar
3. Fill job form:
   - Title: Frontend Developer
   - Company: Tech Corp
   - Experience: 2-3 years
   - Skills: React, JavaScript, CSS
   - Description: Looking for skilled developer...
4. Submit job
5. Should redirect to `/jobs` and see the posted job

#### Job Seeker Views Jobs
1. Login as candidate
2. Go to `/jobs`
3. Should see the posted job
4. Click "View Details"
5. Should see full job details

### 5. Test Application Flow

#### Job Seeker Applies
1. On job details page, click "Start Application"
2. Fill application form:
   - Name: Test Candidate
   - Email: candidate@test.com
   - Phone: 123-456-7890
   - Skills: React, JavaScript
   - Upload PDF resume
3. Submit application
4. Should redirect to `/applied-jobs`
5. Should see application with "Applied" status

#### Employer Manages Applications
1. Login as employer
2. Go to `/jobs`
3. Click "Manage Applications" on posted job
4. Should see candidate application
5. Test reject: Click "Reject" - status should update
6. Test appointment: Click "Give Appointment"
   - Select date and time
   - Submit
   - Status should change to "Selected"

#### Job Seeker Sees Status Update
1. Login as candidate
2. Go to `/applied-jobs`
3. Should see updated status (Rejected/Selected)
4. If selected, should see appointment details

### 6. Test Route Protection

#### Test Employer Routes
1. Logout
2. Try to access `/post-job` - should redirect to login
3. Login as candidate
4. Try to access `/post-job` - should redirect to home

#### Test Candidate Routes
1. Login as employer
2. Try to access `/applied-jobs` - should redirect to home

### 7. Test Database Fallback

#### Test with MongoDB Unavailable
1. Stop MongoDB or use invalid connection string
2. Restart backend
3. Should see "Running in In-Memory mode"
4. All functionality should still work
5. Data persists during session but resets on restart

### 8. Test Page Refresh & Navigation

#### Test Auth Persistence
1. Login as any user
2. Refresh page - should stay logged in
3. Navigate between pages - should stay logged in
4. Close browser and reopen - should stay logged in

### Expected Results

✅ **Authentication**
- Registration works for both roles
- Login persists across page refresh
- Role-based navigation appears correctly
- Protected routes work properly

✅ **Job Flow**
- Employers can post jobs
- Jobs appear immediately in jobs list
- Job details page works correctly
- Employers can delete their own jobs

✅ **Application Flow**
- Candidates can apply for jobs
- Applications appear in employer dashboard
- Status updates work (reject/appoint)
- Candidates see updated status

✅ **Database Reliability**
- Works with MongoDB when available
- Falls back to in-memory when MongoDB unavailable
- No crashes or undefined errors
- Consistent API responses

✅ **UI/UX**
- No layout changes
- All Tailwind styles preserved
- Smooth navigation
- No random redirects to login