# Bitespeed Identity Reconciliation Backend

A Node.js + Express + MongoDB API that reconciles user identities by linking contacts based on shared email or phone number.

---

## 🔗 Live Endpoint

> **POST** `https://bitespeed-ne4q.onrender.com/identify`

- Accepts: `application/json`
- ❌ Do NOT use `form-data`
- ✅ Use raw JSON in the request body

---

## 📥 Sample Request (JSON)

```json
{
  "email": "sam@example.com",
  "phoneNumber": "1234567890"
}"


Sample Response


{
  "contact": {
    "primaryContactId": "68551c443f672166d059f63f",
    "emails": ["sam@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": []
  }
}


Tech Stack
Node.js + Express

MongoDB Atlas (NoSQL DB)

Mongoose (ODM)

Render (Free Hosting)
