#!/bin/bash

# DocLink System Validation Script
# This script checks if all systems are ready

echo "🔍 DocLink System Validation"
echo "=============================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
else
    echo "❌ .env.local file missing"
    exit 1
fi

# Check if Firebase config is present
if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY" .env.local; then
    echo "✅ Firebase configuration found"
else
    echo "❌ Firebase configuration missing"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed. Run: npm install"
    exit 1
fi

# Check for vulnerabilities
echo ""
echo "🔒 Checking for security vulnerabilities..."
npm audit --json > /tmp/audit.json 2>/dev/null
VULNERABILITIES=$(node -e "console.log(require('/tmp/audit.json').metadata.vulnerabilities.total || 0)")

if [ "$VULNERABILITIES" = "0" ]; then
    echo "✅ No vulnerabilities found"
else
    echo "⚠️  $VULNERABILITIES vulnerabilities found. Run: npm audit fix"
fi

# Check if server is running
echo ""
echo "🌐 Checking development server..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Development server running on port 3001"
elif lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Development server running on port 3000"
else
    echo "⚠️  Development server not running. Start with: npm run dev"
fi

echo ""
echo "📊 Summary"
echo "=========="
echo ""
echo "Next Steps:"
echo "1. Update Firestore rules in Firebase Console"
echo "2. Visit: https://console.firebase.google.com/project/doclinkjipmer/firestore/rules"
echo "3. Set rules to allow all (development mode)"
echo "4. Test login at: http://localhost:3001/login"
echo "   - Admin: admin@doclink.in / 12345678"
echo ""
echo "📖 Full documentation: COMPLETE_SYSTEM_CHECK.md"
echo ""
