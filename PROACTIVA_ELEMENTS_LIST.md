# PROACTIVA Landing Page - Complete Elements List

## Current Insight Elements (20 Total)

### Statistics (8 elements)
1. **"$974.5B"** - Global healthcare IT market by 2027
2. **"19.8%"** - Annual growth rate (CAGR)
3. **"$369.3B"** - VA FY2025 budget investment
4. **"7.3M"** - Unique patients served by VA
5. **"32.5M"** - Telehealth appointments in FY2024
6. **"94.4%"** - AI diagnostic sensitivity vs 82.6% human
7. **"31%"** - Improvement in AI-assisted diagnosis
8. **"42%"** - Reduction in admin processing time

### Quotes (3 elements)
9. **"AI has emerged as the cornerstone technology revolutionizing healthcare delivery"**
10. **"The future of healthcare lies in human-AI collaboration"**
11. **"Healthcare will generate 36% faster data growth than other sectors by 2025"**

### Impact Statements (6 elements)
12. **"AI can predict acute kidney injury 48 hours before clinical manifestation"**
13. **"Wearables enable shift from reactive to proactive healthcare"**
14. **"Hospital-at-home programs show 11 statistically significant improvements"**
15. **"Revenue cycle AI increases net patient revenue by 3-5%"**
16. **"VA operates 65 Service Assisted Robots across facilities"**
17. **"VR therapy includes 'The Dementia Experience' training"**

### Animated Charts (3 elements)
18. **"Healthcare Technology Adoption"** - Growth across key sectors
19. **"Digital Health ROI"** - Return on investment metrics
20. **"Telehealth Growth"** - Year-over-year expansion

---

## Additional Elements Available (Not Currently Used)

### More Statistics from Research
- **"$7.6B"** - VA IT budget allocation for 2025
- **"142.6M"** - Projected outpatient visits for 2025
- **"4.6M"** - Veterans screened for toxic exposure under PACT Act
- **"$24.5B"** - Allocated through Toxic Exposures Fund (TEF) for 2025
- **"48,000"** - Homeless Veterans housed (exceeding goals)
- **"32%"** - Cost reduction in hospital-at-home programs ($5,081 vs. $7,480)
- **"3.2 vs 4.9"** - Days length of stay comparison (home vs hospital)
- **"9% vs 24%"** - Delirium rates comparison (home vs hospital)
- **"$894M"** - EHRM Reset budget (52% decrease for optimization)
- **"$17.1B"** - Mental health care investment
- **"$583M"** - Additional suicide prevention outreach funding
- **"65"** - Number of VA facilities with Service Assisted Robots
- **"6"** - Federal EHR sites in EHRM Reset program

### Additional Quotes
- **"The convergence of legislative mandates, demographic pressures, and technological capabilities creates a unique moment for reimagining Veterans' healthcare"**
- **"Healthcare organizations that successfully integrate these technologies while addressing implementation challenges will be positioned to deliver superior patient outcomes at lower costs"**
- **"Digital transformation reduces mortality rates across all major diagnosis groups"**
- **"The evidence is clear: the digital horizon is here, and it promises a future where healthcare is more precise, accessible, and effective than ever before"**

### Additional Impact Statements
- **"PACT Act represents the largest expansion of VA healthcare eligibility in decades"**
- **"MISSION Act's Veterans Community Care Program transforms rural healthcare access"**
- **"VIP initiative promises seamless data sharing between VA and non-VA health systems"**
- **"First VA-funded MDMA-assisted therapy study for PTSD in decades"**
- **"AI models predict acute kidney injury up to 48 hours before clinical manifestation"**
- **"ATLAS Sites program funds telehealth access in non-VA facilities"**
- **"Wearable devices collect heart rate variability, blood oxygen, sleep patterns, and glucose in real-time"**
- **"Hospital-at-home programs demonstrate lower mortality rates across all major diagnosis groups"**
- **"Revenue cycle management AI increases net patient revenue by 3-5%"**

### Chart Ideas (Not Currently Implemented)
- **"VA Budget Growth"** - Year-over-year budget increases
- **"Telehealth Adoption"** - Monthly appointment volume growth
- **"AI Implementation Timeline"** - Rollout across different departments
- **"Patient Satisfaction Scores"** - Traditional vs digital care delivery
- **"Cost Savings Analysis"** - Hospital-at-home vs traditional care
- **"Technology Adoption Rates"** - Various digital health tools
- **"Geographic Coverage"** - Telehealth reach across states
- **"Veteran Demographics"** - Age groups using digital services

---

## Technical Implementation Details

### Element Types and Styling
- **Statistics** - Large blue numbers with descriptions (Blue theme: #0066cc)
- **Quotes** - Italic text with red accent border (Red theme: #e74c3c) 
- **Impact Statements** - Green-tinted research findings (Green theme: #27ae60)
- **Charts** - Animated bar charts with growing effect (Red theme: #e74c3c)

### Display Settings
- **Duration per element**: 4 seconds
- **Transition time**: 0.8 seconds fade in/out
- **Location**: 60% from top, centered horizontally
- **Max width**: 600px on desktop, 95% on mobile

### Form Data Storage
- **Contact submissions**: Stored in `localStorage` as `proactivaContacts`
- **Access requests**: Stored in `localStorage` as `proactivaSubmissions` (research hub)

---

## Customization Instructions

### To Add New Elements:
1. Add to the `insights` array in the JavaScript
2. Specify type: `'stat'`, `'quote'`, `'impact'`, or `'chart'`
3. For stats: provide `number` and `description`
4. For quotes/impacts: provide `text`
5. For charts: provide `title` and `description`

### To Modify Display Timing:
- Change `displayDuration` value (currently 4000ms = 4 seconds)
- Adjust transition timing in CSS `.insight-element` class

### To Update Styling:
- **Colors**: Modify the theme colors in CSS variables
- **Typography**: Update font sizes in `.stat-number`, `.quote-text`, etc.
- **Layout**: Adjust `.insight-container` positioning and sizing

### To Add New Chart Types:
1. Create new CSS classes for chart styling
2. Add case in `createInsightElement()` function
3. Design HTML structure for the chart visualization
4. Add CSS animations as needed