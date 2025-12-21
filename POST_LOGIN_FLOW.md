# Post-Login Flow - Farmer Companion Platform

## Overview
This document details the complete user journey after successful login/registration.

---

## PHASE 1: ONBOARDING (First-Time Users)

### Step 1: Welcome & Profile Setup (2-3 minutes)
**Screen: Welcome Flow**

1. **Personal Information**
   - Name confirmation
   - Phone verification (OTP)
   - Preferred language selection
   - Voice preference (male/female voice for guidance)

2. **Farm Profile**
   - Location (GPS + manual entry)
   - Total land size
   - Number of fields
   - Water access (borewell/canal/rain-fed)
   - Current crops (if any)

3. **Experience Level**
   - Years of farming
   - Crops grown before
   - Previous challenges faced
   - Support needs

**User Action**: Complete profile → Auto-save → Continue

---

### Step 2: Field Setup (3-5 minutes per field)
**Screen: Field Registration**

For each field, farmer provides:

1. **Field Identification**
   - Field name/number (e.g., "North Field", "Field 1")
   - Size in acres
   - GPS boundaries (walk the field or mark on map)
   - Photo of field

2. **Soil Information**
   - Soil type (visual guide provided)
   - Last soil test date (if any)
   - Previous crop grown
   - Soil issues faced (waterlogging, salinity, etc.)

3. **Infrastructure**
   - Irrigation method (drip/flood/sprinkler)
   - Shade trees present
   - Fencing status
   - Storage facilities nearby

**User Action**: Add field → Save → Add another OR Continue to dashboard

---

### Step 3: Initial Soil Assessment (5 minutes)
**Screen: Soil Understanding**

1. **Guided Questionnaire**
   - Soil color (photo + selection)
   - Soil texture (hand-feel test with video guide)
   - Water retention (simple home test)
   - Organic matter visibility

2. **Recommendation**
   - Immediate soil health status
   - Suggested soil test (if needed)
   - Partner lab connections (subsidized testing)
   - DIY improvement steps

3. **Baseline Setting**
   - Current soil score (1-10)
   - Improvement goals
   - Timeline for next test

**User Action**: Complete assessment → Receive soil profile → Continue

---

### Step 4: Crop Selection Guidance (5-10 minutes)
**Screen: Crop Recommendation**

1. **Season Analysis**
   - Current season
   - Weather forecast (next 4 months)
   - Regional crop calendar
   - Market trends

2. **Personalized Recommendations**
   - Top 3 suitable crops for soil + season
   - Expected yield per acre
   - Total cost breakdown
   - Expected market price
   - Risk assessment (low/medium/high)

3. **Crop Selection**
   - Choose primary crop
   - Select variety/seed type
   - Intercrop options (if applicable)
   - Planting timeline

4. **Budget Planning**
   - Seed cost
   - Fertilizer cost
   - Labor cost
   - Water/electricity cost
   - Pesticide budget
   - Miscellaneous (10% buffer)
   - **Total Pre-Season Budget**

**User Action**: Select crop → Approve budget → Confirm start date

---

### Step 5: Onboarding Summary (2 minutes)
**Screen: Setup Complete**

Shows:
- ✅ Profile created
- ✅ Field(s) registered
- ✅ Soil assessed
- ✅ Crop selected
- ✅ Budget set

**What's Next:**
- Daily guidance starts tomorrow
- First task: Prepare field (details given)
- Journal entry tutorial
- Expense tracking tutorial

**User Action**: Start Journey → Go to Dashboard

---

## PHASE 2: DAILY DASHBOARD EXPERIENCE

### Main Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Profile] Farm Companion                    [Language] [⋮] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🌤️ Good Morning, [Farmer Name]                             │
│  Field: North Field | Day 42 of 120 | Tomato               │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  TODAY'S GUIDANCE                                  [🔊 Play] │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 1. ☀️ Water your field between 5-7 PM (30 min/acre)     │ │
│  │ 2. 🔍 Check plants for whitefly (leaves underside)       │ │
│  │ 3. 🌡️ Hot day expected - increase watering by 20%       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  QUICK ACTIONS                                                │
│  [🎤 Voice Entry] [📸 Photo] [💰 Add Expense] [❓ Ask]       │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  ALERTS                                           [View All]  │
│  ⚠️ Fertilizer due in 3 days (NPK 19:19:19 - 10kg)          │
│  📅 Harvest window opens in 2 weeks                          │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  THIS SEASON                                                  │
│  Budget: ₹12,450 / ₹18,000 (69% used)                       │
│  Progress: ████████░░░░ 62% to harvest                       │
│  Est. Yield: 8 tons (₹48,000 expected)                      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  [Journal] [Expenses] [Field Health] [Market Prices] [Help] │
└─────────────────────────────────────────────────────────────┘
```

---

## PHASE 3: KEY FEATURE FLOWS

### A. Voice Journal Entry Flow

**Trigger**: Tap "🎤 Voice Entry" button

1. **Recording Screen**
   ```
   ┌─────────────────────────────────┐
   │  Recording...                   │
   │                                 │
   │      ●●●●●●●●                  │
   │      [  2:34  ]                │
   │                                 │
   │  [Pause] [Stop] [Cancel]       │
   └─────────────────────────────────┘
   ```

2. **Auto-Transcription** (background)
   - Speech-to-text in local language
   - Timestamp added
   - Location tagged
   - Weather data attached

3. **Entry Confirmation**
   ```
   ┌─────────────────────────────────┐
   │  Journal Entry                  │
   │  ───────────────────────────── │
   │  "Watered the field today       │
   │  morning. Plants looking        │
   │  healthy. Some yellow leaves    │
   │  on north corner."              │
   │  ───────────────────────────── │
   │  📅 Dec 21, 2024 | 9:30 AM     │
   │  📍 North Field                 │
   │  🌡️ 28°C, Clear                │
   │                                 │
   │  [Add Photo] [Edit] [Save]     │
   └─────────────────────────────────┘
   ```

4. **AI Analysis** (background)
   - Extracts key info (watering done, yellow leaves)
   - Flags issues (yellow leaves → check if nutrient deficiency)
   - Updates field timeline
   - Triggers alert if needed

**Result**: Entry saved → Returns to dashboard → Alert added if issue detected

---

### B. Photo Documentation Flow

**Trigger**: Tap "📸 Photo" button

1. **Camera Screen**
   - Auto-focus on plant/field
   - Grid overlay for alignment
   - Flash auto/off/on
   - Switch front/back camera

2. **Photo Captured**
   ```
   ┌─────────────────────────────────┐
   │  [Photo Preview]                │
   │                                 │
   │  What's this photo about?       │
   │  ○ Plant health                 │
   │  ○ Pest/disease                 │
   │  ○ Soil condition              │
   │  ○ Harvest quality             │
   │  ○ Other                       │
   │                                 │
   │  Add notes (optional):          │
   │  [                            ] │
   │                                 │
   │  [Retake] [Save]               │
   └─────────────────────────────────┘
   ```

3. **AI Image Analysis** (background)
   - Plant disease detection
   - Pest identification
   - Growth stage assessment
   - Health scoring

4. **Results + Recommendations**
   ```
   ┌─────────────────────────────────┐
   │  Photo Analysis                 │
   │  ───────────────────────────── │
   │  ✅ Detected: Tomato Plant      │
   │  ⚠️  Issue Found: Early Blight  │
   │                                 │
   │  Recommendations:               │
   │  1. Remove affected leaves      │
   │  2. Apply copper fungicide      │
   │  3. Improve air circulation     │
   │  4. Reduce overhead watering    │
   │                                 │
   │  Urgency: Medium (Act in 2 days)│
   │                                 │
   │  [View Details] [Add to Tasks] │
   └─────────────────────────────────┘
   ```

**Result**: Photo + analysis saved → Alert created → Returns to dashboard

---

### C. Expense Tracking Flow

**Trigger**: Tap "💰 Add Expense" button

1. **Quick Entry Screen**
   ```
   ┌─────────────────────────────────┐
   │  Add Expense                    │
   │  ───────────────────────────── │
   │  Category:                      │
   │  [Seeds] [Fertilizer] [Labor]   │
   │  [Water] [Pesticide] [Other]    │
   │                                 │
   │  Amount: ₹ [          ]         │
   │                                 │
   │  Description (optional):        │
   │  [🎤 Speak or type]             │
   │                                 │
   │  Date: [Today ▼]                │
   │  Field: [North Field ▼]         │
   │                                 │
   │  [Cancel] [Save]                │
   └─────────────────────────────────┘
   ```

2. **Voice Option**
   - "Spent 500 rupees on fertilizer today"
   - Auto-extract: Amount (₹500), Category (Fertilizer), Date (Today)
   - Ask for confirmation

3. **Auto-Categorization**
   - Matches against budget categories
   - Flags if over budget
   - Suggests if should be split across fields

4. **Saved Confirmation**
   ```
   ┌─────────────────────────────────┐
   │  Expense Added ✓                │
   │  ───────────────────────────── │
   │  Fertilizer: ₹500               │
   │  Budget Used: 72% (₹12,950)     │
   │  Remaining: ₹5,050              │
   │                                 │
   │  Next expected expense:         │
   │  Labor (in 5 days) ~₹2,000      │
   │                                 │
   │  [View Budget] [Done]           │
   └─────────────────────────────────┘
   ```

**Result**: Expense logged → Budget updated → Returns to dashboard

---

### D. Daily Guidance Interaction

**Morning (6-8 AM)**
- Push notification: "Good morning! Here's today's guidance"
- Voice announcement (if enabled)
- Dashboard updated with tasks

**Tasks Format:**
```
TODAY'S GUIDANCE (🔊 Listen)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Morning (Before 10 AM)
  □ Check soil moisture (press finger 2 inches deep)
  □ Look for pest eggs under leaves

☀️ Afternoon (12-3 PM)
  □ Apply neem spray (mix 5ml per liter)
  □ Remove weeds around plants

🌙 Evening (After 5 PM)
  □ Water field (30 min per acre)
  □ Note any changes in plant color
  
💡 Tip of the day:
   Tomato plants need calcium - crush eggshells 
   around base or use calcium spray
```

**Task Completion:**
- Tap checkbox → Mark as done
- Optionally add note/photo
- Updates field timeline
- Affects next day's guidance

---

### E. Weekly Progress Review

**Every Sunday Evening**

1. **Notification**: "Weekly review ready - See your progress"

2. **Review Screen**
   ```
   ┌─────────────────────────────────┐
   │  This Week's Summary            │
   │  ───────────────────────────── │
   │  ✅ Tasks Completed: 18/21      │
   │  📝 Journal Entries: 6          │
   │  💰 Expenses: ₹2,450            │
   │  📸 Photos: 8                   │
   │                                 │
   │  Field Health: ████████░░ 8/10  │
   │  (Improved from last week: 7/10)│
   │                                 │
   │  Highlights:                    │
   │  • Pest control worked well     │
   │  • Plant height increased 6cm   │
   │  • Good watering schedule       │
   │                                 │
   │  Areas to watch:                │
   │  ⚠️ Some nutrient deficiency    │
   │     signs - check fertilizer    │
   │                                 │
   │  Next Week Focus:               │
   │  • Increase potassium intake    │
   │  • Monitor flowering stage      │
   │  • Prepare for pruning          │
   │                                 │
   │  [View Details] [Share] [Done] │
   └─────────────────────────────────┘
   ```

**Result**: Progress saved → Recommendations generated → Returns to dashboard

---

## PHASE 4: HARVEST PREPARATION (Last 2 Weeks)

### Harvest Planning Flow

**Trigger**: Auto-activated when crop enters harvest window

1. **Harvest Readiness Check**
   ```
   ┌─────────────────────────────────┐
   │  🎉 Harvest Time Approaching!   │
   │  ───────────────────────────── │
   │  Your tomatoes will be ready    │
   │  in ~14 days                    │
   │                                 │
   │  Ready Signs to Check:          │
   │  □ Color fully developed        │
   │  □ Firm but slightly soft       │
   │  □ Easy to separate from vine   │
   │                                 │
   │  [Set up Harvest Plan]          │
   └─────────────────────────────────┘
   ```

2. **Harvest Planning**
   - Expected quantity
   - Labor needed
   - Storage requirements
   - Transport options
   - Market timing

3. **Market Intelligence**
   ```
   ┌─────────────────────────────────┐
   │  Market Prices (Today)          │
   │  ───────────────────────────── │
   │  Local Mandi: ₹12/kg           │
   │  Wholesale: ₹15/kg             │
   │  Direct Buyer: ₹18/kg          │
   │                                 │
   │  Historical Trend:              │
   │  [Price Graph - Last 6 months] │
   │                                 │
   │  Best selling time:             │
   │  📅 In 10-14 days               │
   │  Expected price: ₹16-18/kg      │
   │                                 │
   │  Quality tips:                  │
   │  • Stop watering 3 days before  │
   │  • Harvest in morning           │
   │  • Sort by size immediately     │
   │                                 │
   │  [Get Buyer Contacts]           │
   └─────────────────────────────────┘
   ```

---

## PHASE 5: POST-HARVEST & SEASON CLOSING

### Harvest Recording

1. **Actual Yield Entry**
   ```
   ┌─────────────────────────────────┐
   │  Record Your Harvest            │
   │  ───────────────────────────── │
   │  Total harvested: [     ] kg    │
   │  Grade A: [     ] kg            │
   │  Grade B: [     ] kg            │
   │  Rejected: [     ] kg           │
   │                                 │
   │  Sold to:                       │
   │  ○ Local market                 │
   │  ○ Wholesale trader             │
   │  ○ Direct buyer                 │
   │  ○ Multiple buyers              │
   │                                 │
   │  Price received: ₹[    ]/kg     │
   │  Total revenue: ₹[           ]  │
   │                                 │
   │  [Take Photo] [Save]            │
   └─────────────────────────────────┘
   ```

### Season Summary Report

**Auto-generated after harvest recording**

```
┌─────────────────────────────────────────────┐
│  Season Complete! 🎊                         │
│  North Field - Tomato (120 days)            │
│  ───────────────────────────────────────── │
│                                             │
│  FINANCIAL SUMMARY                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Total Investment: ₹18,500                  │
│  │                                          │
│  ├─ Seeds: ₹2,000                          │
│  ├─ Fertilizer: ₹6,500                     │
│  ├─ Labor: ₹7,000                          │
│  ├─ Water/Electricity: ₹1,800              │
│  └─ Pesticides: ₹1,200                     │
│                                             │
│  Total Revenue: ₹52,800                     │
│  (3,300 kg @ avg ₹16/kg)                   │
│                                             │
│  NET PROFIT: ₹34,300 ✨                     │
│  ROI: 185%                                  │
│                                             │
│  PERFORMANCE INSIGHTS                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Yield: 3,300 kg (expected: 2,800 kg) +18% │
│  Quality: 82% Grade A (Good!)              │
│  Tasks completed: 89% (Very Good!)         │
│  Issues handled: 3 (pest, nutrient, water) │
│                                             │
│  WHAT WORKED WELL                           │
│  ✅ Timely pest control                     │
│  ✅ Consistent watering schedule            │
│  ✅ Good fertilizer management              │
│  ✅ Regular monitoring via journal          │
│                                             │
│  LEARNINGS FOR NEXT SEASON                  │
│  💡 Start calcium spray earlier             │
│  💡 Increase spacing between plants         │
│  💡 Consider drip irrigation upgrade        │
│                                             │
│  SOIL HEALTH CHANGE                         │
│  Before: 6.5/10                            │
│  After: 7.2/10 (+0.7) ⬆️                   │
│  (Good improvement!)                        │
│                                             │
│  [Share Success] [Start Next Season]       │
└─────────────────────────────────────────────┘
```

---

## PHASE 6: NEXT SEASON PREPARATION

**After reviewing season summary**

1. **Soil Rest & Preparation**
   - Recommended rest period
   - Soil improvement tasks
   - Green manure options
   - Cover crop suggestions

2. **Next Crop Planning**
   - Uses learning from previous season
   - Updated soil data
   - Market trends
   - Seasonal recommendations

3. **Budget Refinement**
   - Based on actual expenses from last season
   - Adjusted for learnings
   - Better cost estimates

**Cycle Repeats** → Back to PHASE 1, Step 4 (Crop Selection)

---

## CONTINUOUS FEATURES (Available Anytime)

### 1. Ask/Help Feature
- Voice or text query
- AI responds in local language
- Context-aware (knows your field, crop, stage)
- Examples:
  - "Why are leaves turning yellow?"
  - "When should I harvest?"
  - "Is this a pest?"

### 2. Field Health Dashboard
```
Field Health Score: 8.2/10

┌─────────────────────────────────┐
│  Soil Health: ████████░░ 8/10   │
│  Plant Growth: ████████░░ 9/10  │
│  Pest Control: ███████░░░ 7/10  │
│  Nutrition: ████████░░ 8/10     │
│  Water Status: █████████░ 9/10  │
└─────────────────────────────────┘

Trending: ⬆️ Improving
Timeline: [Visual graph of health over season]
```

### 3. Knowledge Library
- Crop-specific guides
- Pest identification gallery
- Organic farming methods
- Video tutorials (local language)
- Success stories from other farmers

### 4. Community (Optional)
- Local farmer groups
- Share learnings
- Ask community questions
- Market price updates
- Collective selling opportunities

---

## OFFLINE MODE

**When internet is unavailable:**

- All guidance pre-downloaded for next 7 days
- Voice entries saved locally, sync when online
- Photos cached, upload later
- Critical alerts work offline
- Basic calculations available
- Essential knowledge base accessible

**Auto-sync when online:**
- Uploads journal entries
- Syncs expenses
- Updates market prices
- Downloads new guidance
- Backs up all data

---

## NOTIFICATION STRATEGY

**Morning (6 AM)**
- Today's tasks summary
- Weather alert (if significant)

**Critical Alerts (Anytime)**
- Pest outbreak nearby
- Extreme weather warning
- Market price spike
- Disease detected in photo

**Evening (6 PM)**
- Task completion reminder
- Tomorrow's prep checklist

**Weekly (Sunday 7 PM)**
- Progress summary
- Next week preview

**All notifications:**
- Voice option available
- Actionable (tap to view/complete)
- Can be customized/muted
- Local language

---

## DATA PRIVACY & OWNERSHIP

**Farmer's data belongs to farmer:**
- Full export anytime (PDF, Excel)
- Delete account = delete all data
- No selling to third parties
- Anonymous aggregation for research (opt-in only)
- Clear consent for every data use

**Transparency:**
- Show what data is collected
- Explain why it's needed
- Option to opt-out of optional data
- Simple privacy policy (local language)

---

## SUPPORT SYSTEM

**Multi-level support:**

1. **AI Chat** (Instant)
   - Common questions
   - Troubleshooting
   - How-to guides

2. **Expert Call** (Within 2 hours)
   - Voice support in local language
   - Agricultural expert
   - Screen sharing if needed

3. **Field Visit** (For critical issues)
   - Partner agronomist
   - Soil testing
   - Advanced diagnostics

4. **Community Help**
   - Experienced farmer mentors
   - Peer support groups
   - Success story sharing

---

This comprehensive flow ensures farmers get:
✅ Clear guidance every step
✅ Easy documentation
✅ Financial clarity
✅ Continuous learning
✅ Peace of mind
