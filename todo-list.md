
  ## Sprint 1 To-Do List 

 # Project Setup – Justina 
- [ ] Create and share GitHub repo w
- [ ] Set up Firebase project (Authentication + Firestore + Hosting)
- [ ] Write and share Firestore schema doc 
- [ ] Create README 
  - [ ] Organize weekly team check-in meetings

##  Authentication (Samuel)
- [ ] Set up Firebase **Email/Password Authentication**
- [ ] Create login and signup pages
- [ ] Implement **role assignment**: landlord, tenant
- [ ] On login, **redirect user** to appropriate dashboard based on role
- [ ] Store role and user data in users collection in Firestore

# Property & Unit Management (Ian )
- [ ] Create **Add Property** form
- [ ] Create **Add Unit** form (linked to property)
- [ ] Display list of properties + nested units in landlord dashboard
- [ ] Connect forms to Firestore:
  - properties collection
  - units collection

# Tenant & Lease Management (Ian)
- [ ] Create **Add Tenant** form (name, contact, email)
- [ ] Create **Add Lease** form with:
  - Rent amount
  - Frequency (e.g. monthly)
  - Due date
  - Start & End date
- [ ] Link lease to:
  - Unit
  - Tenant
  - Landlord
- [ ] Store lease in leases collection in supabase

#  Dashboard UI (Dev 4)
- [ ] Set up **Routing** (React Router or Vue Router)
- [ ] Draft **Landlord Dashboard** with:
  - [ ] List of properties/units
  - [ ] Add Property/Unit/Tenant/Lease buttons
- [ ] Prepare placeholder **Tenant Dashboard**
- [ ] Create simple **Navbar & Sidebar**
- [ ] Ensure **mobile responsiveness**

# Integration & Testing (Dev 5)
- [ ] Help integrate Property → Unit → Tenant → Lease flow
- [ ] Test form submission and Firestore writes
- [ ] Validate required fields, add input validation
- [ ] Check real-time updates using Firestore listeners
- [ ] Assist with mobile-friendly layout polishing


#  End of Sprint 1 Deliverables (Due Week 2)
- [ ] Firebase Auth + Firestore fully set up
- [ ] Landlord can:
  - [ ] Add Property
  - [ ] Add Unit under Property
  - [ ] Add Tenant
  - [ ] Create Lease linked to Unit & Tenant
- [ ] Role-based dashboard access working
- [ ] Landlord dashboard UI is functional
- [ ] Firestore schema and collections are created
- [ ] Repo is organized and updated on GitHub
