import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📄 RiderGuy Quote Summary\n');
  console.log('═'.repeat(60));
  
  const quote = await prisma.quote.findFirst({
    where: {
      quoteNumber: 'QT-202511-157',
      clientName: 'Ebenezer Darko'
    }
  });

  if (!quote) {
    console.log('❌ Quote not found');
    return;
  }

  console.log('\n✅ Quote Created Successfully!\n');
  console.log(`Quote Number: ${quote.quoteNumber}`);
  console.log(`Quote ID: ${quote.id}`);
  console.log(`Title: ${quote.title}`);
  console.log(`Status: ${quote.status}`);
  console.log(`\nClient Information:`);
  console.log(`  Name: ${quote.clientName}`);
  console.log(`  Company: ${quote.clientCompany}`);
  console.log(`  Email: ${quote.clientEmail}`);
  console.log(`  Phone: ${quote.clientPhone}`);
  
  console.log(`\nFinancial Details:`);
  console.log(`  Subtotal: $${quote.subtotal?.toLocaleString() || '0'}`);
  console.log(`  Tax: $${quote.tax?.toLocaleString() || '0'}`);
  console.log(`  Discount: $${quote.discount?.toLocaleString() || '0'}`);
  console.log(`  Total: $${quote.total?.toLocaleString() || '0'}`);
  
  console.log(`\nPayment Terms:`);
  console.log(`  ${quote.paymentTerms || 'Not specified'}`);
  
  console.log(`\nProject Details:`);
  console.log(`  Timeline: ${quote.timeline || 'Not specified'}`);
  console.log(`  Estimated Hours: ${quote.estimatedHours || 'Not specified'}`);
  console.log(`  Project Type: ${quote.projectType || 'Not specified'}`);
  
  console.log(`\nValidity:`);
  console.log(`  Valid Until: ${quote.validUntil?.toLocaleDateString() || 'Not specified'}`);
  console.log(`  Created: ${quote.createdAt.toLocaleDateString()}`);

  // Parse and display line items
  if (quote.items) {
    try {
      const items = JSON.parse(quote.items as string);
      console.log(`\n📦 Line Items (${items.length}):\n`);
      items.forEach((item: any, index: number) => {
        console.log(`${index + 1}. ${item.description}`);
        console.log(`   ${item.details}`);
        console.log(`   $${item.unitPrice.toLocaleString()} × ${item.quantity} = $${(item.unitPrice * item.quantity).toLocaleString()}`);
        console.log(`   Category: ${item.category}\n`);
      });
    } catch (e) {
      console.log('   Unable to parse line items');
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('\n📝 To Generate PDF:\n');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Log in to admin portal: http://localhost:3000/admin/login');
  console.log('3. Navigate to: http://localhost:3000/admin/quotes');
  console.log(`4. Find quote #${quote.quoteNumber} and click "Download PDF"\n`);
  console.log('OR use the admin portal UI to generate and download the PDF.\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
