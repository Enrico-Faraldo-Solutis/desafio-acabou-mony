# 🔧 Frontend-Backend Connection Fix Guide

## 📋 Summary of Changes Made

I've fixed the connection issues between your frontend and backend services. Here's what was changed:

### ✅ Changes Applied

1. **Frontend Configuration Updated** (`acabou-mony-frontend/src/utils/constants.js`)
   - Changed API URLs to use the API Gateway on port **8083**
   - Updated service routes to use `/api/{service}` prefix
   - Old: `http://localhost:8001`, `8002`, `8003`
   - New: `http://localhost:8083/api/auth`, `/api/accounts`, `/api/transactions`

2. **CORS Configuration Added to All Services**
   - ✅ API Gateway: `desafio-acabou-mony/acabou-mony-gateway/src/main/java/com/exemplo/gateway/config/CorsConfig.java`
   - ✅ Auth Service: `desafio-acabou-mony/acabou-mony-auth/src/main/java/com/example/acabou_mony_auth/config/CorsConfig.java`
   - ✅ Account Service: Updated `SecurityConfig.java` with CORS
   - ✅ Transaction Service: Updated `SecurityConfig.java` with CORS

All CORS configurations allow:
- Origins: `http://localhost:3000`, `http://localhost:5173`, `http://localhost:5174`, `http://localhost:8083`
- Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Headers: All headers allowed
- Credentials: Enabled

---

## 🚀 Steps to Apply the Fix

### Step 1: Rebuild and Restart Backend Services

```powershell
# Navigate to backend directory
cd desafio-acabou-mony

# Stop all services
docker-compose down

# Rebuild all services with the new CORS configurations
docker-compose up -d --build

# Wait for services to be ready (30-60 seconds)
# Check status
docker-compose ps
```

**Expected Output:**
```
NAME                          STATUS
acabou-mony-account           Up
acabou-mony-auditing          Up
acabou-mony-auth              Up
acabou-mony-gateway           Up
acabou-mony-notificacao       Up
acabou-mony-transaction       Up
db_acabou_mony                Up (healthy)
nginx                         Up
rabbitmq                      Up (healthy)
```

### Step 2: Verify Backend Services

Check that all services are accessible:

```powershell
# Test API Gateway
curl http://localhost:8083/api/teste

# Test Auth Service (through gateway)
curl http://localhost:8083/api/auth/login

# Or open in browser:
# http://localhost:8091/swagger-ui.html (Auth Service direct)
# http://localhost:8082/swagger-ui.html (Account Service direct)
# http://localhost:8084/swagger-ui.html (Transaction Service direct)
```

### Step 3: Update Frontend Environment (Optional)

If you want to customize the API Gateway URL, create or update `.env` file in `acabou-mony-frontend/`:

```env
VITE_API_GATEWAY_URL=http://localhost:8083
```

**Note:** The `.env` file is protected for security reasons, so you'll need to manually create/edit it if needed.

### Step 4: Restart Frontend

```powershell
# Navigate to frontend directory
cd acabou-mony-frontend

# Stop current dev server (Ctrl+C if running)

# Clear any cached builds (optional but recommended)
Remove-Item -Recurse -Force .vite

# Start development server
npm run dev
```

The frontend should now open at `http://localhost:5173` (or `http://localhost:3000`)

---

## 🧪 Testing the Connection

### Test 1: Register a New User

1. Navigate to `http://localhost:5173/register` (or your frontend URL)
2. Fill in the registration form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click **Sign Up**

**Expected Result:** 
- No "ERR_CONNECTION_REFUSED" error
- No "No response from server" error
- You should see a success message or be redirected

### Test 2: Check Browser Console

Open browser DevTools (F12) and check the Console tab:

**Before Fix:**
```
POST http://localhost:8001/auth/register net::ERR_CONNECTION_REFUSED
```

**After Fix:**
```
POST http://localhost:8083/api/auth/register 200 OK
```

### Test 3: Check Network Tab

In DevTools, go to Network tab and look for the API calls:

- URL should be: `http://localhost:8083/api/auth/...`
- Status should be: `200 OK` (or `201 Created` for registration)
- Response should contain data (not empty)

---

## 🔍 Troubleshooting

### Issue 1: Still Getting "ERR_CONNECTION_REFUSED"

**Possible Causes:**
1. Backend services not running
2. Frontend not restarted after changes
3. Browser cache

**Solutions:**
```powershell
# Check if services are running
cd desafio-acabou-mony
docker-compose ps

# If not all "Up", restart
docker-compose down
docker-compose up -d --build

# Clear browser cache and hard reload (Ctrl+Shift+R)

# Restart frontend
cd acabou-mony-frontend
npm run dev
```

### Issue 2: CORS Errors in Console

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:8083/api/auth/register' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**
1. Verify CORS configuration was applied:
   ```powershell
   # Check if services were rebuilt
   docker-compose logs acabou-mony-gateway | Select-String -Pattern "CorsConfig"
   ```

2. Ensure you rebuilt the services:
   ```powershell
   docker-compose down
   docker-compose up -d --build
   ```

3. Check if your frontend is running on a different port:
   - If running on port 3000, 5173, or 5174, it should work
   - If using a different port, you need to add it to CORS configurations

### Issue 3: 404 Not Found

**Error Message:**
```
POST http://localhost:8083/api/auth/register 404 Not Found
```

**Possible Causes:**
1. Gateway routing not working
2. Auth service not accessible from gateway

**Solutions:**
```powershell
# Check gateway logs
docker-compose logs acabou-mony-gateway

# Check auth service logs
docker-compose logs acabou-mony-auth

# Test direct connection to auth service
curl http://localhost:8091/api/auth/login
```

### Issue 4: Frontend Shows Old Configuration

**Solutions:**
```powershell
# Clear Vite cache
cd acabou-mony-frontend
Remove-Item -Recurse -Force .vite
Remove-Item -Recurse -Force node_modules/.vite

# Restart dev server
npm run dev
```

### Issue 5: Docker Services Won't Start

**Solutions:**
```powershell
# Check logs for specific service
docker-compose logs acabou-mony-auth

# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose up -d --build

# If MySQL fails, check if port 3307 is available
Get-NetTCPConnection -LocalPort 3307
```

---

## 📊 Architecture Overview

```
Frontend (localhost:5173)
    ↓
    ↓ HTTP Requests
    ↓
API Gateway (localhost:8083)
    ↓
    ├─→ /api/auth → Auth Service (localhost:8091)
    ├─→ /api/accounts → Account Service (localhost:8082)
    └─→ /api/transactions → Transaction Service (localhost:8084)
```

### Port Mapping

| Service | Internal Port | External Port | Frontend Access |
|---------|--------------|---------------|-----------------|
| API Gateway | 8088 | 8083 | ✅ Primary |
| Auth Service | 8081 | 8091 | ⚠️ Direct (not recommended) |
| Account Service | 8082 | 8082 | ⚠️ Direct (not recommended) |
| Transaction Service | 8084 | 8084 | ⚠️ Direct (not recommended) |
| MySQL | 3306 | 3307 | ❌ Backend only |
| RabbitMQ | 5672 | 5672 | ❌ Backend only |
| RabbitMQ UI | 15672 | 15672 | ✅ Admin only |
| NGINX | 80 | 80 | ✅ Production |

---

## 🎯 Best Practices

### ✅ DO:
- Always use the API Gateway (`http://localhost:8083`) for frontend requests
- Use environment variables for API URLs
- Check docker-compose logs when debugging
- Test with browser DevTools Network tab open

### ❌ DON'T:
- Don't connect directly to individual services from frontend
- Don't hardcode API URLs in components
- Don't forget to rebuild Docker services after config changes
- Don't commit `.env` files with sensitive data

---

## 🔐 Security Notes

1. **CORS Configuration**: Currently allows `localhost` origins for development
   - For production, update CORS to allow only your production domain
   - Remove `localhost` origins in production builds

2. **JWT Tokens**: Stored in localStorage
   - Consider using httpOnly cookies for production
   - Implement token refresh mechanism

3. **API Gateway**: Acts as single entry point
   - Add rate limiting for production
   - Implement request logging and monitoring

---

## 📚 Additional Resources

- **Frontend Spec**: See `FRONTEND_SPEC.md` for detailed frontend documentation
- **Quick Start**: See `START_FRONTEND.md` for quick setup guide
- **Docker Compose**: See `docker-compose.yml` for service configuration
- **API Documentation**: Access Swagger UI at `http://localhost:8091/swagger-ui.html`

---

## ✅ Success Checklist

After applying all fixes, verify:

- [ ] Backend services running (`docker-compose ps` shows all "Up")
- [ ] Frontend dev server running (`npm run dev` successful)
- [ ] No CORS errors in browser console
- [ ] Can access `http://localhost:8083/api/teste` (returns "Gateway funcionando!")
- [ ] Can register new user without connection errors
- [ ] Can login successfully
- [ ] Can create transactions
- [ ] Dashboard loads and shows data

---

## 🎉 You're All Set!

Your frontend should now successfully communicate with the backend services through the API Gateway!

If you encounter any issues not covered in this guide, check:
1. Docker logs: `docker-compose logs [service-name]`
2. Browser console (F12)
3. Network tab in DevTools
4. Backend Swagger documentation

---

**Last Updated**: 2024
**Version**: 1.0.0
</contents>"