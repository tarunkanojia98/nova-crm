/* =========================================================
   NOVA CRM — Centralized Data Store & Indian SMB Seed Data
   ========================================================= */

const STORAGE_KEY = "nova_crm_data_v1";

const DEFAULT_DATA = {
  profile: {
    name: "Aarav Rao",
    initials: "AR",
    role: "Sales Director",
    email: "aarav.rao@novacrm.in",
    phone: "+91 98201 44510",
    company: "Nova Business Solutions Pvt. Ltd.",
    theme: "light",
    notifications: { emailAlerts: true, dealUpdates: true, taskReminders: true }
  },

  team: [
    { id: "tm-1", name: "Aarav Rao", initials: "AR", role: "Sales Director", email: "aarav@novacrm.in", phone: "+91 98201 44510", target: 350000, status: "Active" },
    { id: "tm-2", name: "Priya Deshmukh", initials: "PD", role: "Senior Account Exec", email: "priya@novacrm.in", phone: "+91 98192 77310", target: 250000, status: "Active" },
    { id: "tm-3", name: "Rohan Kulkarni", initials: "RK", role: "Sales Representative", email: "rohan@novacrm.in", phone: "+91 97654 22190", target: 200000, status: "Active" },
    { id: "tm-4", name: "Neha Sharma", initials: "NS", role: "Sales Representative", email: "neha@novacrm.in", phone: "+91 98111 65432", target: 200000, status: "Active" },
    { id: "tm-5", name: "Karthik Iyer", initials: "KI", role: "Customer Success", email: "karthik@novacrm.in", phone: "+91 98400 88211", target: 150000, status: "Active" },
    { id: "tm-6", name: "Simran Kaur", initials: "SK", role: "Lead Generation", email: "simran@novacrm.in", phone: "+91 98720 33419", target: 150000, status: "Active" }
  ],

  customers: [
    { id: "c-1", name: "Rajesh Mehta", company: "Mehta Logistics Pvt. Ltd.", email: "rajesh@mehtalogistics.in", phone: "+91 98204 51200", city: "Mumbai", status: "Active", repId: "tm-2", createdAt: "2026-08-12" },
    { id: "c-2", name: "Ananya Krishnan", company: "Vayu Tech Solutions", email: "ananya@vayutech.in", phone: "+91 98451 22019", city: "Bengaluru", status: "Active", repId: "tm-1", createdAt: "2026-09-04" },
    { id: "c-3", name: "Suresh Reddy", company: "Deccan Textiles", email: "suresh@deccantextiles.in", phone: "+91 98480 61920", city: "Hyderabad", status: "Lead", repId: "tm-3", createdAt: "2026-10-15" },
    { id: "c-4", name: "Meera Joshi", company: "Kaveri Foods & Spices", email: "meera@kaverifoods.in", phone: "+91 98220 90411", city: "Pune", status: "Active", repId: "tm-4", createdAt: "2026-10-22" },
    { id: "c-5", name: "Harpreet Singh", company: "Satluj Precision Tools", email: "harpreet@satlujtools.in", phone: "+91 98140 77821", city: "Ludhiana", status: "Active", repId: "tm-2", createdAt: "2026-11-01" },
    { id: "c-6", name: "Deepak Agarwal", company: "Indus Packaging Co.", email: "deepak@induspack.in", phone: "+91 98102 33981", city: "Gurugram", status: "Lead", repId: "tm-6", createdAt: "2026-11-08" },
    { id: "c-7", name: "Kavita Menon", company: "Malabar Healthcare", email: "kavita@malabarhealth.in", phone: "+91 98950 44120", city: "Kochi", status: "Inactive", repId: "tm-5", createdAt: "2026-07-19" },
    { id: "c-8", name: "Nikhil Bansal", company: "Shivalik Solar Energy", email: "nikhil@shivaliksolar.in", phone: "+91 98761 55209", city: "Chandigarh", status: "Active", repId: "tm-1", createdAt: "2026-11-14" }
  ],

  leads: [
    { id: "l-1", title: "Annual Fleet CRM Rollout", customerId: "c-1", value: 245000, stage: "Won", source: "Referral", repId: "tm-2", updatedAt: "2026-11-18" },
    { id: "l-2", title: "Multi-Branch Sales Suite", customerId: "c-2", value: 320000, stage: "Won", source: "Website", repId: "tm-1", updatedAt: "2026-11-15" },
    { id: "l-3", title: "Dealer Portal Integration", customerId: "c-5", value: 280000, stage: "Won", source: "LinkedIn", repId: "tm-2", updatedAt: "2026-11-10" },
    { id: "l-4", title: "Wholesale Order Tracking", customerId: "c-3", value: 185000, stage: "Negotiation", source: "Cold Call", repId: "tm-3", updatedAt: "2026-11-19" },
    { id: "l-5", title: "Distributor CRM License", customerId: "c-4", value: 140000, stage: "Proposal Sent", source: "Website", repId: "tm-4", updatedAt: "2026-11-17" },
    { id: "l-6", title: "B2B Lead Automation", customerId: "c-6", value: 95000, stage: "Qualified", source: "Referral", repId: "tm-6", updatedAt: "2026-11-19" },
    { id: "l-7", title: "Solar Field Sales App", customerId: "c-8", value: 210000, stage: "Contacted", source: "Trade Show", repId: "tm-1", updatedAt: "2026-11-20" },
    { id: "l-8", title: "Clinic Patient Follow-up", customerId: "c-7", value: 110000, stage: "New", source: "Website", repId: "tm-5", updatedAt: "2026-11-20" },
    { id: "l-9", title: "Legacy ERP Migration", customerId: "c-3", value: 160000, stage: "Lost", source: "Cold Call", repId: "tm-3", updatedAt: "2026-11-05" }
  ],

  tasks: [
    { id: "t-1", title: "Follow up on final contract with Rajesh Mehta", customerId: "c-1", repId: "tm-2", dueDate: "2026-11-20", priority: "High", completed: false },
    { id: "t-2", title: "Send revised GST proposal to Deccan Textiles", customerId: "c-3", repId: "tm-3", dueDate: "2026-11-18", priority: "High", completed: false },
    { id: "t-3", title: "Schedule onboarding demo for Vayu Tech", customerId: "c-2", repId: "tm-1", dueDate: "2026-11-22", priority: "Medium", completed: false },
    { id: "t-4", title: "Share distributor pricing sheet with Kaveri Foods", customerId: "c-4", repId: "tm-4", dueDate: "2026-11-24", priority: "Low", completed: false },
    { id: "t-5", title: "Confirm solar field team requirements", customerId: "c-8", repId: "tm-1", dueDate: "2026-11-19", priority: "Medium", completed: true }
  ],

  activities: [
    { id: "a-1", type: "won", text: "Deal Won: ₹2,45,000 — Mehta Logistics Pvt. Ltd.", time: "2 hours ago" },
    { id: "a-2", type: "customer", text: "New customer added: Shivalik Solar Energy", time: "5 hours ago" },
    { id: "a-3", type: "stage", text: "Deccan Textiles moved to Negotiation", time: "Yesterday" },
    { id: "a-4", type: "task", text: "Completed task: Confirm solar field team requirements", time: "Yesterday" }
  ],

  notifications: [
    { id: "n-1", text: "Mehta Logistics deal marked as Won (₹2,45,000)", time: "2h ago", read: false },
    { id: "n-2", text: "Overdue task: Send revised GST proposal to Deccan Textiles", time: "1d ago", read: false },
    { id: "n-3", text: "New lead assigned: Clinic Patient Follow-up", time: "1d ago", read: false }
  ],

  revenueSeries: {
    monthly: [
      { label: "Jun", actual: 115000, target: 130000 },
      { label: "Jul", actual: 138000, target: 135000 },
      { label: "Aug", actual: 124000, target: 140000 },
      { label: "Sep", actual: 152000, target: 145000 },
      { label: "Oct", actual: 146000, target: 150000 },
      { label: "Nov", actual: 170000, target: 165000 }
    ],
    quarterly: [
      { label: "Q1 FY26", actual: 340000, target: 360000 },
      { label: "Q2 FY26", actual: 412000, target: 400000 },
      { label: "Q3 FY26", actual: 468000, target: 450000 },
      { label: "Q4 FY26", actual: 525000, target: 500000 }
    ],
    yearly: [
      { label: "2023", actual: 1120000, target: 1200000 },
      { label: "2024", actual: 1480000, target: 1450000 },
      { label: "2025", actual: 1745000, target: 1700000 },
      { label: "2026", actual: 1960000, target: 1900000 }
    ]
  }
};

/* ---------- Formatting Helpers (Indian SMB Context) ---------- */
const NovaFormat = {
  inr(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN");
  },
  date(isoStr) {
    if (!isoStr) return "—";
    const [y, m, d] = isoStr.split("-");
    return `${d}/${m}/${y}`;
  },
  isOverdue(isoStr, completed) {
    if (completed || !isoStr) return false;
    const today = new Date().toISOString().split("T")[0];
    return isoStr < today;
  }
};

/* ---------- Shared LocalStorage Store ---------- */
const NovaStore = {
  getData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = structuredClone(DEFAULT_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  },
  
  updateProfile(updates) {
    const data = this.getData();
    data.profile = { ...data.profile, ...updates };
    if (updates.name) {
      data.profile.initials = updates.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    this.saveData(data);
    return data.profile;
  },

  updateTeamRole(repId, newRole) {
    const data = this.getData();
    const member = data.team.find((t) => t.id === repId);
    if (!member) return;
    member.role = newRole;
    this.saveData(data);
  },

  saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  resetDemoData() {
    const seed = structuredClone(DEFAULT_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  },

  getCustomerById(id) {
    return this.getData().customers.find((c) => c.id === id);
  },

  getRepById(id) {
    return this.getData().team.find((t) => t.id === id);
  },

  getKPIs() {
    const data = this.getData();
    const totalCustomers = data.customers.length;
    const activeLeads = data.leads.filter((l) => !["Won", "Lost"].includes(l.stage)).length;
    const wonLeads = data.leads.filter((l) => l.stage === "Won");
    const revenue = wonLeads.reduce((sum, l) => sum + Number(l.value || 0), 0);
    const closedCount = data.leads.filter((l) => ["Won", "Lost"].includes(l.stage)).length;
    const conversionRate = closedCount > 0 ? ((wonLeads.length / closedCount) * 100).toFixed(1) : "0.0";
    const pendingTasks = data.tasks.filter((t) => !t.completed).length;

    return { totalCustomers, activeLeads, revenue, conversionRate, pendingTasks };
  },

  addCustomer(customer) {
    const data = this.getData();
    const newCust = {
      id: "c-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
      city: "India",
      ...customer
    };
    data.customers.unshift(newCust);
    data.activities.unshift({
      id: "a-" + Date.now(),
      type: "customer",
      text: `New customer added: ${newCust.company}`,
      time: "Just now"
    });
    this.saveData(data);
    return newCust;
  },

  updateCustomer(id, updates) {
    const data = this.getData();
    const idx = data.customers.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    data.customers[idx] = { ...data.customers[idx], ...updates };
    data.activities.unshift({
      id: "a-" + Date.now(),
      type: "customer",
      text: `Updated customer: ${data.customers[idx].company} (${data.customers[idx].name})`,
      time: "Just now"
    });
    this.saveData(data);
    return data.customers[idx];
  },

  deleteCustomer(id) {
    const data = this.getData();
    const target = data.customers.find((c) => c.id === id);
    data.customers = data.customers.filter((c) => c.id !== id);
    data.leads = data.leads.filter((l) => l.customerId !== id);
    data.tasks = data.tasks.filter((t) => t.customerId !== id);
    if (target) {
      data.activities.unshift({
        id: "a-" + Date.now(),
        type: "stage",
        text: `Removed customer: ${target.company}`,
        time: "Just now"
      });
    }
    this.saveData(data);
  },

  getCustomerHistory(customerId) {
    const data = this.getData();
    const customer = data.customers.find((c) => c.id === customerId);
    const leads = data.leads.filter((l) => l.customerId === customerId);
    const tasks = data.tasks.filter((t) => t.customerId === customerId);
    const events = [];

    if (customer?.createdAt) {
      events.push({ label: `Customer record created (${NovaFormat.date(customer.createdAt)})`, type: "customer" });
    }
    leads.forEach((l) => {
      events.push({
        label: `Opportunity "${l.title}" — ${l.stage} (${NovaFormat.inr(l.value)})`,
        type: l.stage === "Won" ? "won" : "stage"
      });
    });
    tasks.forEach((t) => {
      events.push({
        label: `Task: ${t.title} — ${t.completed ? "Completed" : "Due " + NovaFormat.date(t.dueDate)}`,
        type: "task"
      });
    });
    return events;
  },

  addLead(lead) {
    const data = this.getData();
    const newLead = {
      id: "l-" + Date.now(),
      updatedAt: new Date().toISOString().split("T")[0],
      ...lead,
      value: Number(lead.value || 0)
    };
    data.leads.unshift(newLead);
    const customer = data.customers.find((c) => c.id === newLead.customerId);
    data.activities.unshift({
      id: "a-" + Date.now(),
      type: newLead.stage === "Won" ? "won" : "stage",
      text: `New lead added: ${newLead.title} (${customer ? customer.company : "SMB Account"})`,
      time: "Just now"
    });
    this.saveData(data);
    return newLead;
  },

  updateLeadStage(leadId, newStage) {
    const data = this.getData();
    const lead = data.leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === newStage) return null;

    const oldStage = lead.stage;
    lead.stage = newStage;
    lead.updatedAt = new Date().toISOString().split("T")[0];

    const customer = data.customers.find((c) => c.id === lead.customerId);
    const label = customer ? customer.company : lead.title;

    data.activities.unshift({
      id: "a-" + Date.now(),
      type: newStage === "Won" ? "won" : "stage",
      text:
        newStage === "Won"
          ? `Deal Won: ${NovaFormat.inr(lead.value)} — ${label}`
          : `${label} moved from ${oldStage} to ${newStage}`,
      time: "Just now"
    });

    this.saveData(data);
    return lead;
  },

  addTask(task) {
    const data = this.getData();
    const newTask = {
      id: "t-" + Date.now(),
      completed: false,
      ...task
    };
    data.tasks.unshift(newTask);
    data.activities.unshift({
      id: "a-" + Date.now(),
      type: "task",
      text: `New task created: ${newTask.title}`,
      time: "Just now"
    });
    this.saveData(data);
    return newTask;
  },

  toggleTask(taskId) {
    const data = this.getData();
    const task = data.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      if (task.completed) {
        data.activities.unshift({
          id: "a-" + Date.now(),
          type: "task",
          text: `Completed task: ${task.title}`,
          time: "Just now"
        });
      }
      this.saveData(data);
    }
  },

  deleteTask(taskId) {
    const data = this.getData();
    data.tasks = data.tasks.filter((t) => t.id !== taskId);
    this.saveData(data);
  }
};