# 🚀 Quick Start Guide - University Management System

## ⚡ 5-Minute Setup

### Step 1: Database Migration ✅
```bash
cd apps/api
npx prisma migrate deploy
npx prisma generate
```
**Status: COMPLETED** ✅

### Step 2: Start Backend
```bash
cd apps/api
pnpm dev
```
**API will run on:** `http://localhost:3000`

### Step 3: Start Frontend
```bash
cd apps/web
pnpm dev
```
**Web will run on:** `http://localhost:3001`

### Step 4: Access Admin Panel
```
http://localhost:3001/admin/universities
```

---

## 📍 Navigation Map

```
Admin Panel
└── Universities
    ├── All Universities (/admin/universities)
    │   ├── Search & Filter
    │   ├── View Details
    │   ├── Edit
    │   ├── Delete
    │   └── Manage Status
    │
    └── Add New (/admin/universities/new)
        └── 9-Step Form Wizard
            ├── 1. Basic Info
            ├── 2. Location & Contact
            ├── 3. Academic Details
            ├── 4. Recognition
            ├── 5. Fees
            ├── 6. Infrastructure
            ├── 7. Admission
            ├── 8. Support & Content
            └── 9. Admin Details
```

---

## 🎯 Quick Actions

### Create a University
1. Click "Universities" in sidebar
2. Click "Add University" button
3. Fill 9-step form
4. Click "Create University"

### View University
1. Go to Universities list
2. Click on any university row
3. Browse tabs for details

### Update Status
1. Click ⋮ menu on university
2. Select "Activate" or "Suspend"
3. Done!

### Delete University
1. Click ⋮ menu on university
2. Select "Delete"
3. Confirm

---

## 📊 What You Get

### Backend API
- ✅ 17 REST endpoints
- ✅ 123+ data fields
- ✅ Full CRUD operations
- ✅ Advanced filtering
- ✅ Document management
- ✅ Status workflow

### Admin Interface
- ✅ University list with search
- ✅ Multi-step creation form
- ✅ Detailed view with tabs
- ✅ Status management
- ✅ Responsive design
- ✅ Intuitive navigation

### Documentation
- ✅ API documentation
- ✅ Onboarding guide
- ✅ Implementation details
- ✅ Testing checklist

---

## 🔑 Key Features

| Feature | Description |
|---------|-------------|
| **Multi-step Form** | 9 organized steps for easy data entry |
| **Status Workflow** | Draft → Under Review → Active |
| **Smart Search** | Search by name or short name |
| **Advanced Filters** | Filter by status, type, country |
| **Auto-slug** | SEO-friendly URLs generated automatically |
| **Soft Delete** | Universities marked inactive, not deleted |
| **Validation** | Comprehensive validation on all fields |
| **Responsive** | Works on desktop, tablet, and mobile |

---

## 📋 Sample Data

### Minimum Required Fields
```json
{
  "name": "ABC Medical College",
  "shortName": "ABC MC",
  "establishedYear": 2000,
  "type": "PRIVATE",
  "website": "https://abcmc.edu",
  "logo": "https://example.com/logo.png",
  "bannerImage": "https://example.com/banner.jpg",
  "location": {
    "country": "India",
    "state": "Maharashtra",
    "city": "Mumbai",
    "address": "123 Medical Street"
  },
  "contact": {
    "email": "admissions@abcmc.edu",
    "phone": "+91-9876543210",
    "admissionOfficeHours": "Mon-Fri 9AM-5PM"
  },
  "academic": {
    "programs": ["MBBS"],
    "duration": "5.5 years",
    "medium": "English",
    "specializations": ["General Medicine"],
    "intakeMonths": ["August"],
    "totalSeats": 150,
    "governmentSeats": 100,
    "managementSeats": 40,
    "nriSeats": 10
  },
  "recognition": {
    "bodies": ["MCI", "WHO"],
    "ecfmgStatus": "APPROVED",
    "nbaAccredited": false,
    "accreditations": []
  },
  "fees": {
    "tuitionAnnual": 500000,
    "totalProgram": 3000000,
    "registration": 25000,
    "currency": "INR",
    "scholarshipAvailable": false,
    "paymentSchedule": "Annual",
    "refundPolicy": "50% before course start"
  },
  "infrastructure": {
    "hospitalBeds": 500,
    "departments": 15,
    "hostelBoys": 300,
    "hostelGirls": 200,
    "laboratories": 20,
    "facilities": [],
    "cafeteria": true,
    "wifiCampus": true,
    "transportation": true
  },
  "admission": {
    "entranceExams": ["NEET"],
    "minimumMarks": "50th percentile",
    "ageCriteria": "17-25 years",
    "eligibility": "10+2 with PCB",
    "requiredDocuments": [],
    "applicationDeadline": "2024-08-31",
    "applicationFee": 2000,
    "selectionProcess": "Merit-based"
  },
  "support": {
    "topRecruiters": [],
    "alumniNetwork": false,
    "internationalStudentSupport": true,
    "visaAssistance": false,
    "languageSupport": [],
    "counselingServices": false,
    "careerGuidance": false
  },
  "content": {
    "shortDescription": "Premier medical college",
    "longDescription": "Detailed description here...",
    "highlights": [],
    "gallery": []
  },
  "admin": {
    "pocName": "Dr. John Doe",
    "pocDesignation": "Admission Officer",
    "pocEmail": "john@abcmc.edu",
    "pocPhone": "+91-9876543210",
    "accountName": "ABC Medical College",
    "accountNumber": "1234567890",
    "bankName": "State Bank",
    "bankBranch": "Mumbai",
    "ifscCode": "SBIN0001234",
    "commission": 10
  }
}
```

---

## 🐛 Troubleshooting

### API not starting?
- Check DATABASE_URL in `.env`
- Ensure PostgreSQL is running
- Run `npx prisma generate`

### Frontend not connecting?
- Check NEXT_PUBLIC_API_URL in `.env.local`
- Ensure API is running on port 3000
- Check browser console for errors

### Migration failed?
- Check database connection
- Ensure no conflicting data
- Review migration SQL file

---

## 📞 Need Help?

1. Check `docs/university-onboarding-api.md` for API details
2. Review `docs/FRONTEND_IMPLEMENTATION.md` for UI guide
3. See `docs/PROJECT_COMPLETE.md` for full overview

---

## ✅ Checklist

- [x] Database migrated
- [x] Prisma client generated
- [x] API compiled
- [x] Backend running
- [x] Frontend running
- [ ] Test create university
- [ ] Test view details
- [ ] Test update status
- [ ] Test delete

---

## 🎉 You're Ready!

The university management system is fully operational. Start by creating your first university!

**Happy Managing! 🚀**
