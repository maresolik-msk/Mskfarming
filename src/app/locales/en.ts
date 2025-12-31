export const en = {
  translation: {
    common: {
      loading: "Loading...",
      appName: "Farm Companion",
      welcome: "Welcome",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      submit: "Submit",
      back: "Back",
      next: "Next",
      finish: "Finish",
      skip: "Skip"
    },
    dashboard: {
      activeField: "Active Field",
      selectField: "Select Field",
      addNewField: "Add New Field",
      welcomeMessage: "Welcome to your Farm Dashboard! 🌱",
      welcomeSub: "Let's take a quick tour to help you get started.",
      manageFields: "Manage Your Fields",
      manageFieldsSub: "Click here to switch between fields or add a new field to your farm.",
      moreFeatures: "More Features",
      moreFeaturesSub: "Access your Profile, Expenses, and Market Prices here."
    },
    menu: {
      title: "Menu",
      navigation: "Navigation",
      dashboard: "Dashboard",
      myFields: "My Fields",
      cropSimulator: "Crop Simulator",
      journalHistory: "Journal History",
      expenses: "Expenses",
      marketPrices: "Market Prices",
      soilTesting: "Soil Testing",
      profile: "Profile",
      logout: "Log Out"
    },
    features: {
      cropSimulator: "Crop Simulator",
      satelliteMonitoring: "Satellite Monitoring",
      voiceJournal: "Voice Journal",
      photoJournal: "Photo Journal",
      expenseTracker: "Expense Tracker",
      soilHealth: "Soil Health",
      weather: "Weather",
      tasks: "Tasks"
    },
    home: {
      greeting: "Namaste, {{name}}",
      weather: "Weather Snapshot",
      budget: {
        critical: "Critical Budget: {{percent}}% used. Review expenses immediately.",
        warning: "Budget Warning: {{percent}}% used. Be careful with spending.",
        attention: "Attention Needed",
        monthly: "Monthly Budget",
        used: "used",
        remaining: "remaining"
      },
      actions: {
        title: "Quick Actions",
        voice: { title: "Voice Log", desc: "Record activity or note" },
        photo: { title: "Take Photo" },
        expense: { title: "Add Expense" }
      },
      dailyPlan: {
        title: "Today's Plan",
        pending: "{{count}} Pending"
      },
      farmStatus: {
        title: "Farm Status",
        growthCycle: "Growth Cycle",
        nextTask: "Next Task",
        soilHealth: "Soil Health",
        checkStatus: "Check Status",
        seedAdvisor: "Seed Advisor",
        nextSeason: "Next Season",
        good: "Good"
      }
    },
    growth: {
      liveStage: "Live Stage",
      stageCount: "Stage {{current}} of {{total}}",
      timeRemaining: "Time Remaining",
      days: "Days",
      markComplete: "Mark Stage as Complete",
      currentPhase: "Current Phase",
      duration: "{{days}} Days Duration",
      estDate: "Est. {{date}}",
      analyzing: "Analysing growth cycle...",
      stages: {
        1: "Land Preparation",
        2: "Seed Selection & Treatment",
        3: "Sowing / Planting",
        4: "Germination & Establishment",
        5: "Vegetative Growth",
        6: "Flowering",
        7: "Fruiting / Grain Formation",
        8: "Maturity",
        9: "Harvest",
        10: "Post-Harvest Soil Care"
      },
      soil_notes: {
        alluvial_soil: {
          1: "Level field for uniform water retention; alluvial soil requires thorough puddling",
          5: "Nitrogen deficiency common in alluvial soil; split application recommended"
        },
        black_soil: {
          1: "Deep ploughing reduces cracking tendency of black soil",
          3: "Sow on ridges to prevent waterlogging in black soil"
        },
        red_soil: {
          1: "Red soil needs organic matter enrichment; low fertility",
          6: "Peg penetration requires loose soil in red soil"
        },
        arid_soil: {
          1: "Minimal tillage to conserve moisture in arid soil",
          5: "Critical irrigation needed; very low water retention"
        },
        default: "Monitor soil conditions carefully during this stage"
      },
      actions: {
        1: ["Deep ploughing", "Levelling", "Apply FYM/compost", "Prepare drainage"],
        2: ["Select certified seeds", "Seed treatment with fungicide", "Quality testing"],
        3: ["Sow at optimal depth", "Maintain row spacing", "Light irrigation"],
        4: ["Monitor germination", "Gap filling if needed", "First weeding"],
        5: ["Apply nitrogen in splits", "Regular irrigation", "Weed control", "Pest scouting"],
        6: ["Maintain adequate moisture", "Monitor for pests", "Apply micronutrients"],
        7: ["Continue irrigation", "Disease monitoring", "Nutrient top dressing"],
        8: ["Stop irrigation 7-10 days before harvest", "Monitor grain/fruit maturity"],
        9: ["Harvest at optimal time", "Proper handling", "Sun drying if needed"],
        10: ["Stubble management", "Soil testing", "Prepare for next crop"],
        default: ["Monitor crop health", "Follow recommended practices"]
      },
      risks: {
        1: ["Poor drainage", "Soil compaction"],
        2: ["Seed-borne diseases", "Poor quality seeds"],
        3: ["Uneven germination", "Pest attack on seeds"],
        4: ["Damping off", "Seedling rot", "Weed competition"],
        5: ["Nutrient deficiency", "Pest infestation", "Water stress"],
        6: ["Moisture stress", "Flower drop", "Pest damage"],
        7: ["Fruit/grain drop", "Disease outbreak", "Nutrient deficiency"],
        8: ["Over-maturity", "Lodging", "Bird/rat damage"],
        9: ["Post-harvest loss", "Quality deterioration", "Delayed harvest"],
        10: ["Stubble burning", "Soil nutrient depletion", "Pest carryover"],
        default: ["General crop risks"]
      },
      alerts: {
        1: ["Ensure proper drainage before sowing"],
        2: ["Use only certified disease-free seeds"],
        3: ["Sow at recommended depth for your soil type"],
        4: ["Monitor for early pest attack"],
        5: ["Apply nitrogen when plants show deficiency symptoms"],
        6: ["Do NOT skip irrigation during flowering - critical stage"],
        7: ["Maintain consistent moisture for good yield"],
        8: ["Stop irrigation at the right time to avoid quality issues"],
        9: ["Harvest at optimal maturity for best quality"],
        10: ["Do NOT burn crop residue - incorporate into soil"],
        default: ["Follow best practices"]
      },
      practices: {
        irrigation: [
          "Check soil moisture levels before irrigating to avoid waterlogging.",
          "Use drip or sprinkler systems if available to maximize water efficiency.",
          "Irrigate in the early morning or late evening to reduce evaporation.",
          "Ensure water reaches the root zone depth of 15-20cm."
        ],
        fertilizer: [
          "Apply fertilizer near the root zone but avoid direct contact with the stem.",
          "Water the field lightly after application to help nutrients dissolve and reach roots.",
          "Split the dosage as recommended (e.g., 50% basal, 25% vegetative, 25% flowering).",
          "Avoid applying during strong winds to prevent drift."
        ],
        pest: [
          "Scout the field in a zigzag pattern to assess the severity of infestation.",
          "Identify the pest/disease correctly using the AI lens or expert advice.",
          "Use recommended biological or chemical controls at the specified dosage.",
          "Wear protective gear (gloves, mask) while handling crop protection products."
        ],
        weed: [
          "Remove weeds when they are young and before they flower/set seed.",
          "Use manual weeding or mechanical weeders between rows to protect the crop.",
          "Mulch the soil surface if possible to suppress weed growth.",
          "Dispose of removed weeds away from the field to prevent re-rooting."
        ],
        default: [
          "Schedule this activity during early morning hours for best results.",
          "Ensure all necessary tools and safety gear are ready before starting.",
          "Monitor weather conditions; avoid performing this task during heavy rain or extreme heat.",
          "Record the completion date and any observations in your farm log."
        ]
      }
    }
  }
};
