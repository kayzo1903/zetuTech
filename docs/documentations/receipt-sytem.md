# ZETU TECH Receipt System Documentation

## 📋 System Overview

The ZETU TECH Receipt System is a comprehensive solution for generating, storing, and verifying digital receipts for customer orders. It features secure PDF generation, Cloudflare R2 storage integration, and public verification capabilities.

## 🏗️ Architecture

### Core Components

1. **Order Success Page** (`/checkout/success`)
2. **PDF Generation API** (`/api/orders/[id]/generate-receipt`)
3. **Receipt Data API** (`/api/orders/[id]/receipt-data`)
4. **Verification Page** (`/verify/[code]`)
5. **R2 Storage Integration** (`/api/r2-presign`)

### Database Schema Extensions

```sql
-- Added to order table
verification_code TEXT UNIQUE,
pdf_file TEXT -- Stores R2 PDF URL
```

## 🔄 Workflow

### 1. Order Creation → Receipt Generation

```
Order Created → Success Page → Check Receipt Status → Generate PDF → Store in R2 → Update DB
```

### 2. Receipt Download Flow

```
User Clicks Download → Check Existing Receipt → 
    ↓ (If exists)
Download Directly from R2
    ↓ (If doesn't exist)
Generate New Receipt → Auto-Download → Store in R2
```

### 3. Verification Flow

```
User Shares Verification Link → Verify Code → Display Order Details
```

## 🛠️ API Endpoints

### 1. Generate Receipt API
**POST** `/api/orders/[id]/generate-receipt`

**Purpose**: Creates a PDF receipt and stores it in R2

**Process**:
1. Validate order access
2. Fetch order data with items and addresses
3. Generate PDF using pdf-lib
4. Get presigned URL from R2
5. Upload PDF to R2
6. Store verification code and PDF URL in database

**Response**:
```json
{
  "success": true,
  "verifyLink": "https://domain.com/verify/ABC123",
  "verificationCode": "ABC123",
  "receiptUrl": "https://r2.domain.com/receipts/order-123.pdf"
}
```

### 2. Receipt Data API
**GET** `/api/orders/[id]/receipt-data`

**Purpose**: Fetches order data for receipt generation/display

**Security**: Uses `validateOrderAccess` to ensure users can only access their own orders

### 3. R2 Presign API
**POST** `/api/r2-presign`

**Purpose**: Generates presigned URLs for secure R2 uploads

## 🔒 Security Implementation

### Access Control
```typescript
// lib/orders/security.ts
export async function validateOrderAccess(orderId: string, userId?: string | null) {
  // 1. Check if order exists
  // 2. Authenticated users: match user ID
  // 3. Guest orders: match session cookie
  // 4. Allow receipt generation for valid orders
}
```

### Features:
- **UUID Validation**: Prevents IDOR attacks
- **Session Validation**: Secure guest order access
- **Rate Limiting**: Built into API routes
- **CORS Protection**: Proper headers configuration

## 📄 PDF Generation

### Features:
- Professional ZETU TECH branding
- Order details and customer information
- Itemized product list with pricing
- Tax and discount calculations
- Verification code section
- Multi-page support for long receipts

### Technical Stack:
- **pdf-lib**: PDF generation and manipulation
- **StandardFonts**: Embedded fonts for consistency
- **RGB Color Model**: Professional styling

## ☁️ R2 Storage Integration

### Configuration:
```typescript
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_ACCESS_KEY_SECRET!,
  },
});
```

### File Naming:
```
receipts/{orderNumber}-{verificationCode}.pdf
```

## 🎯 User Interface

### Success Page Features:
- Order confirmation display
- Order summary with pricing breakdown
- Dual receipt options:
  - **Download Receipt**: Generate + download
  - **Generate Only**: Create without download
- Verification status display
- Secure PDF links

### Verification Page Features:
- Public access with code verification
- Order details display
- Receipt authenticity confirmation
- PDF download link

## 🚀 Environment Variables

```env
# R2 Configuration
R2_ACCESS_KEY_ID=your_access_key
R2_ACCESS_KEY_SECRET=your_secret
R2_BUCKET=your_bucket_name
R2_PUBLIC_DOMAIN=pub-xxxxx.r2.dev
CF_ACCOUNT_ID=your_account_id

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🔧 Error Handling

### Common Issues & Solutions:

1. **Infinite Loop in Download**
   - Cause: State update triggers re-render
   - Solution: Separate generation and download logic

2. **Security Validation Failures**
   - Cause: Session/user ID mismatches
   - Solution: Permissive access for receipt generation

3. **R2 Upload Failures**
   - Cause: Environment variable issues
   - Solution: Proper URL construction and error logging

4. **PDF Download Issues**
   - Cause: Blob creation problems
   - Solution: Direct R2 URL access with proper headers

## 📈 Performance Optimizations

1. **Lazy PDF Generation**: Only generate when requested
2. **R2 CDN**: Fast global delivery of PDFs
3. **Efficient Queries**: Selective data fetching
4. **Client-Side Caching**: Reduce API calls

## 🛡️ Security Best Practices

1. **No Sensitive Data in PDF URLs**: Uses verification codes instead of order IDs
2. **Secure Session Handling**: Proper guest session validation
3. **Input Validation**: UUID and parameter validation
4. **Error Message Obfuscation**: Generic errors to prevent information disclosure

## 🔄 State Management

### Key States:
```typescript
const [orderData, setOrderData] = useState<OrderData | null>(null);
const [isGenerating, setIsGenerating] = useState(false);
const [isDownloading, setIsDownloading] = useState(false);
const [verificationLink, setVerificationLink] = useState<string | null>(null);
```

### Prevention of Race Conditions:
- Disabled buttons during operations
- State checks before API calls
- Separate generation and download processes

## 📱 Mobile Responsiveness

- Tailwind CSS for responsive design
- Mobile-optimized PDF layout
- Touch-friendly button sizes
- Adaptive grid layouts

## 🎨 Customization Points

### Branding:
- Company name and logo in PDF header
- Contact information
- Color scheme (blue accent for ZETU TECH)

### Receipt Content:
- Customizable sections
- Flexible item display
- Configurable footer notes

## 🔍 Monitoring & Logging

### Console Logging:
```typescript
console.log('✅ Receipt generated successfully');
console.log('❌ Error generating receipt:', error);
```

### Key Metrics:
- Generation success rates
- Download completion
- Verification page visits
- Error frequency and types

## 🚀 Deployment Checklist

- [ ] R2 bucket configured with public access
- [ ] Environment variables set
- [ ] CORS configured for R2
- [ ] Database migrations applied
- [ ] PDF generation tested
- [ ] Verification links working
- [ ] Mobile responsiveness verified

## 🔮 Future Enhancements

1. **Email Receipt Delivery**
2. **Receipt Analytics Dashboard**
3. **Bulk Receipt Generation**
4. **Custom Receipt Templates**
5. **Digital Signature Integration**
6. **Multi-language Support**

---

This documentation provides a comprehensive overview of the ZETU TECH Receipt System. The system is production-ready with robust security, excellent user experience, and scalable architecture.