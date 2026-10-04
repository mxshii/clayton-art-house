// Clayton Art House — Automated QA & Concurrency Test Suite
import { localStore } from '../src/lib/localStore';
import { workshopService } from '../src/services/workshopService';
import { sessionService } from '../src/services/sessionService';
import { bookingService } from '../src/services/bookingService';
import { inquiryService } from '../src/services/inquiryService';
import { activePaymentGateway } from '../src/services/paymentService';

async function runQASuite() {
  console.log('====================================================');
  console.log('🧪 STARTING CLAYTON ART HOUSE AUTOMATED QA TEST PASS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // 1. Workshops Catalog Verification
  console.log('--- TEST GROUP 1: Workshops & Details ---');
  const workshops = await workshopService.getWorkshops(true);
  assert(workshops.length >= 6, `Catalog contains at least 6 workshops (Found: ${workshops.length})`);
  
  const pottery = await workshopService.getWorkshopBySlugOrId('pottery-session') || await workshopService.getWorkshopBySlugOrId('hand-building');
  assert(pottery !== null && pottery.priceEgp === 350, 'Found Pottery Session with verified price 350 EGP');
  assert(pottery?.whatIsIncluded.length! > 0, `What is included populated (${pottery?.whatIsIncluded.length} items)`);

  // 2. Sessions & Capacity Calculations
  console.log('\n--- TEST GROUP 2: Sessions & Live Remaining Seats ---');
  const sessions = await sessionService.getSessions(pottery?.id);
  assert(sessions.length >= 3, `Pottery has multiple sessions (Found: ${sessions.length})`);

  const activeSession = sessions.find(s => s.capacity - s.bookedSeats > 0)!;
  const initialAvailable = activeSession.capacity - activeSession.bookedSeats;
  console.log(`Target Session: ${activeSession.id} | Capacity: ${activeSession.capacity} | Booked: ${activeSession.bookedSeats} | Available: ${initialAvailable}`);
  assert(initialAvailable > 0, 'Target session has available seats before test');

  // 3. Atomic Booking Creation & Seat Decrement
  console.log('\n--- TEST GROUP 3: Concurrency & Booking Creation ---');
  const bookingResult = await bookingService.createBooking({
    sessionId: activeSession.id,
    attendeesCount: 2,
    customerName: 'Nouran Halim',
    customerEmail: 'nouran.halim@alexandria.eg',
    customerPhone: '+20 101 234 5678',
    specialRequests: 'Celebrating graduation with sister',
    paymentProvider: 'mock',
    paymentMethod: 'Credit Card'
  });

  assert(bookingResult.success === true, `Booking created successfully with Ref: ${bookingResult.bookingNumber}`);
  assert(!!bookingResult.confirmationCode, `Confirmation code issued: ${bookingResult.confirmationCode}`);

  // Re-fetch session to verify capacity decrement
  const updatedSession = await sessionService.getSessionById(activeSession.id);
  const newAvailable = updatedSession!.capacity - updatedSession!.bookedSeats;
  assert(
    newAvailable === initialAvailable - 2,
    `Capacity correctly decremented: was ${initialAvailable}, now ${newAvailable}`
  );

  // 4. Overbooking Prevention
  console.log('\n--- TEST GROUP 4: Overbooking Protection Verification ---');
  // Attempt to book more seats than available
  const overbookResult = await bookingService.createBooking({
    sessionId: activeSession.id,
    attendeesCount: newAvailable + 5, // Exceeds remaining seats!
    customerName: 'Greedy Attempter',
    customerEmail: 'overbook@test.com',
    customerPhone: '+20 111 000 0000'
  });

  assert(overbookResult.success === false, 'Overbooking attempt strictly blocked by database engine');
  assert(
    overbookResult.error?.includes('remaining') || overbookResult.error?.includes('booked') || false,
    `Clear friendly customer error returned: "${overbookResult.error}"`
  );

  // 5. Booking Cancellation & Atomic Seat Restoration
  console.log('\n--- TEST GROUP 5: Cancellation & Seat Restoration ---');
  const cancelSuccess = await bookingService.cancelBooking(
    bookingResult.bookingId!,
    'Customer requested date change'
  );
  assert(cancelSuccess === true, 'Booking cancelled successfully');

  const restoredSession = await sessionService.getSessionById(activeSession.id);
  const restoredAvailable = restoredSession!.capacity - restoredSession!.bookedSeats;
  assert(
    restoredAvailable === initialAvailable,
    `Seats restored cleanly back to ${initialAvailable} (now: ${restoredAvailable})`
  );

  // 6. Customer CRM Aggregation
  console.log('\n--- TEST GROUP 6: Customer CRM & Spend Tracking ---');
  const customers = localStore.getCustomers();
  const customerRecord = customers.find(c => c.email.toLowerCase() === 'nouran.halim@alexandria.eg');
  assert(!!customerRecord, 'Customer profile automatically created in CRM');
  assert(customerRecord?.totalBookings! >= 1, `Customer bookings count tracked (${customerRecord?.totalBookings})`);

  // 7. Private Event Inquiry Lifecycle
  console.log('\n--- TEST GROUP 7: Private Event Inquiries ---');
  const inquiry = await inquiryService.submitInquiry({
    eventType: 'Corporate Retreat',
    preferredDate: '2026-11-15',
    guestCount: 16,
    budgetRange: '15,000 - 20,000 EGP',
    name: 'Tarek Zaki',
    phone: '+20 120 333 4444',
    email: 'tarek@alexcreative.com',
    notes: 'Team pottery session in courtyard with coffee catering'
  });

  assert(!!inquiry.id, `Inquiry created with ID: ${inquiry.id}`);
  assert(inquiry.status === 'new', 'Initial status is "new"');

  const updatedInquiry = await inquiryService.updateInquiryStatus(inquiry.id, 'quoted', 'Quotation sent by Farida');
  assert(updatedInquiry.status === 'quoted', 'Admin status updated to "quoted"');
  assert(updatedInquiry.adminNotes === 'Quotation sent by Farida', 'Admin follow-up notes persisted');

  // 8. Payment Gateway Abstraction
  console.log('\n--- TEST GROUP 8: Egyptian Payment Gateway Abstraction ---');
  const paymentInit = await activePaymentGateway.initiatePayment({
    bookingId: 'test-booking-uuid',
    bookingNumber: 'CLY-TEST-123',
    amountEgp: 1500,
    customerName: 'Nouran Halim',
    customerEmail: 'nouran.halim@alexandria.eg',
    customerPhone: '+20 101 234 5678',
    workshopTitle: 'Hand-Building Pottery'
  });

  assert(!!paymentInit.transactionRef, `Gateway initiated with TXN: ${paymentInit.transactionRef}`);
  const verified = await activePaymentGateway.verifyPayment(paymentInit.transactionRef);
  assert(verified.verified === true && verified.status === 'paid', 'Payment verification successful');

  console.log('\n====================================================');
  console.log(`📊 QA SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runQASuite().catch((err) => {
  console.error('Fatal QA error:', err);
  process.exit(1);
});
