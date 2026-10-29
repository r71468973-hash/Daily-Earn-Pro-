# Daily Earn Pro - Security Specification & Test Protocol

## 1. Data Invariants
1. **PII Isolation**: A user's profile `/users/{userId}` contains email and private metadata. A non-admin user can NEVER read another user's document or list the `/users` collection.
2. **Zero-Trust Role Integrity**: Users cannot grant themselves `role: "admin"` during registration or update. Admin authority requires verified membership in `/admins/{adminId}` or hardcoded bootstrapped owner verification.
3. **Identity Verification**: On creation of `/users/{userId}`, `incoming().uid` must match `request.auth.uid`.
4. **Admin Dashboard Isolation**: The `/app_stats` and `/users` collections cannot be queried/listed by unauthenticated or non-admin users.
5. **Path ID Integrity**: All document IDs must adhere to `isValidId()` (regex `^[a-zA-Z0-9_\-]+$`, max 128 characters).

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Read of User Profile**: Anonymous/signed-out request querying `/users/user123`.
2. **Cross-User Snooping**: Authenticated user `userA` attempting `get()` on `/users/userB`.
3. **User List Scraping**: Non-admin user querying `getDocs(collection(db, 'users'))`.
4. **Self-Escalation to Admin on Signup**: User creating `/users/userA` with `{ uid: "userA", email: "userA@test.com", role: "admin" }`.
5. **Update Escalation**: User `userA` attempting `updateDoc(doc(db, 'users', 'userA'), { role: 'admin' })`.
6. **Identity Spoofing**: User `userA` creating a user doc at `/users/userB` with `uid: "userB"`.
7. **Junk Path Injection**: Writing to `/users/{1.5KB_junk_string}` to poison indexing.
8. **Direct Admin Record Creation**: Normal user writing their own UID into `/admins/{userA}`.
9. **Admin Listing by Normal User**: User querying `getDocs(collection(db, 'admins'))`.
10. **App Stats Tampering**: Non-admin user deleting or directly overwriting `/app_stats/global`.
11. **App Stats Read by Regular User**: User querying `/app_stats/global` without admin privileges.
12. **Ghost Field Injection**: Adding unknown malicious keys (e.g. `isSuperUser: true`) to user profile.

## 3. Test Runner
Defined in `tests/firestore.rules.test.ts` to validate all invariants against the rules.
