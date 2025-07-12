# Firebase Configuration & Services

## 🔥 Firebase Project Details

**Project ID**: `vibestudio-online`  
**Project Status**: Active Development  
**Environment**: Test Mode (Production Migration Required)

## 📊 Firebase Services Configuration

### Firestore Database
- **Database ID**: `vs-db`
- **Mode**: Test Mode ⚠️
- **Location**: Multi-region
- **Status**: **REQUIRES PRODUCTION MIGRATION ASAP**

**Production Migration Required:**
- Update security rules for production
- Enable production mode
- Configure proper indexing
- Set up backup policies

### Firebase Storage
- **Bucket**: `gs://vibestudio-online.firebasestorage.app`
- **Mode**: Test Mode ⚠️
- **Status**: **REQUIRES PRODUCTION MIGRATION ASAP**

**Production Migration Required:**
- Update storage rules for production access
- Configure CORS policies
- Set up lifecycle management
- Enable audit logging

### Cloud SQL Integration
- **Instance ID**: `vibestudio`
- **Database Name**: `vs-db`
- **Service ID**: `vs-service`
- **Connection**: Via Firebase Connect

## ⚠️ Critical Production Tasks

### Immediate Actions Required:

1. **Firestore Production Migration**
   ```bash
   # Update Firestore to production mode
   firebase firestore:rules:deploy
   ```

2. **Storage Production Migration**
   ```bash
   # Deploy production storage rules
   firebase deploy --only storage
   ```

3. **Security Rules Update**
   - Update Firestore rules from test to production
   - Configure proper user authentication requirements
   - Set up role-based access control

4. **Backup & Recovery Setup**
   - Enable automatic Firestore backups
   - Configure Cloud SQL backup policies
   - Set up monitoring and alerting

## 🔐 Environment Variables

### Environment Configuration Example
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/

# Development Configuration
VITE_USE_FIREBASE_EMULATOR=false

# Database Configuration
VITE_FIRESTORE_DB_ID=your_firestore_db_id
VITE_FIREBASE_STORAGE_BUCKET_FULL=gs://your-project.firebasestorage.app
VITE_CLOUD_SQL_INSTANCE_ID=your_sql_instance
VITE_CLOUD_SQL_DATABASE_NAME=your_database_name
VITE_CLOUD_SQL_SERVICE_ID=your_service_id

# Production Migration Status
VITE_FIRESTORE_MODE=test
VITE_STORAGE_MODE=test
```

## 📋 Production Checklist

### Firebase Services
- [ ] **Firestore**: Migrate from test to production mode
- [ ] **Storage**: Update to production rules and policies
- [ ] **Authentication**: Configure production OAuth settings
- [ ] **Functions**: Deploy production-ready cloud functions
- [ ] **Hosting**: Set up custom domain and SSL

### Security & Compliance
- [ ] **Security Rules**: Production-grade Firestore rules
- [ ] **Storage Rules**: Secure file access policies
- [ ] **IAM Policies**: Role-based access control
- [ ] **Audit Logging**: Enable comprehensive logging
- [ ] **Data Encryption**: Verify encryption at rest and in transit

### Monitoring & Performance
- [ ] **Performance Monitoring**: Enable Firebase Performance
- [ ] **Error Tracking**: Set up Crashlytics
- [ ] **Analytics**: Configure Firebase Analytics
- [ ] **Alerts**: Set up monitoring alerts
- [ ] **Backup Verification**: Test backup and restore procedures

## 🚀 Deployment Commands

### Production Deployment
```bash
# Deploy all Firebase services
firebase deploy --project vibestudio-online

# Deploy specific services
firebase deploy --only firestore:rules --project vibestudio-online
firebase deploy --only storage --project vibestudio-online
firebase deploy --only functions --project vibestudio-online
firebase deploy --only hosting --project vibestudio-online
```

### Security Rules Deployment
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules  
firebase deploy --only storage

# Validate rules before deployment
firebase firestore:rules:validate
```

## 📞 Support & Resources

- **Firebase Console**: [https://console.firebase.google.com/project/vibestudio-online](https://console.firebase.google.com/project/vibestudio-online)
- **Cloud SQL Console**: [Google Cloud Console](https://console.cloud.google.com/sql/instances)
- **Documentation**: [Firebase Documentation](https://firebase.google.com/docs)
- **Support**: Firebase Support (Enterprise plan required)

---

⚠️ **CRITICAL**: Test mode databases are not suitable for production. Migration to production mode must be completed before launch.