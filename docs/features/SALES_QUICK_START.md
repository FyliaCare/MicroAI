# Sales Activity System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Update Database Schema

```bash
# Generate Prisma client with new sales models
npx prisma generate

# Push schema changes to database
npx prisma db push
```

### Step 2: Verify Installation

The system is now installed! Access it at:

```
http://localhost:3000/admin/sales
```

### Step 3: Create Your First Lead

1. Navigate to **Sales Dashboard** → **Add New Lead**
2. Fill in lead details:
   - Name, Email, Phone
   - Company and Job Title
   - Lead Source (website, referral, etc.)
   - Estimated Value
3. Click **Create Lead**

The system automatically:
- Generates a unique lead number
- Calculates lead score (0-100)
- Creates activity log entry
- Assigns default status

### Step 4: Track Activities

Log activities against your lead:

**Log a Call:**
```
Sales → Calls → New Call
- Select lead
- Set call type (inbound/outbound)
- Record outcome
- Add notes
```

**Send an Email:**
```
Sales → Emails → New Email
- Select template (optional)
- Choose lead
- Track opens/clicks automatically
```

**Schedule Meeting:**
```
Sales → Meetings → New Meeting
- Set date/time
- Add attendees
- Create agenda
```

### Step 5: Convert to Opportunity

When lead is qualified:
1. Open lead details
2. Click **Convert to Opportunity**
3. Set deal value and probability
4. Choose pipeline stage
5. Add expected close date

## 📊 Key Features Overview

### Lead Management
- ✅ Automatic lead scoring
- ✅ Source tracking
- ✅ Status progression
- ✅ Activity timeline
- ✅ Contact history

### Pipeline Management
- ✅ Drag-and-drop stages
- ✅ Visual pipeline board
- ✅ Stage-based values
- ✅ Probability weighting
- ✅ Win/loss tracking

### Analytics
- ✅ Revenue forecasting
- ✅ Conversion funnel
- ✅ Team performance
- ✅ Activity metrics
- ✅ Custom reports

### Sales Tools
- ✅ Email templates
- ✅ Call scripts
- ✅ Sales playbooks
- ✅ Automations
- ✅ Competitor tracking

## 🎯 Common Workflows

### New Lead Workflow
```
1. Lead Created (website/import/manual)
2. Auto-assign to sales rep
3. Rep contacts within 24 hours
4. Log call/email
5. Qualify or disqualify
6. Convert to opportunity (if qualified)
```

### Opportunity Workflow
```
1. Opportunity created from lead
2. Discovery call scheduled
3. Demo/presentation
4. Proposal sent
5. Negotiation
6. Contract sent
7. Won/Lost
```

### Daily Sales Routine
```
Morning:
- Check dashboard for metrics
- Review upcoming tasks
- Prioritize follow-ups

During Day:
- Log all activities immediately
- Update lead/opportunity statuses
- Set next follow-up dates

End of Day:
- Complete pending tasks
- Plan tomorrow's activities
- Update forecasts
```

## 🔥 Pro Tips

### Lead Scoring
Leads score higher with:
- Complete contact information (+20)
- Company info provided (+15)
- High estimated value (+20)
- Decision-maker status (+25)
- Immediate timeline (+20)

### Pipeline Management
- Update probabilities weekly
- Move stalled deals to "lost"
- Add detailed notes on objections
- Track competitor mentions
- Set realistic close dates

### Activity Tracking
- Log activities immediately
- Always set next follow-up
- Use templates for consistency
- Track outcomes (won/lost/pending)
- Add detailed notes

### Team Performance
- Set weekly activity targets
- Review metrics in team meetings
- Share successful approaches
- Celebrate wins publicly
- Coach struggling reps

## 📈 Key Metrics to Track

### Daily Metrics
- New leads created
- Activities logged
- Calls made
- Emails sent
- Meetings held

### Weekly Metrics
- Lead conversion rate
- Opportunities created
- Pipeline value
- Win rate
- Average deal size

### Monthly Metrics
- Revenue (closed-won)
- Forecast accuracy
- Sales cycle length
- Team quota attainment
- Activity per rep

## 🛠️ Customization

### Add Custom Fields
Edit lead/opportunity models in:
```
prisma/schema.prisma
```

### Create Email Template
```
Sales Tools → Email Templates → New Template
- Name: "Follow-up - Demo"
- Category: "follow-up"
- Subject: "Great meeting today"
- Body: Use variables like {{firstName}}
```

### Build Call Script
```
Sales Tools → Call Scripts → New Script
- Type: "cold-call"
- Sections: Intro, Questions, Objections, Close
- Add talking points
- Track success rate
```

### Setup Automation
```
Sales Tools → Automations → New Automation
- Trigger: "Lead Created"
- Condition: "Source = website"
- Action: "Create follow-up task"
```

## 🎨 Dashboard Views

### Sales Dashboard (`/admin/sales`)
- KPI cards (8 metrics)
- Pipeline visualization
- Activity feed
- Team leaderboard
- Quick actions

### Leads Page (`/admin/sales/leads`)
- Searchable lead list
- Status/source filters
- Lead scoring visualization
- Bulk actions

### Pipeline Board (`/admin/sales/pipeline`)
- Kanban-style board
- Drag-and-drop stages
- Deal cards with key info
- Stage metrics

### Analytics (`/admin/sales/analytics`)
- Revenue forecast
- Conversion funnel
- Activity metrics
- Team performance

## 🔐 Security & Permissions

### Role-Based Access
- **Sales Admin**: Full access
- **Sales Manager**: Team view
- **Sales Rep**: Own leads only

### Data Privacy
- Client information encrypted
- Activity logs audited
- GDPR compliant
- Secure API endpoints

## 📱 Mobile Access

All features work on mobile:
- Responsive design
- Touch-friendly interface
- Quick activity logging
- Push notifications

## 🆘 Troubleshooting

### Lead not showing?
- Check status filter
- Verify assignment
- Search by name/email

### Activity not logging?
- Ensure lead/opportunity selected
- Check required fields
- Verify date format

### Pipeline not updating?
- Refresh browser
- Check internet connection
- Verify write permissions

### Analytics empty?
- Check date range
- Create some test data
- Verify database connection

## 📚 Additional Resources

- Full Documentation: `/docs/features/SALES_ACTIVITY_SYSTEM.md`
- API Reference: See API endpoints section
- Video Tutorials: Coming soon
- Support: Contact system admin

## 🎓 Training Checklist

- [ ] Create first lead
- [ ] Log a call
- [ ] Send an email
- [ ] Schedule a meeting
- [ ] Convert lead to opportunity
- [ ] Move deal through pipeline
- [ ] Close a won deal
- [ ] View analytics dashboard
- [ ] Create email template
- [ ] Setup automation
- [ ] Review team performance
- [ ] Generate custom report

## 🚀 Next Steps

1. **Customize** - Add your email templates and call scripts
2. **Import** - Bulk import existing leads
3. **Integrate** - Connect email and calendar
4. **Automate** - Setup workflows
5. **Train** - Onboard your team
6. **Optimize** - Review metrics weekly

## 💡 Success Tips

### Week 1
- Focus on logging activities
- Learn the interface
- Setup personal templates
- Review metrics daily

### Month 1
- Optimize workflows
- Share best practices
- Build automation rules
- Achieve data consistency

### Quarter 1
- Full team adoption
- Accurate forecasting
- Process optimization
- ROI realization

---

**Need Help?**
- Check documentation
- Review video tutorials
- Contact support team
- Join user community

**Built with ❤️ by MicroAI Systems**
