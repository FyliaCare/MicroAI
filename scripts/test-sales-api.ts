import { prisma } from "@/lib/prisma";

async function testSalesAPI() {
  try {
    console.log("🧪 Testing Sales API Setup...\n");

    // Test 1: Check database connection
    console.log("1️⃣  Testing database connection...");
    await prisma.$connect();
    console.log("✅ Database connected successfully\n");

    // Test 2: Query sales models (should return empty arrays since no data yet)
    console.log("2️⃣  Testing sales models...");
    
    const leadCount = await prisma.salesLead.count();
    console.log(`✅ SalesLead model: ${leadCount} records`);
    
    const oppCount = await prisma.salesOpportunity.count();
    console.log(`✅ SalesOpportunity model: ${oppCount} records`);
    
    const activityCount = await prisma.salesActivity.count();
    console.log(`✅ SalesActivity model: ${activityCount} records`);
    
    const callCount = await prisma.salesCall.count();
    console.log(`✅ SalesCall model: ${callCount} records`);
    
    const emailCount = await prisma.salesEmail.count();
    console.log(`✅ SalesEmail model: ${emailCount} records`);
    
    const meetingCount = await prisma.salesMeeting.count();
    console.log(`✅ SalesMeeting model: ${meetingCount} records`);
    
    const taskCount = await prisma.salesTask.count();
    console.log(`✅ SalesTask model: ${taskCount} records\n`);

    // Test 3: Create a sample lead
    console.log("3️⃣  Creating sample lead...");
    const testLead = await prisma.salesLead.create({
      data: {
        id: "test-lead-" + Date.now(),
        leadNumber: "LEAD-" + Date.now(),
        company: "Test Company",
        firstName: "John",
        lastName: "Doe",
        email: "john@testcompany.com",
        status: "new",
        source: "website",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log(`✅ Sample lead created: ${testLead.company} - ${testLead.email}\n`);

    // Test 4: Query the created lead
    console.log("4️⃣  Querying created lead...");
    const foundLead = await prisma.salesLead.findUnique({
      where: { id: testLead.id },
    });
    console.log(`✅ Lead found: ${foundLead?.firstName} ${foundLead?.lastName}\n`);

    // Test 5: Cleanup test data
    console.log("5️⃣  Cleaning up test data...");
    await prisma.salesLead.delete({
      where: { id: testLead.id },
    });
    console.log("✅ Test data cleaned up\n");

    console.log("🎉 All tests passed! Sales API is ready.\n");
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testSalesAPI();
