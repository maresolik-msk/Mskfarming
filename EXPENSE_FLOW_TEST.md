# ✅ Add Expense Flow - Testing Guide

## How to Test the Add Expense Feature

### **Step-by-Step Test**

1. **Access the Prototype**
   - Go to homepage and click "Try Working Prototype"
   - OR add `?prototype=true` to URL
   - Login with: `9876543210` + any 6-digit OTP

2. **Navigate to Dashboard**
   - Complete onboarding (or skip to dashboard)
   - You'll see the main dashboard

3. **Check Initial Budget**
   - Look at "This Season" section
   - Initial: ₹5,500 / ₹18,000 (31% used)
   - Note the budget bar color (should be green/primary)

4. **Add Your First Expense**
   - Click "Add Expense" in Quick Actions
   - Modal opens with expense form

### **Test Scenario 1: Manual Entry**

**Steps:**
1. Select Category: Click "Fertilizer" 🧪
2. Enter Amount: Type `500`
3. (Optional) Add Description: "Organic fertilizer"
4. Watch the preview:
   - Budget Used: ₹6,000 / ₹18,000
   - Remaining: ₹12,000
   - Bar updates in real-time
5. Click "Save Expense"

**Expected Results:**
✅ Toast notification: "Expense added"
✅ Modal closes
✅ Budget updates to ₹6,000
✅ Budget percentage shows 33%
✅ New expense appears in "Recent Expenses" section
✅ Quick Stats in header updates to 33%

---

### **Test Scenario 2: Voice Input (Simulated)**

**Steps:**
1. Click "Add Expense"
2. Click "Speak to Add Expense"
3. Wait 2 seconds (simulating voice recognition)
4. See auto-filled data:
   - Category: Randomly selected
   - Amount: Auto-filled (e.g., 500, 1500, 350)
   - Description: Auto-generated
5. Click "Save Expense"

**Expected Results:**
✅ Toast: "Voice recognized" → "Expense added"
✅ Budget updates correctly
✅ Expense appears in Recent Expenses list

---

### **Test Scenario 3: Budget Warnings**

**Test 75% Warning:**
1. Current: ₹5,500 / ₹18,000 (31%)
2. Add expense: ₹8,000
3. New total: ₹13,500 (75%)
4. Expected: Orange budget bar + Toast: "75% of budget used"

**Test 90% Warning:**
1. Current: ₹13,500 / ₹18,000 (75%)
2. Add expense: ₹3,000
3. New total: ₹16,500 (92%)
4. Expected: Red budget bar + Toast: "Budget almost exhausted!"

---

### **Test Scenario 4: Multiple Expenses**

**Steps:**
1. Add 5 different expenses:
   - Seeds: ₹2,000
   - Labor: ₹3,000
   - Water: ₹500
   - Pesticide: ₹800
   - Fertilizer: ₹1,200

**Expected Results:**
✅ All expenses appear in "Recent Expenses"
✅ Most recent expense is at the top
✅ Budget accumulates correctly
✅ Each expense shows:
   - Correct category icon
   - Category name
   - Description
   - Date
   - Amount in ₹

---

### **Test Scenario 5: Real-Time Updates**

**Watch These Elements Update:**
1. **Header Quick Stats**
   - Budget percentage updates immediately
   
2. **This Season Card**
   - Budget bar grows
   - Color changes (green → orange → red)
   - Text updates: "X% used • ₹Y remaining"
   
3. **Recent Expenses List**
   - New expense appears at top
   - Shows up to 5 most recent
   - Older expenses push down

---

## What to Check

### ✅ **Functionality**
- [ ] Category selection works
- [ ] Amount input accepts numbers
- [ ] Description is optional (works empty)
- [ ] Voice input simulates correctly
- [ ] Save button disabled without category/amount
- [ ] Cancel button closes modal
- [ ] Budget calculations are accurate

### ✅ **Visual Feedback**
- [ ] Budget preview shows before saving
- [ ] Progress bar animates smoothly
- [ ] Colors change at thresholds:
  - Green: 0-75%
  - Orange: 75-90%
  - Red: 90-100%
- [ ] Toast notifications appear
- [ ] Modal has smooth animations

### ✅ **Data Persistence**
- [ ] Expenses appear in Recent Expenses list
- [ ] Budget total updates correctly
- [ ] Quick stats update in header
- [ ] Data persists during session

---

## Expected Values

### **Initial State:**
- Total Budget: ₹18,000
- Used: ₹5,500 (31%)
- Remaining: ₹12,500
- Expenses: 2 (Seeds ₹2,000 + Fertilizer ₹3,500)

### **After Adding ₹500:**
- Used: ₹6,000 (33%)
- Remaining: ₹12,000
- Expenses: 3

### **After Adding ₹8,000 more:**
- Used: ₹14,000 (78%)
- Remaining: ₹4,000
- Color: Orange
- Warning: "75% of budget used"

### **After Adding ₹3,000 more:**
- Used: ₹17,000 (94%)
- Remaining: ₹1,000
- Color: Red
- Warning: "Budget almost exhausted!"

---

## Common Issues & Solutions

### **Issue: Expense not appearing**
**Check:**
- Did you click "Save Expense"?
- Were all required fields filled?
- Check Recent Expenses section (scroll down)

### **Issue: Budget not updating**
**Check:**
- Look at "This Season" section
- Check header quick stats
- Budget bar should animate
- Try refreshing if needed

### **Issue: Modal won't close**
**Solution:**
- Click X button
- Click Cancel
- Click Save (if form is valid)

### **Issue: Can't type amount**
**Check:**
- Click in the input field
- Make sure it's a number
- Try clearing and re-typing

---

## Advanced Testing

### **Edge Cases:**

1. **Zero Amount**
   - Try entering 0
   - Should allow but pointless

2. **Very Large Amount**
   - Enter ₹100,000
   - Budget bar maxes at 100%
   - Calculation still accurate

3. **Decimal Amounts**
   - Enter 500.50
   - Should work correctly

4. **No Description**
   - Leave description empty
   - Should show "No description" in list

5. **All Categories**
   - Test each category icon
   - Verify correct emoji displays

---

## Success Criteria

### **The expense flow works correctly if:**
1. ✅ You can add expenses manually
2. ✅ Voice input simulation works
3. ✅ Budget updates in real-time
4. ✅ Warnings appear at correct thresholds
5. ✅ Recent expenses list populates
6. ✅ All visual elements update correctly
7. ✅ Toast notifications are appropriate
8. ✅ Data persists during session

---

## Demo Flow for Presentation

**Quick Demo (2 minutes):**
```
1. Show current budget: 31%
2. Click "Add Expense"
3. Use voice input (shows AI capability)
4. Watch real-time preview
5. Save
6. Point out:
   - Budget bar update
   - New expense in list
   - Header stat update
   - Toast notification
```

**Full Demo (5 minutes):**
```
1. Start at 31% budget
2. Add small expense (₹500) - show basic flow
3. Add large expense (₹8,000) - show 75% warning
4. Add another (₹3,000) - show 90% critical warning
5. Show accumulated expenses list
6. Highlight financial transparency for farmers
```

---

## Why This Matters

### **For Farmers:**
- **Real-time awareness** of spending
- **Visual warnings** before overspending
- **Simple categorization** of expenses
- **No complex accounting** needed
- **Voice input** for low literacy

### **For Product:**
- Demonstrates **financial tracking** core feature
- Shows **real-time updates** capability
- Proves **user-friendly** interface
- Exhibits **progressive warnings** UX pattern
- Validates **voice-first** approach

---

**Built with clarity for farmers. 🌾**
