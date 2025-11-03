// Mock AI-related data used across admin components
export const mockAITickets = [
  {
    id: "1",
    ticketId: "TCK-2025-0123",
    title: "Medical assistance request",
    memberPseudonym: "member-1973-ALU",
    memberName: "Maria Santos",
    type: "Medical Assistance",
    category: "Emergency Medical",
    priority: "High",
    status: "auto-assigned",
    redactedDescription:
      "Patient [REDACTED: NAME] requests financial aid for hospitalization. Emergency surgery required for [REDACTED: MEDICAL_CONDITION]. Total cost estimated at ₱85,000. Member has been with company for 3 years and is in good standing.",
    description:
      "Patient Maria Santos requests financial aid for hospitalization. Emergency surgery required for appendicitis. Total cost estimated at ₱85,000. Member has been with company for 3 years and is in good standing.",
    submittedDate: "2025-09-29T08:30:00Z",
    assignedTo: "Medical Team",
    suggestion: {
      category: "Medical Assistance",
      priority: "High",
      suggestedAssignee: "Medical Team",
      confidence: 0.91,
      explanation: "Member reports hospitalization costs; qualifies under medical aid.",
      detailedReasoning: {
        factors: [
          "Medical emergency classification",
          "Member in good standing",
          "Cost within medical assistance limits",
          "Supporting documentation provided",
        ],
        riskFactors: [],
        recommendation: "Approve for medical assistance program",
      },
      extractedEntities: [
        { type: "amount", value: "₱85,000" },
        { type: "medical_condition", value: "Emergency surgery" },
        { type: "member_tenure", value: "3 years" },
      ],
    },
    redactionSummary: {
      names: 1,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-1",
        name: "medical_estimate.pdf",
        thumbnailUrl: "/placeholder-doc.png",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
  },
  {
    id: "2",
    ticketId: "TCK-2025-0124",
    title: "Legal consultation needed",
    memberPseudonym: "member-2841-ALU",
    memberName: "Pedro Reyes",
    type: "Legal Consultation",
    category: "Labor Dispute",
    priority: "Critical",
    status: "needs-assignment",
    redactedDescription:
      "Member [REDACTED: NAME] reports wrongful termination by employer [REDACTED: COMPANY]. Seeking legal representation for case against [REDACTED: COMPANY] located at [REDACTED: ADDRESS]. Termination occurred on September 15, 2025 without proper notice.",
    description:
      "Member Pedro Reyes reports wrongful termination by employer ABC Manufacturing. Seeking legal representation for case against ABC Manufacturing located at 123 Industrial St, Quezon City. Termination occurred on September 15, 2025 without proper notice.",
    submittedDate: "2025-09-29T09:15:00Z",
    suggestion: {
      category: "Labor Dispute",
      priority: "Critical",
      suggestedAssignee: "Legal Team",
      confidence: 0.73,
      explanation: "Wrongful termination case requires immediate legal review.",
      detailedReasoning: {
        factors: [
          "Labor law violation reported",
          "Urgent timeline for legal action",
          "Member requires representation",
        ],
        riskFactors: [
          "Complex employment law case",
          "Requires specialized legal expertise",
        ],
        recommendation: "Assign to senior legal counsel for review",
      },
      extractedEntities: [
        { type: "date", value: "September 15, 2025" },
        { type: "issue_type", value: "Wrongful termination" },
        { type: "company", value: "[REDACTED]" },
      ],
    },
    redactionSummary: {
      names: 1,
      ids: 0,
      addresses: 1,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-2",
        name: "termination_letter.pdf",
        redacted: true,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: true,
  },
  {
    id: "3",
    ticketId: "TCK-2025-0125",
    title: "Educational scholarship application",
    memberPseudonym: "member-4567-ALU",
    memberName: "Juan dela Cruz",
    type: "Educational Scholarship",
    category: "Child Education",
    priority: "Normal",
    status: "in-progress",
    redactedDescription:
      "Member [REDACTED: NAME] applying for educational scholarship for child. Child will be enrolled in Computer Science program at [REDACTED: UNIVERSITY]. Total tuition cost for academic year 2025-2026 is ₱120,000.",
    description:
      "Member Juan dela Cruz applying for educational scholarship for child. Child will be enrolled in Computer Science program at University of the Philippines. Total tuition cost for academic year 2025-2026 is ₱120,000.",
    submittedDate: "2025-09-29T10:00:00Z",
    suggestion: {
      category: "Educational Scholarship",
      priority: "Normal",
      suggestedAssignee: "Education Team",
      confidence: 0.89,
      explanation:
        "Standard educational scholarship application meets all criteria.",
      detailedReasoning: {
        factors: [
          "Member meets tenure requirements",
          "Academic program qualifies for scholarship",
          "Documentation complete",
          "Cost within scholarship limits",
        ],
        riskFactors: [],
        recommendation: "Process under standard educational assistance program",
      },
      extractedEntities: [
        { type: "amount", value: "₱120,000" },
        { type: "program", value: "Computer Science" },
        { type: "academic_year", value: "2025-2026" },
      ],
    },
    redactionSummary: {
      names: 1,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-3",
        name: "enrollment_form.pdf",
        redacted: false,
      },
      {
        id: "att-4",
        name: "academic_records.pdf",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
  },
  {
    id: "4",
    ticketId: "TCK-2025-0126",
    title: "How to update member information",
    memberPseudonym: "member-5678-ALU",
    memberName: "Ana Cruz",
    type: "General Inquiry",
    category: "FAQ",
    priority: "Low",
    status: "auto-resolved",
    redactedDescription:
      "Member asking how to update personal information in the system. Standard FAQ question.",
    description:
      "Member asking how to update personal information in the system. Standard FAQ question.",
    submittedDate: "2025-10-01T08:20:00Z",
    assignedTo: "Auto-Response System",
    suggestion: {
      category: "FAQ",
      priority: "Low",
      suggestedAssignee: "Auto-Response System",
      confidence: 0.95,
      explanation: "Common FAQ detected, auto-resolved with standard response.",
      detailedReasoning: {
        factors: [
          "Question matches FAQ database",
          "Standard member information inquiry",
          "No complex issues detected",
        ],
        riskFactors: [],
        recommendation: "Auto-respond with standard FAQ answer",
      },
      extractedEntities: [
        { type: "inquiry_type", value: "Member information update" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
  },
  {
    id: "5",
    ticketId: "TCK-2025-0127",
    title: "Payroll deduction setup",
    memberPseudonym: "member-7890-ALU",
    memberName: "Roberto Silva",
    type: "Finance Inquiry",
    category: "Dues Payment",
    priority: "Normal",
    status: "auto-assigned",
    redactedDescription:
      "Member requesting setup of automatic payroll deduction for union dues. Works at SM Makati branch.",
    description:
      "Member requesting setup of automatic payroll deduction for union dues. Works at SM Makati branch.",
    submittedDate: "2025-10-01T10:45:00Z",
    assignedTo: "Finance Team",
    suggestion: {
      category: "Dues Payment",
      priority: "Normal",
      suggestedAssignee: "Finance Team",
      confidence: 0.88,
      explanation:
        "Payroll deduction request automatically routed to finance department.",
      detailedReasoning: {
        factors: [
          "Payroll deduction request",
          "Standard finance procedure",
          "Member in good standing",
        ],
        riskFactors: [],
        recommendation: "Assign to finance team for payroll setup",
      },
      extractedEntities: [
        { type: "company", value: "SM Makati" },
        { type: "request_type", value: "Payroll deduction" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
  },
  {
    id: "6",
    ticketId: "TCK-2025-0128",
    title: "Workplace harassment complaint",
    memberPseudonym: "member-3456-ALU",
    memberName: "Carmen Santos",
    type: "Legal Consultation",
    category: "Workplace Issues",
    priority: "High",
    status: "needs-assignment",
    redactedDescription:
      "Member reports ongoing workplace harassment by supervisor. Unsure if this should go to legal team or HR department. Complex situation involving multiple parties.",
    description:
      "Member reports ongoing workplace harassment by supervisor. Unsure if this should go to legal team or HR department. Complex situation involving multiple parties.",
    submittedDate: "2025-10-01T14:20:00Z",
    suggestion: {
      category: "Workplace Issues",
      priority: "High",
      suggestedAssignee: "Needs Review",
      confidence: 0.45,
      explanation:
        "Complex case involving both legal and HR aspects. Manual assignment required.",
      detailedReasoning: {
        factors: [
          "Workplace harassment reported",
          "Multiple departments potentially involved",
          "High priority case",
        ],
        riskFactors: [
          "Legal implications unclear",
          "May require specialist handling",
          "Sensitive HR matter",
        ],
        recommendation:
          "Manual review required to determine appropriate department",
      },
      extractedEntities: [
        { type: "issue_type", value: "Workplace harassment" },
        { type: "urgency", value: "High" },
      ],
    },
    redactionSummary: {
      names: 1,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-5",
        name: "incident_report.pdf",
        redacted: true,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: true,
  },
  {
    id: "7",
    ticketId: "TCK-2025-0129",
    title: "Emergency financial assistance",
    memberPseudonym: "member-2468-ALU",
    memberName: "Jose Rodriguez",
    type: "Emergency Support",
    category: "Financial Emergency",
    priority: "Critical",
    status: "in-progress",
    redactedDescription:
      "Member lost job due to company downsizing. Requesting emergency financial assistance for basic needs. Case currently being evaluated by assistance team.",
    description:
      "Member lost job due to company downsizing. Requesting emergency financial assistance for basic needs. Case currently being evaluated by assistance team.",
    submittedDate: "2025-09-30T16:30:00Z",
    assignedTo: "Emergency Team",
    suggestion: {
      category: "Financial Emergency",
      priority: "Critical",
      suggestedAssignee: "Emergency Team",
      confidence: 0.92,
      explanation: "Emergency support case requiring immediate attention.",
      detailedReasoning: {
        factors: [
          "Job loss reported",
          "Emergency financial need",
          "Member in good standing",
        ],
        riskFactors: [],
        recommendation: "Fast-track emergency assistance evaluation",
      },
      extractedEntities: [
        { type: "emergency_type", value: "Job loss" },
        { type: "assistance_type", value: "Financial support" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-6",
        name: "termination_letter.pdf",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
  },
  {
    id: "8",
    ticketId: "TCK-2025-0130",
    title: "Educational scholarship approved",
    memberPseudonym: "member-1357-ALU",
    memberName: "Lisa Mendoza",
    type: "Educational Scholarship",
    category: "Scholarship Approval",
    priority: "Normal",
    status: "resolved",
    redactedDescription:
      "Scholarship application approved. Payment processed. Case closed with member notification sent.",
    description:
      "Scholarship application approved. Payment processed. Case closed with member notification sent.",
    submittedDate: "2025-09-28T11:00:00Z",
    assignedTo: "Education Team",
    suggestion: {
      category: "Scholarship Approval",
      priority: "Normal",
      suggestedAssignee: "Education Team",
      confidence: 0.91,
      explanation: "Standard scholarship processing completed successfully.",
      detailedReasoning: {
        factors: [
          "Scholarship criteria met",
          "Documentation complete",
          "Payment processed",
        ],
        riskFactors: [],
        recommendation: "Case successfully resolved",
      },
      extractedEntities: [
        { type: "scholarship_type", value: "Educational assistance" },
        { type: "status", value: "Approved" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-7",
        name: "approval_letter.pdf",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
  },
  {
    id: "9",
    ticketId: "TCK-2025-0131",
    title: "Password reset request",
    memberPseudonym: "member-9876-ALU",
    memberName: "Mark Garcia",
    type: "Technical Support",
    category: "Account Access",
    priority: "Low",
    status: "auto-resolved",
    redactedDescription:
      "Member forgot password and needs reset link. Automated system sent reset instructions via email.",
    description:
      "Member forgot password and needs reset link. Automated system sent reset instructions via email.",
    submittedDate: "2025-10-01T09:15:00Z",
    assignedTo: "Auto-Response System",
    suggestion: {
      category: "Account Access",
      priority: "Low",
      suggestedAssignee: "Auto-Response System",
      confidence: 0.98,
      explanation: "Standard password reset handled automatically.",
      detailedReasoning: {
        factors: [
          "Standard password reset request",
          "Automated system capability",
          "Security protocols followed",
        ],
        riskFactors: [],
        recommendation: "Auto-resolve with password reset link",
      },
      extractedEntities: [
        { type: "request_type", value: "Password reset" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
  },
  {
    id: "10",
    ticketId: "TCK-2025-0132",
    title: "Dental assistance request",
    memberPseudonym: "member-4680-ALU",
    memberName: "Sarah Lopez",
    type: "Medical Assistance",
    category: "Dental Care",
    priority: "Normal",
    status: "auto-assigned",
    redactedDescription:
      "Member requesting dental assistance for root canal treatment. Estimated cost ₱15,000. Member has qualifying coverage.",
    description:
      "Member requesting dental assistance for root canal treatment. Estimated cost ₱15,000. Member has qualifying coverage.",
    submittedDate: "2025-10-01T13:45:00Z",
    assignedTo: "Medical Team",
    suggestion: {
      category: "Dental Care",
      priority: "Normal",
      suggestedAssignee: "Medical Team",
      confidence: 0.89,
      explanation: "Dental assistance request within coverage limits.",
      detailedReasoning: {
        factors: [
          "Dental treatment need",
          "Cost within limits",
          "Member has coverage",
        ],
        riskFactors: [],
        recommendation: "Process under dental assistance program",
      },
      extractedEntities: [
        { type: "treatment_type", value: "Root canal" },
        { type: "amount", value: "₱15,000" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-8",
        name: "dental_quote.pdf",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
  },
  {
    id: "11",
    ticketId: "TCK-2025-0133",
    title: "Complex benefits inquiry",
    memberPseudonym: "member-1122-ALU",
    memberName: "David Reyes",
    type: "Benefits Inquiry",
    category: "Multiple Benefits",
    priority: "Normal",
    status: "needs-assignment",
    redactedDescription:
      "Member asking about eligibility for multiple benefits including medical, educational, and housing assistance. Complex multi-department case.",
    description:
      "Member asking about eligibility for multiple benefits including medical, educational, and housing assistance. Complex multi-department case.",
    submittedDate: "2025-10-01T15:30:00Z",
    suggestion: {
      category: "Multiple Benefits",
      priority: "Normal",
      suggestedAssignee: "Needs Review",
      confidence: 0.52,
      explanation: "Multi-department inquiry requiring coordination between teams.",
      detailedReasoning: {
        factors: [
          "Multiple benefit types involved",
          "Requires coordination",
          "Complex eligibility assessment needed",
        ],
        riskFactors: [
          "Multiple departments involved",
          "Potential benefit conflicts",
          "Complex evaluation required",
        ],
        recommendation: "Manual assignment to appropriate coordinator",
      },
      extractedEntities: [
        { type: "benefit_types", value: "Medical, Educational, Housing" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
  },
  {
    id: "12",
    ticketId: "TCK-2025-0134",
    title: "Bereavement assistance completed",
    memberPseudonym: "member-8899-ALU",
    memberName: "Elena Torres",
    type: "Bereavement Support",
    category: "Death Benefit",
    priority: "High",
    status: "resolved",
    redactedDescription:
      "Bereavement assistance processed for member. ₱25,000 death benefit paid. Documentation filed and case closed.",
    description:
      "Bereavement assistance processed for member. ₱25,000 death benefit paid. Documentation filed and case closed.",
    submittedDate: "2025-09-25T14:20:00Z",
    assignedTo: "Benefits Team",
    suggestion: {
      category: "Death Benefit",
      priority: "High",
      suggestedAssignee: "Benefits Team",
      confidence: 0.94,
      explanation: "Bereavement support case successfully processed.",
      detailedReasoning: {
        factors: [
          "Death benefit claim validated",
          "Payment processed",
          "Documentation complete",
        ],
        riskFactors: [],
        recommendation: "Case resolved successfully",
      },
      extractedEntities: [
        { type: "benefit_amount", value: "₱25,000" },
        { type: "benefit_type", value: "Death benefit" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-9",
        name: "death_certificate.pdf",
        redacted: true,
      },
      {
        id: "att-10",
        name: "payment_confirmation.pdf",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: true,
  },
  {
    id: "13",
    ticketId: "TCK-2025-0135",
    title: "FAQ: What are union benefits?",
    memberPseudonym: "member-5432-ALU",
    memberName: "Grace Chen",
    type: "General Inquiry",
    category: "FAQ",
    priority: "Low",
    status: "auto-resolved",
    redactedDescription:
      "Member asking about union benefits and eligibility requirements.",
    description:
      "Member asking about union benefits and eligibility requirements.",
    submittedDate: "2025-10-01T11:30:00Z",
    assignedTo: "Auto-Response System",
    suggestion: {
      category: "FAQ",
      priority: "Low",
      suggestedAssignee: "Auto-Response System",
      confidence: 0.97,
      explanation:
        "Standard FAQ about union benefits automatically resolved.",
      detailedReasoning: {
        factors: [
          "FAQ question detected",
          "Standard benefits inquiry",
          "Complete information available",
        ],
        riskFactors: [],
        recommendation: "Auto-respond with benefits overview",
      },
      extractedEntities: [
        { type: "inquiry_type", value: "Union benefits" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
    aiResponse:
      "Dear Grace, thank you for your inquiry about union benefits. As a TUCP ALU member, you have access to: 1) Medical assistance up to ₱100,000 annually, 2) Educational scholarships for children, 3) Emergency financial support, 4) Legal consultation services, 5) Death and disability benefits. To apply for any benefit, please log into your member portal or visit our office with required documents. For specific eligibility requirements, please refer to your member handbook or contact our benefits department directly.",
  },
  {
    id: "14",
    ticketId: "TCK-2025-0136",
    title: "Lost membership card replacement",
    memberPseudonym: "member-6789-ALU",
    memberName: "Thomas Wilson",
    type: "Administrative Request",
    category: "Card Replacement",
    priority: "Low",
    status: "auto-resolved",
    redactedDescription:
      "Member lost physical membership card and needs replacement.",
    description:
      "Member lost physical membership card and needs replacement.",
    submittedDate: "2025-10-01T14:15:00Z",
    assignedTo: "Auto-Response System",
    suggestion: {
      category: "Card Replacement",
      priority: "Low",
      suggestedAssignee: "Auto-Response System",
      confidence: 0.94,
      explanation: "Standard card replacement request handled automatically.",
      detailedReasoning: {
        factors: [
          "Lost card replacement",
          "Standard administrative process",
          "Clear procedure available",
        ],
        riskFactors: [],
        recommendation: "Auto-respond with replacement process",
      },
      extractedEntities: [
        { type: "request_type", value: "Card replacement" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
    aiResponse:
      "Dear Thomas, we can help you replace your lost membership card. The replacement fee is ₱150. Please visit our office with: 1) Valid government ID, 2) Affidavit of loss (notarized), 3) Payment for replacement fee. Processing takes 3-5 business days. You can also request an expedited replacement (2 days) for an additional ₱50. Your digital membership ID remains active and can be accessed through our mobile app.",
  },
  {
    id: "15",
    ticketId: "TCK-2025-0137",
    title: "Maternity benefit application",
    memberPseudonym: "member-8765-ALU",
    memberName: "Maria Santos",
    type: "Medical Assistance",
    category: "Maternity Benefits",
    priority: "Normal",
    status: "auto-assigned",
    redactedDescription:
      "Member applying for maternity benefit. Due date in December 2025. First pregnancy.",
    description:
      "Member applying for maternity benefit. Due date in December 2025. First pregnancy.",
    submittedDate: "2025-10-01T16:45:00Z",
    assignedTo: "Medical Team",
    suggestion: {
      category: "Maternity Benefits",
      priority: "Normal",
      suggestedAssignee: "Medical Team",
      confidence: 0.91,
      explanation: "Maternity benefit application routed to medical team.",
      detailedReasoning: {
        factors: [
          "Maternity benefit request",
          "Medical team expertise",
          "Standard processing procedure",
        ],
        riskFactors: [],
        recommendation: "Route to medical team for processing",
      },
      extractedEntities: [
        { type: "benefit_type", value: "Maternity" },
        { type: "due_date", value: "December 2025" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-11",
        name: "prenatal_records.pdf",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
    aiDraft:
      "Dear Maria, your maternity benefit application has been received and assigned to our Medical Benefits Team. Based on your membership status and contribution history, you are eligible for our maternity assistance program. The benefit includes: 1) ₱25,000 delivery assistance, 2) ₱10,000 newborn care package, 3) Priority access to pediatric consultations. Please submit: birth certificate (after delivery), hospital bills, and medical records. Processing typically takes 5-7 business days after document submission.",
    suggestedResponse:
      "Congratulations on your upcoming addition to the family! Your application appears complete and you meet all eligibility requirements. We recommend scheduling a consultation with our benefits counselor to discuss the full range of maternal and child benefits available to you.",
  },
  {
    id: "16",
    ticketId: "TCK-2025-0138",
    title: "Vision care assistance",
    memberPseudonym: "member-4321-ALU",
    memberName: "Roberto Cruz",
    type: "Medical Assistance",
    category: "Vision Care",
    priority: "Normal",
    status: "auto-assigned",
    redactedDescription:
      "Member needs vision care assistance for prescription glasses. Ophthalmologist recommended new prescription.",
    description:
      "Member needs vision care assistance for prescription glasses. Ophthalmologist recommended new prescription.",
    submittedDate: "2025-10-01T12:20:00Z",
    assignedTo: "Medical Team",
    suggestion: {
      category: "Vision Care",
      priority: "Normal",
      suggestedAssignee: "Medical Team",
      confidence: 0.87,
      explanation: "Vision care request assigned to medical team.",
      detailedReasoning: {
        factors: [
          "Medical assistance request",
          "Vision care coverage available",
          "Standard medical team handling",
        ],
        riskFactors: [],
        recommendation: "Process under vision care benefit",
      },
      extractedEntities: [
        { type: "medical_type", value: "Vision care" },
        { type: "treatment", value: "Prescription glasses" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-12",
        name: "eye_exam_results.pdf",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
    aiDraft:
      "Dear Roberto, your vision care assistance request has been received. Our medical team will review your ophthalmologist report and prescription requirements. You are eligible for up to ₱8,000 annual vision care benefits, which covers: prescription glasses, contact lenses, or corrective surgery (partial). Please visit any of our partner optical shops or submit receipts for reimbursement within 30 days of purchase.",
    suggestedResponse:
      "Your vision care request is approved. Please proceed with getting your prescription glasses and submit the receipts for reimbursement. If you need recommendations for quality optical shops with good member discounts, our team can provide a list.",
  },
  {
    id: "17",
    ticketId: "TCK-2025-0139",
    title: "Multiple department query",
    memberPseudonym: "member-9988-ALU",
    memberName: "Angela Torres",
    type: "Complex Inquiry",
    category: "Multi-Department",
    priority: "Normal",
    status: "needs-assignment",
    redactedDescription:
      "Member asking about coordinating multiple benefits: medical for surgery, educational for child, and housing loan application. Complex multi-department coordination needed.",
    description:
      "Member asking about coordinating multiple benefits: medical for surgery, educational for child, and housing loan application. Complex multi-department coordination needed.",
    submittedDate: "2025-10-01T17:30:00Z",
    suggestion: {
      category: "Multi-Department",
      priority: "Normal",
      suggestedAssignee: "Needs Review",
      confidence: 0.48,
      explanation: "Complex multi-department coordination required.",
      detailedReasoning: {
        factors: [
          "Multiple benefit types requested",
          "Cross-department coordination needed",
          "Complex eligibility assessment",
        ],
        riskFactors: [
          "Benefit interaction conflicts possible",
          "Timeline coordination required",
          "Multiple approval processes",
        ],
        recommendation:
          "Assign to senior benefits coordinator for comprehensive review",
      },
      extractedEntities: [
        { type: "benefits", value: "Medical, Educational, Housing" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
    aiDraft:
      "Dear Angela, thank you for your comprehensive benefits inquiry. Your request involves multiple departments and requires coordination between medical, education, and housing teams. Given the complexity, we recommend scheduling a consultation with our senior benefits coordinator who can help you navigate all three applications simultaneously and ensure optimal timing and benefit maximization.",
    suggestedResponse:
      "This multi-faceted request requires careful coordination. I recommend assigning to our Benefits Coordination Specialist who can work with all three departments to create an integrated benefits plan for this member.",
  },
  {
    id: "18",
    ticketId: "TCK-2025-0140",
    title: "Employment termination support",
    memberPseudonym: "member-7654-ALU",
    memberName: "Carlos Mendoza",
    type: "Employment Support",
    category: "Termination Assistance",
    priority: "High",
    status: "needs-assignment",
    redactedDescription:
      "Member terminated from employment, unclear if termination was legal. Needs both legal consultation and emergency financial support.",
    description:
      "Member terminated from employment, unclear if termination was legal. Needs both legal consultation and emergency financial support.",
    submittedDate: "2025-10-01T18:45:00Z",
    suggestion: {
      category: "Termination Assistance",
      priority: "High",
      suggestedAssignee: "Needs Review",
      confidence: 0.42,
      explanation:
        "Complex case requiring both legal and financial support assessment.",
      detailedReasoning: {
        factors: [
          "Employment termination reported",
          "Legal issues possible",
          "Emergency support needed",
        ],
        riskFactors: [
          "Legal complexity unknown",
          "Urgent financial need",
          "Multiple department involvement",
        ],
        recommendation:
          "Manual assignment to determine primary department and escalation path",
      },
      extractedEntities: [
        { type: "issue_type", value: "Employment termination" },
        { type: "support_needed", value: "Legal and Financial" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-13",
        name: "termination_notice.pdf",
        redacted: true,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: true,
    aiDraft:
      "Dear Carlos, we understand you are facing employment termination and need support. This situation requires immediate attention from both our legal and emergency assistance teams. We will coordinate a response that addresses both your legal rights and immediate financial needs. Please expect contact from our legal department within 24 hours and emergency support team within 12 hours.",
    suggestedResponse:
      "This case requires urgent dual-department coordination. Recommend immediate assignment to Legal Department for termination review with concurrent Emergency Support team activation for financial assistance assessment. Member should receive support within 24 hours.",
  },
  {
    id: "19",
    ticketId: "TCK-2025-0141",
    title: "Surgery recovery assistance",
    memberPseudonym: "member-3210-ALU",
    memberName: "Diana Rodriguez",
    type: "Medical Assistance",
    category: "Post-Surgery Care",
    priority: "High",
    status: "in-progress",
    redactedDescription:
      "Member recovering from major surgery, requesting extended medical assistance for rehabilitation and medication costs.",
    description:
      "Member recovering from major surgery, requesting extended medical assistance for rehabilitation and medication costs.",
    submittedDate: "2025-09-28T10:30:00Z",
    assignedTo: "Medical Team",
    suggestion: {
      category: "Post-Surgery Care",
      priority: "High",
      suggestedAssignee: "Medical Team",
      confidence: 0.93,
      explanation: "Post-surgery medical assistance case in progress.",
      detailedReasoning: {
        factors: [
          "Major surgery recovery",
          "Extended care needed",
          "Medical team handling",
        ],
        riskFactors: [],
        recommendation: "Continue medical team support with regular follow-up",
      },
      extractedEntities: [
        { type: "medical_type", value: "Post-surgery rehabilitation" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-14",
        name: "surgery_report.pdf",
        redacted: true,
      },
      {
        id: "att-15",
        name: "rehabilitation_plan.pdf",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: true,
    progressDetails: {
      status: "Medical review in progress",
      assignedBy: "Dr. Sarah Martinez",
      lastUpdate: "2025-10-01T09:00:00Z",
      nextAction: "Rehabilitation cost assessment",
      estimatedCompletion: "2025-10-03T17:00:00Z",
      notes:
        "Initial surgery costs approved (₱85,000). Now evaluating extended rehabilitation support request. Physical therapy and medication costs being reviewed by medical board.",
    },
  },
  {
    id: "20",
    ticketId: "TCK-2025-0142",
    title: "Child education scholarship review",
    memberPseudonym: "member-6543-ALU",
    memberName: "Fernando Garcia",
    type: "Educational Scholarship",
    category: "University Scholarship",
    priority: "Normal",
    status: "in-progress",
    redactedDescription:
      "Member applied for university scholarship for child studying Engineering. Application under final review by education committee.",
    description:
      "Member applied for university scholarship for child studying Engineering. Application under final review by education committee.",
    submittedDate: "2025-09-25T14:20:00Z",
    assignedTo: "Education Team",
    suggestion: {
      category: "University Scholarship",
      priority: "Normal",
      suggestedAssignee: "Education Team",
      confidence: 0.89,
      explanation: "University scholarship application in final review stage.",
      detailedReasoning: {
        factors: [
          "University scholarship application",
          "Complete documentation",
          "Education team processing",
        ],
        riskFactors: [],
        recommendation: "Continue education team review process",
      },
      extractedEntities: [
        { type: "education_level", value: "University" },
        { type: "course", value: "Engineering" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-16",
        name: "grades_transcript.pdf",
        redacted: false,
      },
      {
        id: "att-17",
        name: "tuition_invoice.pdf",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
    progressDetails: {
      status: "Education committee review",
      assignedBy: "Prof. Maria Santos",
      lastUpdate: "2025-09-30T16:30:00Z",
      nextAction: "Final committee decision",
      estimatedCompletion: "2025-10-04T17:00:00Z",
      notes:
        "Student meets academic requirements (GPA 3.7). Family financial need verified. Scholarship amount being finalized based on tuition costs and available budget. Committee decision scheduled for October 4th.",
    },
  },
  {
    id: "21",
    ticketId: "TCK-2025-0143",
    title: "Housing loan application approved",
    memberPseudonym: "member-1098-ALU",
    memberName: "Antonio Reyes",
    type: "Housing Assistance",
    category: "Housing Loan",
    priority: "Normal",
    status: "resolved",
    redactedDescription:
      "Housing loan application for ₱500,000 approved. All documents processed and loan disbursed.",
    description:
      "Housing loan application for ₱500,000 approved. All documents processed and loan disbursed.",
    submittedDate: "2025-09-15T11:00:00Z",
    assignedTo: "Finance Team",
    suggestion: {
      category: "Housing Loan",
      priority: "Normal",
      suggestedAssignee: "Finance Team",
      confidence: 0.95,
      explanation: "Housing loan successfully approved and processed.",
      detailedReasoning: {
        factors: [
          "Complete application submitted",
          "Credit check passed",
          "Loan amount within limits",
        ],
        riskFactors: [],
        recommendation: "Loan approved and disbursed",
      },
      extractedEntities: [
        { type: "loan_amount", value: "₱500,000" },
        { type: "loan_type", value: "Housing" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-18",
        name: "loan_agreement.pdf",
        redacted: false,
      },
      {
        id: "att-19",
        name: "disbursement_receipt.pdf",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: false,
    resolutionDetails: {
      resolvedBy: "Finance Team",
      resolutionDate: "2025-09-30T15:45:00Z",
      finalAction: "Loan approved and disbursed",
      outcome:
        "Successfully processed ₱500,000 housing loan with 5% interest rate, 10-year term. Monthly payments of ₱5,303.28 starting November 2025.",
      memberNotified: true,
      followUpRequired: false,
      notes:
        "Member has been notified of loan approval and disbursement. Payment schedule provided. First payment due November 15, 2025.",
    },
  },
  {
    id: "22",
    ticketId: "TCK-2025-0144",
    title: "Emergency medical assistance completed",
    memberPseudonym: "member-2187-ALU",
    memberName: "Patricia Gonzales",
    type: "Emergency Support",
    category: "Medical Emergency",
    priority: "Critical",
    status: "resolved",
    redactedDescription:
      "Emergency medical assistance for heart surgery approved and payment processed. ₱150,000 emergency fund utilized.",
    description:
      "Emergency medical assistance for heart surgery approved and payment processed. ₱150,000 emergency fund utilized.",
    submittedDate: "2025-09-20T08:30:00Z",
    assignedTo: "Emergency Team",
    suggestion: {
      category: "Medical Emergency",
      priority: "Critical",
      suggestedAssignee: "Emergency Team",
      confidence: 0.96,
      explanation: "Critical medical emergency successfully resolved.",
      detailedReasoning: {
        factors: [
          "Medical emergency verified",
          "Emergency fund available",
          "Urgent approval processed",
        ],
        riskFactors: [],
        recommendation: "Emergency assistance approved and processed",
      },
      extractedEntities: [
        { type: "emergency_type", value: "Heart surgery" },
        { type: "amount", value: "₱150,000" },
      ],
    },
    redactionSummary: {
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      emails: 0,
    },
    consentGiven: true,
    attachments: [
      {
        id: "att-20",
        name: "hospital_bill.pdf",
        redacted: true,
      },
      {
        id: "att-21",
        name: "payment_confirmation.pdf",
        redacted: false,
      },
    ],
    source: "TUCP-ONE",
    hasSensitiveContent: true,
    resolutionDetails: {
      resolvedBy: "Emergency Response Team",
      resolutionDate: "2025-09-22T14:20:00Z",
      finalAction: "Emergency medical assistance approved",
      outcome:
        "Successfully processed ₱150,000 emergency medical assistance for heart surgery. Payment made directly to hospital within 48 hours of request.",
      memberNotified: true,
      followUpRequired: true,
      notes:
        "Emergency assistance provided for life-saving heart surgery. Member recovery progressing well. Follow-up visit scheduled for October 15th to check on recovery and any additional support needed.",
    },
  },
];

export const mockProponentTasks = [
  {
    id: "1",
    ticketId: "TCK-2025-0123",
    memberPseudonym: "member-1973-ALU",
    suggestedResponse:
      "Dear Member, your medical assistance request has been reviewed and approved. We will process a payment of ₱85,000 to cover your emergency surgery costs. Please submit your hospital bills within 30 days for reimbursement processing.",
    dueDate: "2025-09-30T17:00:00Z",
    status: "pending",
    proponent: {
      id: "prop-1",
      name: "Dr. Ana Rodriguez",
      role: "Medical Program Director",
      department: "Benefits Administration",
    },
    aiConfidence: 0.91,
    category: "Medical Assistance",
  },
  {
    id: "2",
    ticketId: "TCK-2025-0126",
    memberPseudonym: "member-3421-ALU",
    suggestedResponse:
      "We have reviewed your legal consultation request regarding workplace harassment. Our legal team will contact you within 48 hours to schedule an initial consultation. Please prepare any relevant documentation for the meeting.",
    dueDate: "2025-10-01T12:00:00Z",
    status: "approved",
    proponent: {
      id: "prop-2",
      name: "Atty. Carlos Mendoza",
      role: "Legal Affairs Head",
      department: "Legal Services",
    },
    aiConfidence: 0.87,
    category: "Legal Consultation",
  },
];

export const mockAuditEntries = [
  {
    id: "1",
    timestamp: "2025-09-29T10:12:00Z",
    actor: "AI",
    actorName: "System AI",
    action: "auto-assign",
    ticketId: "TCK-2025-0123",
    metadata: {
      confidence: 0.91,
      model: "OpenAI GPT-4",
      assignedTo: "Medical Team",
    },
  },
  {
    id: "2",
    timestamp: "2025-09-29T09:45:00Z",
    actor: "admin",
    actorName: "John Admin",
    action: "override",
    ticketId: "TCK-2025-0124",
    reason: "requires legal review",
    metadata: {
      assignedTo: "Legal Team",
      confidence: 0.73,
    },
  },
  {
    id: "3",
    timestamp: "2025-09-29T09:30:00Z",
    actor: "admin",
    actorName: "Jane Manager",
    action: "view-original",
    ticketId: "TCK-2025-0124",
    reason: "audit compliance check",
  },
  {
    id: "4",
    timestamp: "2025-09-29T08:15:00Z",
    actor: "system",
    actorName: "Admin Settings",
    action: "settings-change",
    metadata: {
      previousValue: "confidence threshold: 0.80",
      newValue: "confidence threshold: 0.85",
    },
  },
];

export const aiAnalytics = {
  autoAssignRate: 67,
  avgConfidence: 0.84,
  overrideRate: 15,
  timeSaved: "2.3 hours/day",
  topMisclassified: [
    { category: "Legal - Complex", count: 8 },
    { category: "Medical - Rare", count: 5 },
    { category: "Educational - Special", count: 3 },
  ],
  confidenceDistribution: [
    { range: "0.9-1.0", count: 45, percentage: 52 },
    { range: "0.8-0.9", count: 28, percentage: 32 },
    { range: "0.7-0.8", count: 12, percentage: 14 },
    { range: "0.6-0.7", count: 2, percentage: 2 },
  ],
};
