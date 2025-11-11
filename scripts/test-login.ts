import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testLogin() {
  try {
    const email = 'Benjyamp@gmail.com'
    const password = 'MicroAI2025!'
    
    console.log(`\n🔐 SIMULATING CLIENT LOGIN\n`)
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}\n`)
    
    // Step 1: Find user (with lowercase conversion like the API does)
    console.log('Step 1: Finding user...')
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
    })
    
    if (!user) {
      console.log('❌ FAIL: User not found')
      return
    }
    console.log(`✅ User found: ${user.name}`)
    
    // Step 2: Check role
    console.log('\nStep 2: Checking role...')
    if (user.role.toUpperCase() !== 'CLIENT') {
      console.log(`❌ FAIL: User role is ${user.role}, not CLIENT`)
      return
    }
    console.log(`✅ Role is: ${user.role}`)
    
    // Step 3: Check if active
    console.log('\nStep 3: Checking if active...')
    if (!user.isActive) {
      console.log('❌ FAIL: Account is not active')
      return
    }
    console.log('✅ Account is active')
    
    // Step 4: Check if locked
    console.log('\nStep 4: Checking if locked...')
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      console.log(`❌ FAIL: Account is locked until ${user.lockedUntil}`)
      return
    }
    console.log('✅ Account is not locked')
    
    // Step 5: Check if expired
    console.log('\nStep 5: Checking if expired...')
    if (user.accessExpiresAt && user.accessExpiresAt < new Date() && !user.isVerified) {
      console.log(`❌ FAIL: Account expired on ${user.accessExpiresAt}`)
      return
    }
    console.log('✅ Account has not expired')
    
    // Step 6: Check verification status
    console.log('\nStep 6: Checking verification...')
    if (!user.isVerified) {
      console.log('⚠️  WARNING: Account is not verified (but can still login)')
    } else {
      console.log('✅ Account is verified')
    }
    
    // Step 7: Verify password
    console.log('\nStep 7: Verifying password...')
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      console.log('❌ FAIL: Password is incorrect')
      console.log(`   Login attempts: ${user.loginAttempts || 0}`)
      return
    }
    console.log('✅ Password is correct!')
    
    // SUCCESS
    console.log('\n' + '='.repeat(60))
    console.log('✅ LOGIN WOULD SUCCEED!')
    console.log('='.repeat(60))
    console.log('\n📊 User Info:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Verified: ${user.isVerified}`)
    console.log(`   Must Change Password: ${user.mustChangePassword}`)
    console.log(`   Client ID: ${user.client?.id}`)
    console.log(`   Client Name: ${user.client?.name}`)
    
    console.log('\n🌐 Try logging in at:')
    console.log('   https://microai-kz7f.onrender.com/client/login')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}\n`)
    
  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()
