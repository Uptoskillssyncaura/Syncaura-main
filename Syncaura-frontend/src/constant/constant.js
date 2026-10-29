export const CHATS = [
  {
    id: 1,
    name: "John Dev",
    last: "Hey bro, you free ah?",
    time: "12:00",
    avatar: "J",
    unread: 3,
    gradient: "from-blue-400 to-blue-700",

    profile: {
      name: "John Dev",
      post: "Frontend Engineer @ FlowBit",
      gredient: "from-blue-400 to-blue-700"
    },
    chatDetails: {
      status: "Open",
      assignedTo: "John Dev",
      localTime: "10:35 AM (PST)",
      location: "San Francisco, CA",
    },
    files: [
      { name: "ui_notes.txt", size: "1.2 MB", date: "Dec 10" },
      { name: "components.png", size: "820 KB", date: "Dec 09" },
    ], isArchived: true ,
  },

  {
    id: 2,
    name: "Aarav M",
    last: "Good morning!",
    time: "Dec 12",
    avatar: "A",
    unread: 0,
    gradient: "from-purple-400 to-purple-700",

    profile: {
      name: "Aarav M",
      post: "Backend Developer",
      gredient: "from-purple-400 to-purple-700",
    },
    chatDetails: {
      status: "Closed",
      assignedTo: "Aarav M",
      localTime: "09:10 AM (IST)",
      location: "Bangalore, India",
    },
    files: [{ name: "api_schema.json", size: "900 KB", date: "Dec 11" }], isArchived: true ,
  },

  {
    id: 3,
    name: "Sneha R",
    last: "Hey, quick question…",
    time: "Dec 15",
    avatar: "S",
    unread: 5,
    gradient: "from-pink-400 to-pink-700",

    profile: {
      name: "Sneha R",
      post: "UI/UX Designer",
      gredient: "from-pink-400 to-pink-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Sneha R",
      localTime: "11:45 AM (IST)",
      location: "Pune, India",
    },
    files: [
      { name: "wireframe.fig", size: "2.8 MB", date: "Dec 14" },
      { name: "colors.pdf", size: "620 KB", date: "Dec 13" },
    ], isArchived: true 
  },

  {
    id: 4,
    name: "Karthik S",
    last: "Hi, I've uploaded the file",
    time: "Nov 3",
    avatar: "K",
    unread: 1,
    gradient: "from-emerald-400 to-emerald-700",

    profile: {
      name: "Karthik S",
      post: "DevOps Engineer",
      gredient: "from-emerald-400 to-emerald-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Karthik S",
      localTime: "08:30 PM (IST)",
      location: "Hyderabad, India",
    },
    files: [{ name: "deployment.yml", size: "450 KB", date: "Nov 02" }], isArchived: true 
  },

  {
    id: 5,
    name: "Ananya P",
    last: "Can we meet today?",
    time: "Nov 5",
    avatar: "A",
    unread: 2,
    gradient: "from-blue-400 to-blue-700",

    profile: {
      name: "Ananya P",
      post: "Product Owner",
      gredient: "from-blue-400 to-blue-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Ananya P",
      localTime: "02:15 PM (IST)",
      location: "Mumbai, India",
    },
    files: [{ name: "roadmap.pdf", size: "1.9 MB", date: "Nov 04" }],
  },

  {
    id: 6,
    name: "Rohit K",
    last: "Sent you the documents.",
    time: "Nov 6",
    avatar: "R",
    unread: 0,
    gradient: "from-purple-400 to-purple-700",

    profile: {
      name: "Rohit K",
      post: "Business Analyst",
      gredient: "from-purple-400 to-purple-700",
    },
    chatDetails: {
      status: "Closed",
      assignedTo: "Rohit K",
      localTime: "06:40 PM (IST)",
      location: "Delhi, India",
    },
    files: [{ name: "analysis.xlsx", size: "1.3 MB", date: "Nov 05" }],
  },

  {
    id: 7,
    name: "Priya L",
    last: "Thanks for your help!",
    time: "Nov 7",
    avatar: "P",
    unread: 4,
    gradient: "from-pink-400 to-pink-700",

    profile: {
      name: "Priya L",
      post: "QA Engineer",
      gredient: "from-pink-400 to-pink-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Priya L",
      localTime: "04:55 PM (IST)",
      location: "Chennai, India",
    },
    files: [{ name: "bug_report.docx", size: "780 KB", date: "Nov 06" }],
  },

  {
    id: 8,
    name: "Vikram S",
    last: "Let's catch up soon.",
    time: "Nov 8",
    avatar: "V",
    unread: 0,
    gradient: "from-emerald-400 to-emerald-700",

    profile: {
      name: "Vikram S",
      post: "Tech Lead",
      gredient: "from-emerald-400 to-emerald-700",
    },
    chatDetails: {
      status: "Closed",
      assignedTo: "Vikram S",
      localTime: "09:20 PM (IST)",
      location: "Noida, India",
    },
    files: [],
  },

  {
    id: 9,
    name: "Neha M",
    last: "Call me when free.",
    time: "Nov 9",
    avatar: "N",
    unread: 1,
    gradient: "from-blue-400 to-blue-700",

    profile: {
      name: "Neha M",
      post: "HR Manager",
      gredient: "from-blue-400 to-blue-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Neha M",
      localTime: "01:30 PM (IST)",
      location: "Gurgaon, India",
    },
    files: [{ name: "policy.pdf", size: "540 KB", date: "Nov 08" }],
  },

  {
    id: 10,
    name: "Amit R",
    last: "Working on the project.",
    time: "Nov 10",
    avatar: "A",
    unread: 0,
    gradient: "from-purple-400 to-purple-700",

    profile: {
      name: "Amit R",
      post: "Full Stack Developer",
      gredient: "from-purple-400 to-purple-700",
    },
    chatDetails: {
      status: "Closed",
      assignedTo: "Amit R",
      localTime: "07:00 PM (IST)",
      location: "Indore, India",
    },
    files: [{ name: "feature_list.md", size: "310 KB", date: "Nov 09" }],
  },

  {
    id: 11,
    name: "Shreya D",
    last: "Good night!",
    time: "Nov 11",
    avatar: "S",
    unread: 3,
    gradient: "from-pink-400 to-pink-700",

    profile: {
      name: "Shreya D",
      post: "Content Strategist",
      gredient: "from-pink-400 to-pink-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Shreya D",
      localTime: "11:55 PM (IST)",
      location: "Jaipur, India",
    },
    files: [{ name: "content_plan.docx", size: "650 KB", date: "Nov 10" }],
  },

  {
    id: 12,
    name: "Rahul P",
    last: "Let's finalize this.",
    time: "Nov 12",
    avatar: "R",
    unread: 0,
    gradient: "from-emerald-400 to-emerald-700",

    profile: {
      name: "Rahul P",
      post: "Project Manager",
      gredient: "from-emerald-400 to-emerald-700",
    },
    chatDetails: {
      status: "Closed",
      assignedTo: "Rahul P",
      localTime: "03:00 PM (IST)",
      location: "Ahmedabad, India",
    },
    files: [{ name: "timeline.xlsx", size: "1.5 MB", date: "Nov 11" }],
  },

  {
    id: 13,
    name: "Isha K",
    last: "See you tomorrow.",
    time: "Nov 13",
    avatar: "I",
    unread: 2,
    gradient: "from-blue-400 to-blue-700",

    profile: {
      name: "Isha K",
      post: "Marketing Executive",
      gredient: "from-blue-400 to-blue-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Isha K",
      localTime: "05:45 PM (IST)",
      location: "Kolkata, India",
    },
    files: [{ name: "campaign.pdf", size: "2.1 MB", date: "Nov 12" }],
  },

  {
    id: 14,
    name: "Manish T",
    last: "Where are you?",
    time: "Nov 14",
    avatar: "M",
    unread: 1,
    gradient: "from-purple-400 to-purple-700",

    profile: {
      name: "Manish T",
      post: "Sales Lead",
      gredient: "from-purple-400 to-purple-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Manish T",
      localTime: "06:10 PM (IST)",
      location: "Surat, India",
    },
    files: [],
  },

  {
    id: 15,
    name: "Tanya S",
    last: "Sent the files.",
    time: "Nov 15",
    avatar: "T",
    unread: 0,
    gradient: "from-pink-400 to-pink-700",

    profile: {
      name: "Tanya S",
      post: "Graphic Designer",
      gredient: "from-pink-400 to-pink-700",
    },
    chatDetails: {
      status: "Closed",
      assignedTo: "Tanya S",
      localTime: "12:40 PM (IST)",
      location: "Udaipur, India",
    },
    files: [{ name: "branding.psd", size: "5.2 MB", date: "Nov 14" }],
  },

  {
    id: 16,
    name: "Kunal R",
    last: "Thanks for the update.",
    time: "Nov 16",
    avatar: "K",
    unread: 0,
    gradient: "from-emerald-400 to-emerald-700",

    profile: {
      name: "Kunal R",
      post: "Support Engineer",
      gredient: "from-emerald-400 to-emerald-700",
    },
    chatDetails: {
      status: "Closed",
      assignedTo: "Kunal R",
      localTime: "10:20 AM (IST)",
      location: "Nagpur, India",
    },
    files: [],
  },

  {
    id: 17,
    name: "Divya P",
    last: "I'll join in 5 min.",
    time: "Nov 17",
    avatar: "D",
    unread: 3,
    gradient: "from-blue-400 to-blue-700",

    profile: {
      name: "Divya P",
      post: "Scrum Master",
      gredient: "from-blue-400 to-blue-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Divya P",
      localTime: "04:00 PM (IST)",
      location: "Coimbatore, India",
    },
    files: [{ name: "standup_notes.txt", size: "210 KB", date: "Nov 16" }],
  },

  {
    id: 18,
    name: "Siddharth M",
    last: "Meeting postponed.",
    time: "Nov 18",
    avatar: "S",
    unread: 0,
    gradient: "from-purple-400 to-purple-700",

    profile: {
      name: "Siddharth M",
      post: "Operations Manager",
      gredient: "from-purple-400 to-purple-700",
    },
    chatDetails: {
      status: "Closed",
      assignedTo: "Siddharth M",
      localTime: "09:30 AM (IST)",
      location: "Bhopal, India",
    },
    files: [],
  },

  {
    id: 19,
    name: "Aisha R",
    last: "See you at 6 pm.",
    time: "Nov 19",
    avatar: "A",
    unread: 2,
    gradient: "from-pink-400 to-pink-700",

    profile: {
      name: "Aisha R",
      post: "Customer Success",
      gredient: "from-pink-400 to-pink-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Aisha R",
      localTime: "05:55 PM (IST)",
      location: "Kochi, India",
    },
    files: [{ name: "client_notes.docx", size: "400 KB", date: "Nov 18" }],
  },

  {
    id: 20,
    name: "Harsh V",
    last: "Please review this.",
    time: "Nov 20",
    avatar: "H",
    unread: 0,
    gradient: "from-emerald-400 to-emerald-700",

    profile: {
      name: "Harsh V",
      post: "Code Reviewer",
      gredient: "from-emerald-400 to-emerald-700",
    },
    chatDetails: {
      status: "Closed",
      assignedTo: "Harsh V",
      localTime: "08:10 PM (IST)",
      location: "Vadodara, India",
    },
    files: [{ name: "review_comments.md", size: "180 KB", date: "Nov 19" }],
  },

  {
    id: 21,
    name: "Simran D",
    last: "Awesome work!",
    time: "Nov 21",
    avatar: "S",
    unread: 1,
    gradient: "from-blue-400 to-blue-700",

    profile: {
      name: "Simran D",
      post: "Talent Acquisition",
      gredient: "from-blue-400 to-blue-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Simran D",
      localTime: "11:20 AM (IST)",
      location: "Chandigarh, India",
    },
    files: [],
  },

  {
    id: 22,
    name: "Nikhil P",
    last: "I'll call you later.",
    time: "Nov 22",
    avatar: "N",
    unread: 0,
    gradient: "from-purple-400 to-purple-700",

    profile: {
      name: "Nikhil P",
      post: "Data Analyst",
      gredient: "from-purple-400 to-purple-700",
    },
    chatDetails: {
      status: "Closed",
      assignedTo: "Nikhil P",
      localTime: "07:45 PM (IST)",
      location: "Trichy, India",
    },
    files: [{ name: "metrics.csv", size: "720 KB", date: "Nov 21" }],
  },

  {
    id: 23,
    name: "Meera K",
    last: "Got it, thanks!",
    time: "Nov 23",
    avatar: "M",
    unread: 2,
    gradient: "from-pink-400 to-pink-700",

    profile: {
      name: "Meera K",
      post: "Finance Executive",
      gredient: "from-pink-400 to-pink-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Meera K",
      localTime: "03:35 PM (IST)",
      location: "Ujjain, India",
    },
    files: [{ name: "invoice.pdf", size: "510 KB", date: "Nov 22" }],
  },

  {
    id: 24,
    name: "Aditya R",
    last: "Let's start the task.",
    time: "Nov 24",
    avatar: "A",
    unread: 0,
    gradient: "from-emerald-400 to-emerald-700",

    profile: {
      name: "Aditya R",
      post: "Engineering Manager",
      gredient: "from-emerald-400 to-emerald-700",
    },
    chatDetails: {
      status: "Closed",
      assignedTo: "Aditya R",
      localTime: "09:00 AM (IST)",
      location: "Mysore, India",
    },
    files: [],
  },

  {
    id: 25,
    name: "Ritika S",
    last: "Will send update soon.",
    time: "Nov 25",
    avatar: "R",
    unread: 2,
    gradient: "from-blue-400 to-blue-700",

    profile: {
      name: "Ritika S",
      post: "Operations Coordinator",
      gredient: "from-blue-400 to-blue-700",
    },
    chatDetails: {
      status: "Open",
      assignedTo: "Ritika S",
      localTime: "01:15 PM (IST)",
      location: "Lucknow, India",
    },
    files: [{ name: "ops_checklist.docx", size: "430 KB", date: "Nov 24" }],
  },
];


export const COMPLAINTS = [
  {
    id: "#1023",
    subject: "Slow WiFi in Library",
    category: "Network",
    date: "2024-11-18T09:32:15.421Z",
    status: "Open",
    description:
      "The WiFi connectivity in the central library has been consistently slow for the past several weeks. Students and staff are facing frequent disconnections, extremely low download speeds, and long loading times when accessing academic portals, research databases, and internal university systems. This issue becomes particularly severe during peak hours when the library is crowded, making it difficult to complete online assignments, attend virtual lectures, or conduct research efficiently. Multiple attempts to reconnect to the network result in authentication failures or timeouts. The issue affects all floors of the library and is not limited to a specific seating area. Several students have reported that mobile hotspots work better than the institutional WiFi, which defeats the purpose of having a dedicated campus network. This problem is impacting productivity and academic performance, especially during examination periods. A detailed network audit and router inspection is required to identify bandwidth bottlenecks, outdated hardware, or configuration issues.",
    attachments: [
      {
        name: "wifi_speed_test.png",
        url: "https://example.com/uploads/wifi_speed_test.png",
      },
      {
        name: "library_router_photo.jpg",
        url: "https://example.com/uploads/library_router_photo.jpg",
      },
    ],
  },

  {
    id: "#1019",
    subject: "Cannot access portal",
    category: "Login",
    date: "2024-11-16T14:10:42.109Z",
    status: "In Progress",
    description:
      "Several users are unable to access the student and staff portal despite entering correct login credentials. The system either displays an invalid session error or continuously redirects back to the login screen. This issue started appearing after a recent system update and affects both desktop and mobile users across different browsers. Password reset attempts are unsuccessful and users do not receive reset emails in some cases. This has caused delays in accessing attendance records, internal announcements, fee payment systems, and course materials. Faculty members are also affected and cannot upload grades or update coursework. The problem appears to be related to session handling or authentication token expiration. A review of server logs and authentication middleware is required to restore seamless access. Temporary workarounds such as clearing cache are inconsistent and unreliable.",
    attachments: [
      {
        name: "portal_error_screenshot.png",
        url: "https://example.com/uploads/portal_error_screenshot.png",
      },
    ],
  },

  {
    id: "#1011",
    subject: "ID Card malfunction",
    category: "Access",
    date: "2024-11-12T08:55:03.887Z",
    status: "Resolved",
    description:
      "The issued ID card was not functioning correctly at multiple access points including entry gates, library scanners, and attendance systems. Despite being physically intact, the card frequently failed to register during scans, causing inconvenience and delays. Security staff had to manually verify identity, leading to long queues during peak hours. The issue was intermittent, making it difficult to reproduce consistently. After technical inspection, it was identified that the card’s embedded chip had degraded and required replacement. The card was reissued and tested across all access systems. Since replacement, the issue has been fully resolved and the card is functioning as expected.",
    attachments: [
      {
        name: "old_id_card_photo.jpg",
        url: "https://example.com/uploads/old_id_card_photo.jpg",
      },
      {
        name: "replacement_confirmation.pdf",
        url: "https://example.com/uploads/replacement_confirmation.pdf",
      },
    ],
  },

  {
    id: "#1005",
    subject: "AC Leaking in Room 302",
    category: "Facilities",
    date: "2024-11-01T11:27:59.300Z",
    status: "Resolved",
    description:
      "Water leakage was observed from the air conditioning unit installed in Room 302. The leakage resulted in water dripping onto desks and electrical sockets, posing both safety and equipment damage risks. The issue was reported after multiple complaints from students attending lectures in the room. Maintenance inspection revealed a clogged drainage pipe and improper insulation around the AC unit. The drainage system was cleaned, insulation replaced, and the unit was tested for continuous operation. Post-repair checks confirmed no further leakage. Preventive maintenance has been scheduled to avoid recurrence.",
    attachments: [
      {
        name: "ac_leak_photo.jpg",
        url: "https://example.com/uploads/ac_leak_photo.jpg",
      },
    ],
  },

  {
    id: "#1042",
    subject: "Portal access attempt",
    category: "IT Security",
    date: "2024-10-21T06:45:18.640Z",
    status: "Open",
    description:
      "Multiple suspicious login attempts were detected on the institutional portal originating from unknown IP addresses. The attempts targeted several user accounts and triggered security alerts due to repeated failures. While no data breach has been confirmed, this incident raises concerns about brute force attacks or credential stuffing attempts. Immediate steps were taken to lock affected accounts and enforce password resets. A detailed security audit is required to analyze logs, identify the source of the attempts, and strengthen authentication measures such as rate limiting and multi-factor authentication.",
    attachments: [
      {
        name: "security_log_extract.txt",
        url: "https://example.com/uploads/security_log_extract.txt",
      },
    ],
  },

  {
    id: "#1016",
    subject: "CCTV not working",
    category: "Security",
    date: "2024-09-14T17:02:44.212Z",
    status: "Resolved",
    description:
      "One of the CCTV cameras installed near the main corridor was found to be non-functional. The camera feed was unavailable, creating a blind spot in a high-traffic area. After investigation, the issue was traced to a faulty power adapter. The adapter was replaced, camera firmware updated, and feed restored successfully. Monitoring has resumed and the issue has been marked resolved.",
    attachments: [
      {
        name: "cctv_camera_photo.jpg",
        url: "https://example.com/uploads/cctv_camera_photo.jpg",
      },
    ],
  },

  {
    id: "#1057",
    subject: "Power voltage",
    category: "Electrical",
    date: "2024-11-03T12:19:09.531Z",
    status: "In Progress",
    description:
      "Irregular voltage fluctuations have been reported in multiple classrooms and labs. These fluctuations are causing frequent shutdowns of computers, projectors, and sensitive lab equipment. The issue appears sporadic but has increased in frequency over the past month. Electrical inspections suggest instability in the main supply line or transformer. Temporary stabilizers have been deployed, but a permanent solution is required to prevent equipment damage and ensure safety.",
    attachments: [
      {
        name: "voltage_readings.csv",
        url: "https://example.com/uploads/voltage_readings.csv",
      },
    ],
  },

  {
    id: "#1009",
    subject: "Fire alarm issue",
    category: "Safety",
    date: "2024-08-27T04:36:51.998Z",
    status: "Resolved",
    description:
      "The fire alarm system was triggering false alerts during non-emergency situations, causing panic and unnecessary evacuations. A thorough inspection revealed a faulty smoke sensor that was overly sensitive to dust. The sensor was replaced and recalibrated. Multiple test drills were conducted to confirm normal operation. The fire safety system is now functioning correctly.",
    attachments: [
      {
        name: "fire_alarm_test_report.pdf",
        url: "https://example.com/uploads/fire_alarm_test_report.pdf",
      },
    ],
  },
];

export const PROJECTS = [
  {
    id: 1,
    title: "Q4 Marketing Plan",
    department: "Marketing Dept.",
    priority: "Completed",
    progress: 100,
    dueDate: "2025-11-01T00:00:00.000Z",
    avatars: [
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    ],
  },
  {
    id: 2,
    title: "Website Redesign",
    department: "UI/UX Team",
    priority: "Ongoing",
    progress: 40,
    dueDate: "2025-11-05T00:00:00.000Z",
    avatars: [
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    ],
  },
  {
    id: 3,
    title: "Mobile App MVP",
    department: "Product Team",
    priority: "Critical",
    progress: 65,
    dueDate: "2025-11-10T00:00:00.000Z",
    avatars: [
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    ],
  },
  {
    id: 4,
    title: "SEO Optimization",
    department: "Growth Team",
    priority: "Ongoing",
    progress: 55,
    dueDate: "2025-11-12T00:00:00.000Z",
    avatars: [
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    ],
  },
  {
    id: 5,
    title: "Customer Feedback Review",
    department: "Support Team",
    priority: "Completed",
    progress: 100,
    dueDate: "2025-11-15T00:00:00.000Z",
    avatars: [
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    ],
  },
  {
    id: 6,
    title: "Backend API Refactor",
    department: "Engineering",
    priority: "On Hold",
    progress: 20,
    dueDate: "2025-11-18T00:00:00.000Z",
    avatars: [
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
    ],
  },
  {
    id: 7,
    title: "Sales Funnel Analysis",
    department: "Sales Team",
    priority: "Ongoing",
    progress: 45,
    dueDate: "2025-11-20T00:00:00.000Z",
    avatars: [
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    ],
  },
  {
    id: 8,
    title: "Cloud Cost Optimization",
    department: "DevOps",
    priority: "Critical",
    progress: 70,
    dueDate: "2025-11-25T00:00:00.000Z",
    avatars: [
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    ],
  },
];

export const leaveHistory = [
  {
    startDate: "2025-12-15T00:00:00.000Z",
    endDate: "2025-12-18T00:00:00.000Z",
    type: "Casual",
    reason: "Semester Exams",
    status: "Approved",
  },
  {
    startDate: "2025-10-01T00:00:00.000Z",
    endDate: "2025-10-02T00:00:00.000Z",
    type: "Sick",
    reason: "High Fever",
    status: "Pending",
  },
  {
    startDate: "2025-09-15T00:00:00.000Z",
    endDate: "2025-09-16T00:00:00.000Z",
    type: "Casual",
    reason: "Family Event",
    status: "Approved",
  },
  {
    startDate: "2025-12-20T00:00:00.000Z",
    endDate: "2025-12-22T00:00:00.000Z",
    type: "Earned",
    reason: "Planned Vacation",
    status: "Approved",
  },
  {
    startDate: "2026-01-10T00:00:00.000Z",
    endDate: "2026-01-10T00:00:00.000Z",
    type: "Casual",
    reason: "Official Documentation Work",
    status: "Rejected",
  },
  {
    startDate: "2025-10-08T00:00:00.000Z",
    endDate: "2025-10-08T00:00:00.000Z",
    type: "Casual",
    reason: "Client Appointment",
    status: "Approved",
  },
  {
    startDate: "2025-11-25T00:00:00.000Z",
    endDate: "2025-11-25T00:00:00.000Z",
    type: "Casual",
    reason: "Home Maintenance Work",
    status: "Pending",
  },
  {
    startDate: "2025-11-15T00:00:00.000Z",
    endDate: "2025-11-16T00:00:00.000Z",
    type: "Earned",
    reason: "Personal Skill Development Program",
    status: "Approved",
  },
  {
    startDate: "2025-11-05T00:00:00.000Z",
    endDate: "2025-11-05T00:00:00.000Z",
    type: "Casual",
    reason: "Examination Attendance",
    status: "Rejected",
  },
  {
    startDate: "2025-08-12T00:00:00.000Z",
    endDate: "2025-08-13T00:00:00.000Z",
    type: "Sick",
    reason: "Food Poisoning",
    status: "Approved",
  },
  {
    startDate: "2025-07-20T00:00:00.000Z",
    endDate: "2025-07-22T00:00:00.000Z",
    type: "Casual",
    reason: "Outstation Travel",
    status: "Approved",
  },
  {
    startDate: "2025-06-05T00:00:00.000Z",
    endDate: "2025-06-05T00:00:00.000Z",
    type: "Earned",
    reason: "Personal Work",
    status: "Pending",
  },
];

export const dummyNotifications = [
  { id: 1, text: "Complaint #1101 has been resolved", time: "2 hours ago" },
  {
    id: 2,
    text: "New notice posted: Final Exam Schedule",
    time: "5 hours ago",
  },
  { id: 3, text: "Admin replied to ticket #1019", time: "1 day ago" },
  { id: 4, text: "New event added to calendar", time: "2 days ago" },
  { id: 5, text: "Profile updated successfully", time: "3 days ago" },
];

export const notificationsList = [
  {
    id: 1,
    category: "GENERAL",
    title: "New Member recruited in the Team",
    date: "2023-05-07T00:00:00.000Z",
    type: "info",
    status: "Yes",
  },
  {
    id: 2,
    category: "ACADEMIC",
    title: "Final Exam Schedule Update",
    date: "2023-12-13T00:00:00.000Z",
    type: "academic",
    status: "No",
  },
  {
    id: 3,
    category: "GENERAL",
    title: "Holiday Announcement: Winter Break",
    date: "2023-12-10T00:00:00.000Z",
    type: "info",
    status: "Yes",
  },
  {
    id: 4,
    category: "IT",
    title: "System Maintenance Scheduled",
    date: "2023-12-08T00:00:00.000Z",
    type: "system",
    status: "No",
  },
  {
    id: 5,
    category: "FACILITY",
    title: "Library Hours Extension",
    date: "2023-12-05T00:00:00.000Z",
    type: "facility",
    status: "Yes",
  },
  {
    id: 6,
    category: "IT",
    title: "Project Completion Notice",
    date: "2023-12-11T00:00:00.000Z",
    type: "system",
    status: "Yes",
  },
  {
    id: 7,
    category: "GENERAL",
    title: "New Brand Opening",
    date: "2023-02-06T00:00:00.000Z",
    type: "info",
    status: "No",
  },
  {
    id: 8,
    category: "ACADEMIC",
    title: "Semester Registration Deadline Extended",
    date: "2024-01-05T00:00:00.000Z",
    type: "academic",
    status: "Yes",
  },
  {
    id: 9,
    category: "IT",
    title: "Portal Downtime Resolved",
    date: "2024-01-12T00:00:00.000Z",
    type: "system",
    status: "Yes",
  },
  {
    id: 10,
    category: "FACILITY",
    title: "New Parking Area Opened",
    date: "2024-01-18T00:00:00.000Z",
    type: "facility",
    status: "No",
  },
  {
    id: 11,
    category: "GENERAL",
    title: "Annual Sports Meet Announcement",
    date: "2024-02-01T00:00:00.000Z",
    type: "info",
    status: "Yes",
  },
  {
    id: 12,
    category: "ACADEMIC",
    title: "Results Published for Semester Exams",
    date: "2024-02-10T00:00:00.000Z",
    type: "academic",
    status: "No",
  },
];

export const reportsList = [
  {
    id: "r1",
    name: "Q4_Financial_Report",
    type: "PDF",
    version: "v3.2",
    lastModified: "2023-07-25T10:45:12.234Z",
    status: "Final",
    icon: "pdf",
  },
  {
    id: "r2",
    name: "Project_Alpha_budget",
    type: "XLS",
    version: "v1.5",
    lastModified: "2023-12-13T08:20:45.981Z",
    status: "Draft",
    icon: "xls",
  },
  {
    id: "r3",
    name: "Board_meeting_minutes",
    type: "DOC",
    version: "v2.1",
    lastModified: "2023-12-10T15:12:09.420Z",
    status: "Revised",
    icon: "doc",
  },
  {
    id: "r4",
    name: "Safety_protocol_2025",
    type: "PDF",
    version: "v1.0",
    lastModified: "2023-12-08T11:02:33.110Z",
    status: "Final",
    icon: "pdf",
  },
  {
    id: "r5",
    name: "Marketing_Asset_Q1",
    type: "ZIP",
    version: "v1.0",
    lastModified: "2023-12-05T09:55:01.876Z",
    status: "Final",
    icon: "zip",
  },

  // ➕ More realistic backend-style data
  {
    id: "r6",
    name: "Employee_Handbook",
    type: "PDF",
    version: "v4.0",
    lastModified: "2023-11-22T13:30:44.654Z",
    status: "Final",
    icon: "pdf",
  },
  {
    id: "r7",
    name: "Website_Redesign_Plan",
    type: "DOC",
    version: "v2.3",
    lastModified: "2023-11-18T17:45:20.331Z",
    status: "Revised",
    icon: "doc",
  },
  {
    id: "r8",
    name: "Sales_Data_Q3",
    type: "XLS",
    version: "v1.8",
    lastModified: "2023-10-30T06:18:59.902Z",
    status: "Draft",
    icon: "xls",
  },
  {
    id: "r9",
    name: "Product_Launch_Assets",
    type: "ZIP",
    version: "v2.0",
    lastModified: "2023-10-21T14:10:11.087Z",
    status: "Final",
    icon: "zip",
  },
  {
    id: "r10",
    name: "Client_Contract_Template",
    type: "DOC",
    version: "v3.1",
    lastModified: "2023-09-14T12:00:00.000Z",
    status: "Final",
    icon: "doc",
  },
  {
    id: "r11",
    name: "HR_Policies_Update",
    type: "PDF",
    version: "v1.2",
    lastModified: "2024-01-05T09:40:28.540Z",
    status: "Revised",
    icon: "pdf",
  },
  {
    id: "r12",
    name: "Annual_Budget_2024",
    type: "XLS",
    version: "v2.0",
    lastModified: "2024-01-12T07:15:10.199Z",
    status: "Draft",
    icon: "xls",
  },
];

export const TASK_STATUS = [
  { id: "todo", label: "To Do", count: 6, color: "#E2E8F0" },
  { id: "progress", label: "In Progress", count: 8, color: "#1877F2" },
  { id: "blocked", label: "Blocked", count: 4, color: "#EF4444" },
  { id: "done", label: "Done", count: 6, color: "#22C55E" },
];

export const ANALYTICS_TASK_STATUS = [
  { id: "done", label: "Done", count: "45%", color: "#22C55E" },
  { id: "progress", label: "In Progress", count: "20%", color: "#137FEC" },
  { id: "todo", label: "To Do", count: "28%", color: "#FACC15" },
  { id: "blocked", label: "Blocked", count: "7%", color: "#EF4444" },
];

export const PARTICIPANTS = [
  { id: 1, name: "John Dev", initial: "J", color: "#C94A5C", isHost: true },
  { id: 2, name: "Karthik S", initial: "K", color: "#10B981" },
  { id: 3, name: "Lavanya K", initial: "L", color: "#D9923F" },
  { id: 4, name: "Diya P", initial: "D", color: "#B91C1C" },
  { id: 5, name: "Aarav M", initial: "A", color: "#8B5CF6" },
  { id: 6, name: "Diya P", initial: "D", color: "#B23939" },
  { id: 7, name: "Rahul T", initial: "R", color: "#5B6FC7" },
  { id: 8, name: "Aarav M", initial: "A", color: "#059669" },
  { id: 9, name: "Sneha R", initial: "S", color: "#16A34A" },
  { id: 10, name: "Vikram J", initial: "V", color: "#C77D3F" },
  { id: 11, name: "Ananya L", initial: "A", color: "#14B8A6" },
  { id: 12, name: "Aarav M", initial: "A", color: "#8B5CF6" },
  { id: 13, name: "Vikram J", initial: "V", color: "#C77D3F" },
  { id: 14, name: "Ananya L", initial: "A", color: "#14B8A6" },
  { id: 15, name: "Ananya L", initial: "A", color: "#14B8A6" },
];

export const calculateLayout = ({
  setGridLayout,
  gridRef,
  participants,
  perPage,
  setPerPage,
  setPages,
  setCurrentPage,
  currentPage,
}) => {
  if (!gridRef?.current) return;

  const width = gridRef?.current.clientWidth;
  const total = participants.length;

  if (width < 768) {
    setPerPage(8);

    const totalPages = Math.ceil(total / perPage);
    setPages(totalPages);

    // prevent overflow page
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
      return;
    }

    const remaining = total - currentPage * perPage;
    const currentCount = Math.min(8, remaining);

    let cols = 1;
    let rows = 1;

    switch (currentCount) {
      case 8:
      case 7:
        cols = 2;
        rows = 4;
        break;
      case 6:
        cols = 2;
        rows = 3;
        break;
      case 5:
        cols = 2;
        rows = 3;
        break;
      case 4:
        cols = 2;
        rows = 2;
        break;
      case 3:
        cols = 1;
        rows = 3;
        break;
      case 2:
        cols = 1;
        rows = 2;
        break;
      case 1:
        cols = 1;
        rows = 1;
        break;
      default:
        cols = 1;
        rows = 1;
    }

    setGridLayout({
      cols,
      rows,
      cardWidth: 0,
      cardHeight: 0,
    });
  } else if (width >= 768 && width < 1280) {
    setPerPage(9);

    const totalPages = Math.ceil(total / 9);
    setPages(totalPages);

    // prevent overflow page
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
      return;
    }

    const remaining = total - currentPage * 9;
    const currentCount = Math.min(9, remaining);

    let cols = 1;
    let rows = 1;

    switch (currentCount) {
      case 9:
        cols = 3;
        rows = 3;
        break;

      case 8:
      case 7:
        cols = 3;
        rows = 3;
        break;

      case 6:
        cols = 2;
        rows = 3;
        break;

      case 5:
        cols = 2;
        rows = 3;
        break;

      case 4:
        cols = 2;
        rows = 2;
        break;

      case 3:
        cols = 2;
        rows = 3;
        break;

      case 2:
        cols = 2;
        rows = 1;
        break;

      case 1:
        cols = 1;
        rows = 1;
        break;

      default:
        cols = 1;
        rows = 1;
    }

    setGridLayout({
      cols,
      rows,
      cardWidth: 0,
      cardHeight: 0,
    });
  } else if (width >= 1024) {
    setPerPage(12);

    const totalPages = Math.ceil(total / 12);
    setPages(totalPages);

    // prevent overflow page
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
      return;
    }

    const remaining = total - currentPage * 12;
    const currentCount = Math.min(12, remaining);

    let cols = 1;
    let rows = 1;

    switch (currentCount) {
      case 12:
        cols = 4;
        rows = 3;
        break;

      case 11:
      case 10:
      case 9:
        cols = 4;
        rows = 3;
        break;

      case 8:
      case 7:
        cols = 4;
        rows = 2;
        break;

      case 6:
      case 5:
        cols = 3;
        rows = 2;
        break;

      case 4:
        cols = 2;
        rows = 2;
        break;

      case 3:
        cols = 2;
        rows = 3;
        break;

      case 2:
        cols = 2;
        rows = 1;
        break;

      case 1:
        cols = 1;
        rows = 1;
        break;

      default:
        cols = 1;
        rows = 1;
    }

    setGridLayout({
      cols,
      rows,
      cardWidth: 0,
      cardHeight: 0,
    });
  }
};
