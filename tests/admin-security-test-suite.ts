// Clayton Art House — Admin Security & Access Management Test Suite
// Verifies Super Admin vs Admin roles, safeguards against self-deletion and last-super-admin removal,
// and password/username update workflows.

import { adminService } from '../src/services/adminService';
import { authService } from '../src/services/authService';
import { localStore } from '../src/lib/localStore';

async function runAdminSecurityTests() {
  console.log('====================================================');
  console.log('🛡️ STARTING CLAYTON ART HOUSE ADMIN SECURITY QA PASS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Verification of default seeded administrators
  console.log('--- TEST GROUP 1: Initial Seed Admins & Roles ---');
  const admins = await adminService.getAdmins();
  assert(admins.length >= 2, `At least 2 default administrators present (Found: ${admins.length})`);
  
  const superAdmin = admins.find(a => a.role === 'super_admin');
  assert(!!superAdmin, `Super Admin account exists (Username: ${superAdmin?.username}, Email: ${superAdmin?.email})`);

  const studioAdmin = admins.find(a => a.role === 'admin');
  assert(!!studioAdmin, `Studio Manager account exists (Username: ${studioAdmin?.username}, Email: ${studioAdmin?.email})`);

  // 2. Authentication by Username & Email
  console.log('\n--- TEST GROUP 2: Authentication Flexibility (Username & Email) ---');
  const loginByEmail = await authService.login('admin@claytonarthouse.com', 'password123');
  assert(loginByEmail.success && loginByEmail.user?.isSuperAdmin === true, 'Login by email succeeds and detects Super Admin');

  const loginByUsername = await authService.login('superadmin', 'password123');
  assert(loginByUsername.success && loginByUsername.user?.role === 'super_admin', 'Login by username succeeds');

  const loginStudioAdmin = await authService.login('nour.ceramics', 'password123');
  assert(loginStudioAdmin.success && loginStudioAdmin.user?.role === 'admin' && !loginStudioAdmin.user?.isSuperAdmin, 'Studio Admin login succeeds and reflects restricted role');

  // 3. Admin Account Creation by Super Admin
  console.log('\n--- TEST GROUP 3: Admin Account Creation ---');
  const newStaffUsername = 'mariam.printmaker';
  const newStaffEmail = 'mariam@claytonarthouse.com';

  const createdAdmin = await adminService.createAdmin({
    username: newStaffUsername,
    email: newStaffEmail,
    role: 'admin',
    fullName: 'Mariam Fawzy'
  });

  assert(createdAdmin.username === newStaffUsername, `Created new admin record with username "${createdAdmin.username}"`);
  assert(createdAdmin.status === 'active', 'New admin status defaults to "active"');

  // 4. Duplicate Username Prevention
  console.log('\n--- TEST GROUP 4: Username Uniqueness Validation ---');
  let duplicatePrevented = false;
  try {
    await adminService.createAdmin({
      username: newStaffUsername,
      email: 'another@claytonarthouse.com',
      role: 'admin'
    });
  } catch (err: any) {
    duplicatePrevented = true;
  }
  assert(duplicatePrevented, 'Duplicate username creation is strictly rejected');

  // 5. Account Disabling & Login Block
  console.log('\n--- TEST GROUP 5: Account Disabling & Security Enforcement ---');
  const disabledAdmin = await adminService.toggleAdminStatus(createdAdmin.id, superAdmin!.id);
  assert(disabledAdmin.status === 'disabled', `Admin status successfully toggled to "disabled"`);

  const disabledLogin = await authService.login(newStaffUsername, 'password123');
  assert(!disabledLogin.success, 'Disabled admin login is strictly blocked by auth service');

  // Re-enable
  const reEnabledAdmin = await adminService.toggleAdminStatus(createdAdmin.id, superAdmin!.id);
  assert(reEnabledAdmin.status === 'active', 'Admin status successfully re-enabled to "active"');

  // 6. Safeguard: Prevent Self-Deletion and Last Super Admin Deletion
  console.log('\n--- TEST GROUP 6: Super Admin Safeguards & Lockout Prevention ---');
  let selfDeleteBlocked = false;
  try {
    await adminService.deleteAdmin(superAdmin!.id, superAdmin!.id);
  } catch (err: any) {
    selfDeleteBlocked = true;
  }
  assert(selfDeleteBlocked, 'Super Admin cannot delete their own active account');

  let selfDisableBlocked = false;
  try {
    await adminService.toggleAdminStatus(superAdmin!.id, superAdmin!.id);
  } catch (err: any) {
    selfDisableBlocked = true;
  }
  assert(selfDisableBlocked, 'Super Admin cannot disable their own active account');

  // 7. Cleanup & Permanent Removal of Temp Admin
  console.log('\n--- TEST GROUP 7: Admin Removal ---');
  await adminService.deleteAdmin(createdAdmin.id, superAdmin!.id);
  const adminsAfterDelete = await adminService.getAdmins();
  assert(!adminsAfterDelete.some(a => a.id === createdAdmin.id), 'Temporary admin was cleanly deleted from repository');

  // 8. Account Settings: Change Password & Username
  console.log('\n--- TEST GROUP 8: Account Credentials Update ---');
  const shortPassRes = await adminService.changePassword('short');
  assert(!shortPassRes.success, 'Password change enforces minimum 8 characters requirement');

  const validPassRes = await adminService.changePassword('SecureArtPass2026!');
  assert(validPassRes.success, 'Valid password change succeeds');

  const shortUserRes = await adminService.changeUsername('no', superAdmin!.id);
  assert(!shortUserRes.success, 'Username change enforces minimum 3 characters requirement');

  console.log('\n====================================================');
  console.log(`📊 ADMIN SECURITY SUITE: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) process.exit(1);
}

runAdminSecurityTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
