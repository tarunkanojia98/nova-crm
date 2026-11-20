/* =========================================================
NOVA CRM — Core App Router, Dashboard, Directory,
Sales Pipeline Kanban & Tasks/Activities
========================================================= */

let currentPage = "overview";
let revenueTimeframe = "monthly";
let editingCustomerId = null;
let selectedDrawerCustomerId = null;
let pendingDeleteCustomerId = null;
let customerFilterState = {
    search: "",
    status: "All",
    repId: "All"
};
let taskFilterState = {
    status: "all",
    priority: "all",
    date: ""
};

const PIPELINE_STAGES = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Negotiation",
    "Won",
    "Lost"
];

document.addEventListener("DOMContentLoaded", () => {
    applySavedTheme();
    syncUserHeader();
    setupNavigation();
    setupGlobalSearch();
    setupPopovers();
    setupModals();
    renderPage(getPageFromHash());

    window.addEventListener("hashchange", () => {
        renderPage(getPageFromHash());
    });
});

function getPageFromHash() {
    const hash = window.location.hash.replace("#", "") || "overview";
    const valid = ["overview", "customers", "pipeline", "tasks", "team", "settings"];
    return valid.includes(hash) ? hash : "overview";
}

/* ---------- Theme & Header ---------- */
function applySavedTheme() {
    const data = NovaStore.getData();
    const theme = data.profile?.theme || "light";
    document.documentElement.setAttribute("data-theme", theme);
    const toggleBtn = document.getElementById("quick-theme-toggle");
    if (toggleBtn) {
        toggleBtn.textContent = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    }
}

function toggleTheme() {
    const data = NovaStore.getData();
    data.profile.theme = data.profile.theme === "dark" ? "light" : "dark";
    NovaStore.saveData(data);
    applySavedTheme();
}

function syncUserHeader() {
    const { profile } = NovaStore.getData();
    document.getElementById("topbar-avatar").textContent = profile.initials;
    document.getElementById("topbar-user-name").textContent = profile.name;
    document.getElementById("dropdown-user-name").textContent = profile.name;
    document.getElementById("dropdown-user-role").textContent = profile.role;
}

/* ---------- Sidebar & Mobile Drawer ---------- */
function setupNavigation() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    const closeDrawer = () => {
        sidebar.classList.remove("open");
        backdrop.classList.remove("open");
    };

    document.getElementById("open-sidebar").addEventListener("click", () => {
        sidebar.classList.add("open");
        backdrop.classList.add("open");
    });
    document.getElementById("close-sidebar").addEventListener("click", closeDrawer);
    backdrop.addEventListener("click", closeDrawer);

    document.querySelectorAll(".nav-item").forEach((link) => {
        link.addEventListener("click", closeDrawer);
    });
}

function updateActiveNav(page) {
    document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.page === page);
    });
}

/* ---------- Global Quick-Search (Deep-Linking to Exact Records) ---------- */
function setupGlobalSearch() {
    const input = document.getElementById("global-search-input");
    const dropdown = document.getElementById("search-results");

    input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        if (!q) {
            dropdown.classList.remove("open");
            return;
        }

        const data = NovaStore.getData();
        const customers = data.customers.filter(
                (c) =>
                c.name.toLowerCase().includes(q) ||
                c.company.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q));
        const leads = data.leads.filter((l) => l.title.toLowerCase().includes(q));
        const tasks = data.tasks.filter((t) => t.title.toLowerCase().includes(q));

        let html = "";
        if (customers.length) {
            html += `<div class="search-group-label">Customers</div>`;
            html += customers
            .slice(0, 4)
            .map(
                (c) => `<button type="button" class="search-result-item" data-search-type="customer" data-record-id="${c.id}">
            <span>${c.name}</span><span class="search-result-meta">${c.company}</span>
          </button>`)
            .join("");
        }
        if (leads.length) {
            html += `<div class="search-group-label">Sales Pipeline</div>`;
            html += leads
            .slice(0, 4)
            .map(
                (l) => `<button type="button" class="search-result-item" data-search-type="lead" data-record-id="${l.id}">
            <span>${l.title}</span><span class="search-result-meta">${l.stage}</span>
          </button>`)
            .join("");
        }
        if (tasks.length) {
            html += `<div class="search-group-label">Tasks</div>`;
            html += tasks
            .slice(0, 4)
            .map(
                (t) => `<button type="button" class="search-result-item" data-search-type="task" data-record-id="${t.id}">
            <span>${t.title}</span><span class="search-result-meta">${NovaFormat.date(t.dueDate)}</span>
          </button>`)
            .join("");
        }

        dropdown.innerHTML = html || `<div class="search-result-item">No matching records found.</div>`;
        dropdown.classList.add("open");
    });

    dropdown.addEventListener("click", (e) => {
        const item = e.target.closest("[data-search-type]");
        if (!item)
            return;

        const { searchType, recordId } = item.dataset;
        dropdown.classList.remove("open");
        input.value = "";
        openSearchTarget(searchType, recordId);
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest("#global-search"))
            dropdown.classList.remove("open");
    });
}

function openSearchTarget(type, id) {
    if (type === "customer") {
        customerFilterState = {
            search: "",
            status: "All",
            repId: "All"
        };
        if (window.location.hash !== "#customers") {
            window.location.hash = "#customers";
        } else {
            renderPage("customers");
        }
        setTimeout(() => openCustomerDrawer(id), 40);
    } else if (type === "lead") {
        if (window.location.hash !== "#pipeline") {
            window.location.hash = "#pipeline";
        } else {
            renderPage("pipeline");
        }
        setTimeout(() => {
            const card = document.querySelector(`.lead-card[data-lead-id="${id}"]`);
            if (card) {
                card.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                });
                card.classList.add("search-highlight");
                setTimeout(() => card.classList.remove("search-highlight"), 2200);
            }
        }, 60);
    } else if (type === "task") {
        taskFilterState = {
            status: "all",
            priority: "all",
            date: ""
        };
        if (window.location.hash !== "#tasks") {
            window.location.hash = "#tasks";
        } else {
            renderPage("tasks");
        }
        setTimeout(() => {
            const box = document.querySelector(`.task-check[data-task-id="${id}"]`);
            const row = box?.closest(".task-item");
            if (row) {
                row.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                row.classList.add("search-highlight");
                setTimeout(() => row.classList.remove("search-highlight"), 2200);
            }
        }, 60);
    }
}

/* ---------- Notifications & Profile Popovers ---------- */
function setupPopovers() {
    const notifBtn = document.getElementById("notif-btn");
    const notifPanel = document.getElementById("notif-panel");
    const profileBtn = document.getElementById("profile-btn");
    const profilePanel = document.getElementById("profile-panel");

    renderNotifications();

    notifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profilePanel.classList.remove("open");
        notifPanel.classList.toggle("open");
    });

    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifPanel.classList.remove("open");
        profilePanel.classList.toggle("open");
    });

    document.getElementById("mark-all-read").addEventListener("click", () => {
        const data = NovaStore.getData();
        data.notifications.forEach((n) => (n.read = true));
        NovaStore.saveData(data);
        renderNotifications();
    });

    document.getElementById("quick-theme-toggle").addEventListener("click", () => {
        toggleTheme();
        profilePanel.classList.remove("open");
    });

    document.addEventListener("click", () => {
        notifPanel.classList.remove("open");
        profilePanel.classList.remove("open");
    });
}

function renderNotifications() {
    const { notifications } = NovaStore.getData();
    const unread = notifications.filter((n) => !n.read).length;
    const badge = document.getElementById("notif-badge");
    badge.textContent = unread;
    badge.classList.toggle("hidden", unread === 0);

    document.getElementById("notif-list").innerHTML = notifications
        .map(
            (n) => `<div class="notif-item ${n.read ? "" : "unread"}">
        ${n.text}
        <span class="notif-time">${n.time}</span>
      </div>`)
        .join("");
}

/* ---------- Modals & Slide-Over Drawer ---------- */
function setupModals() {
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
        btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
    });

    document.getElementById("quick-customer-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById("cust-name").value.trim(),
            company: document.getElementById("cust-company").value.trim(),
            email: document.getElementById("cust-email").value.trim(),
            phone: document.getElementById("cust-phone").value.trim(),
            status: document.getElementById("cust-status").value,
            repId: document.getElementById("cust-rep").value
        };

        if (editingCustomerId) {
            NovaStore.updateCustomer(editingCustomerId, payload);
            editingCustomerId = null;
        } else {
            NovaStore.addCustomer(payload);
        }

        e.target.reset();
        closeModal("customer-modal");
        renderPage(currentPage);
    });

    document.getElementById("quick-task-form").addEventListener("submit", (e) => {
        e.preventDefault();
        NovaStore.addTask({
            title: document.getElementById("task-title").value.trim(),
            dueDate: document.getElementById("task-due").value,
            priority: document.getElementById("task-priority").value,
            customerId: document.getElementById("task-customer").value,
            repId: document.getElementById("task-rep").value
        });
        e.target.reset();
        closeModal("task-modal");
        renderPage(currentPage);
    });

    const leadForm = document.getElementById("quick-lead-form");
    if (leadForm) {
        leadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            NovaStore.addLead({
                title: document.getElementById("lead-title").value.trim(),
                customerId: document.getElementById("lead-customer").value,
                value: Number(document.getElementById("lead-value").value),
                stage: document.getElementById("lead-stage").value,
                source: document.getElementById("lead-source").value,
                repId: document.getElementById("lead-rep").value
            });
            e.target.reset();
            closeModal("lead-modal");
            renderPage(currentPage);
        });
    }

    document.getElementById("close-customer-drawer").addEventListener("click", closeCustomerDrawer);
    document.getElementById("customer-drawer-backdrop").addEventListener("click", closeCustomerDrawer);

    document.getElementById("drawer-edit-btn").addEventListener("click", () => {
        if (!selectedDrawerCustomerId)
            return;
        const id = selectedDrawerCustomerId;
        closeCustomerDrawer();
        openEditCustomerModal(id);
    });

    document.getElementById("drawer-delete-btn").addEventListener("click", () => {
        if (!selectedDrawerCustomerId)
            return;
        requestDeleteCustomer(selectedDrawerCustomerId);
    });

    document.getElementById("confirm-delete-btn").addEventListener("click", () => {
        if (!pendingDeleteCustomerId)
            return;
        NovaStore.deleteCustomer(pendingDeleteCustomerId);
        pendingDeleteCustomerId = null;
        closeModal("confirm-modal");
        closeCustomerDrawer();
        renderPage(currentPage);
    });
}

function openModal(id) {
    const data = NovaStore.getData();
    const repOptions = data.team.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");
    const custOptions = data.customers
        .map((c) => `<option value="${c.id}">${c.company} (${c.name})</option>`)
        .join("");

    if (id === "customer-modal") {
        editingCustomerId = null;
        document.querySelector("#customer-modal .modal-header h3").textContent = "Add New Customer";
        document.getElementById("quick-customer-form").reset();
        document.getElementById("cust-rep").innerHTML = repOptions;
    }

    if (id === "task-modal") {
        document.getElementById("task-rep").innerHTML = repOptions;
        document.getElementById("task-customer").innerHTML = custOptions;
        document.getElementById("task-due").value = new Date().toISOString().split("T")[0];
    }

    if (id === "lead-modal") {
        document.getElementById("lead-rep").innerHTML = repOptions;
        document.getElementById("lead-customer").innerHTML = custOptions;
    }

    document.getElementById(id).classList.add("open");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("open");
}

function openEditCustomerModal(customerId) {
    const customer = NovaStore.getCustomerById(customerId);
    if (!customer)
        return;
    const data = NovaStore.getData();

    editingCustomerId = customerId;
    document.querySelector("#customer-modal .modal-header h3").textContent = "Edit Customer";
    document.getElementById("cust-rep").innerHTML = data.team
        .map((t) => `<option value="${t.id}">${t.name}</option>`)
        .join("");

    document.getElementById("cust-name").value = customer.name;
    document.getElementById("cust-company").value = customer.company;
    document.getElementById("cust-email").value = customer.email;
    document.getElementById("cust-phone").value = customer.phone;
    document.getElementById("cust-status").value = customer.status;
    document.getElementById("cust-rep").value = customer.repId || data.team[0]?.id || "";

    document.getElementById("customer-modal").classList.add("open");
}

function requestDeleteCustomer(customerId) {
    const customer = NovaStore.getCustomerById(customerId);
    if (!customer)
        return;
    pendingDeleteCustomerId = customerId;
    document.getElementById("confirm-message").textContent =
`Delete "${customer.company}" (${customer.name})? Linked leads and tasks will also be removed.`;
    document.getElementById("confirm-modal").classList.add("open");
}

function openCustomerDrawer(customerId) {
    const customer = NovaStore.getCustomerById(customerId);
    if (!customer)
        return;

    selectedDrawerCustomerId = customerId;
    const rep = NovaStore.getRepById(customer.repId);
    const history = NovaStore.getCustomerHistory(customerId);

    document.getElementById("drawer-customer-name").textContent = customer.name;
    document.getElementById("drawer-customer-company").textContent = customer.company;

    const badge = document.getElementById("drawer-status-badge");
    badge.textContent = customer.status;
    badge.className = `drawer-eyebrow status-pill status-${customer.status.toLowerCase()}`;

    document.getElementById("drawer-body").innerHTML = `
    <div>
      <div class="drawer-section-title">Contact &amp; Account Details</div>
      <div class="info-list">
        <div class="info-row"><span>Company</span><span>${customer.company}</span></div>
        <div class="info-row"><span>Email</span><span>${customer.email}</span></div>
        <div class="info-row"><span>Phone</span><span class="tabular">${customer.phone}</span></div>
        <div class="info-row"><span>City</span><span>${customer.city || "India"}</span></div>
        <div class="info-row"><span>Assigned Rep</span><span>${rep ? rep.name : "Unassigned"}</span></div>
        <div class="info-row"><span>Added On</span><span class="tabular">${NovaFormat.date(customer.createdAt)}</span></div>
      </div>
    </div>

    <div>
      <div class="drawer-section-title">Activity History</div>
      ${
        history.length
         ? `<ul class="activity-list">${history
        .map(
            (ev) => `<li class="activity-item">
                  <span class="activity-dot ${ev.type}"></span>
                  <div>${ev.label}</div>
                </li>`)
        .join("")}</ul>`
         : `<p class="customer-sub">No recorded activity yet.</p>`
}
    </div>
  `;

    document.getElementById("customer-drawer").classList.add("open");
    document.getElementById("customer-drawer-backdrop").classList.add("open");
}

function closeCustomerDrawer() {
    selectedDrawerCustomerId = null;
    document.getElementById("customer-drawer").classList.remove("open");
    document.getElementById("customer-drawer-backdrop").classList.remove("open");
}

/* ---------- Page Router ---------- */
function renderPage(page) {
    currentPage = page;
    updateActiveNav(page);
    const view = document.getElementById("app-view");

    if (page === "overview") {
        renderDashboardOverview(view);
    } else if (page === "customers") {
        renderCustomersDirectory(view);
    } else if (page === "pipeline") {
        renderPipelineView(view);
    } else if (page === "tasks") {
        renderTasksView(view);
    } else if (page === "team") {
        renderTeamView(view);
    } else if (page === "settings") {
        renderSettingsView(view);
    }
}

/* ---------- Dashboard Overview ---------- */
function renderDashboardOverview(container) {
    const data = NovaStore.getData();
    const kpis = NovaStore.getKPIs();
    const todayStr = NovaFormat.date(new Date().toISOString().split("T")[0]);

    container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Welcome back, ${data.profile.name.split(" ")[0]}</h1>
        <p class="page-subtitle">Pipeline &amp; activity snapshot for ${todayStr}</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" id="dash-new-task">+ New Task</button>
        <button class="btn btn-primary" id="dash-add-customer">+ Add Customer</button>
      </div>
    </div>

    <section class="kpi-grid">
      <div class="card kpi-card">
        <div class="kpi-top"><span>Total Customers</span></div>
        <div class="kpi-value tabular">${kpis.totalCustomers}</div>
        <div class="kpi-meta positive">Live from directory</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span>Active Leads</span></div>
        <div class="kpi-value tabular">${kpis.activeLeads}</div>
        <div class="kpi-meta">In open pipeline stages</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span>Revenue Generated</span></div>
        <div class="kpi-value tabular">${NovaFormat.inr(kpis.revenue)}</div>
        <div class="kpi-meta positive">From Won deals</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span>Conversion Rate</span></div>
        <div class="kpi-value tabular">${kpis.conversionRate}%</div>
        <div class="kpi-meta">${kpis.pendingTasks} pending tasks</div>
      </div>
    </section>

    <section class="card chart-section">
      <div class="card-header">
        <div>
          <h2 class="card-title">Revenue Analytics</h2>
          <p class="page-subtitle">Actual revenue vs. target (INR)</p>
        </div>
        <div class="segmented-control" id="timeframe-switcher">
          <button class="seg-btn ${revenueTimeframe === "monthly" ? "active" : ""}" data-tf="monthly">Monthly</button>
          <button class="seg-btn ${revenueTimeframe === "quarterly" ? "active" : ""}" data-tf="quarterly">Quarterly</button>
          <button class="seg-btn ${revenueTimeframe === "yearly" ? "active" : ""}" data-tf="yearly">Yearly</button>
        </div>
      </div>
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-dot actual"></span>Actual Revenue</span>
        <span class="legend-item"><span class="legend-dot target"></span>Revenue Target</span>
      </div>
      <div class="bar-chart" id="revenue-bar-chart"></div>
    </section>

    <section class="split-grid">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Recent Activities</h2>
          <a href="#tasks" class="link-btn">View all</a>
        </div>
        <ul class="activity-list">
          ${data.activities
        .slice(0, 6)
        .map(
            (a) => `<li class="activity-item">
                <span class="activity-dot ${a.type}"></span>
                <div>
                  <div>${a.text}</div>
                  <span class="activity-time">${a.time}</span>
                </div>
              </li>`)
        .join("")}
        </ul>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Upcoming Tasks</h2>
          <a href="#tasks" class="link-btn">View all</a>
        </div>
        <ul class="task-list" id="dash-task-list">
          ${data.tasks
        .slice(0, 5)
        .map((t) => {
            const overdue = NovaFormat.isOverdue(t.dueDate, t.completed);
            const pClass = t.priority.toLowerCase();
            return `<li class="task-item ${t.completed ? "done" : ""}">
                <div class="task-left">
                  <input type="checkbox" data-task-id="${t.id}" ${t.completed ? "checked" : ""} />
                  <div>
                    <div class="task-title">${t.title}</div>
                    <div class="task-meta tabular ${overdue ? "overdue" : ""}">
                      ${overdue ? "Overdue • " : "Due "}${NovaFormat.date(t.dueDate)}
                    </div>
                  </div>
                </div>
                <span class="badge badge-${pClass}">${t.priority}</span>
              </li>`;
        })
        .join("")}
        </ul>
      </div>
    </section>
  `;

    renderRevenueChart(data.revenueSeries[revenueTimeframe]);

    document.getElementById("dash-add-customer").addEventListener("click", () => openModal("customer-modal"));
    document.getElementById("dash-new-task").addEventListener("click", () => openModal("task-modal"));

    document.querySelectorAll("#timeframe-switcher .seg-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            revenueTimeframe = btn.dataset.tf;
            renderDashboardOverview(container);
        });
    });

    document.querySelectorAll("#dash-task-list input[type='checkbox']").forEach((cb) => {
        cb.addEventListener("change", () => {
            NovaStore.toggleTask(cb.dataset.taskId);
            renderDashboardOverview(container);
        });
    });
}

function renderRevenueChart(series) {
    const chartEl = document.getElementById("revenue-bar-chart");
    const maxVal = Math.max(...series.flatMap((s) => [s.actual, s.target]), 1);

    chartEl.innerHTML = series
        .map((item) => {
            const actualH = Math.round((item.actual / maxVal) * 100);
            const targetH = Math.round((item.target / maxVal) * 100);
            return `
        <div class="bar-group">
          <div class="bars-pair">
            <div class="bar actual" style="height:${actualH}%" title="Actual (${item.label}): ${NovaFormat.inr(item.actual)}"></div>
            <div class="bar target" style="height:${targetH}%" title="Target (${item.label}): ${NovaFormat.inr(item.target)}"></div>
          </div>
          <span class="bar-label">${item.label}</span>
        </div>
      `;
        })
        .join("");
}

/* ---------- Customers Directory ---------- */
function renderCustomersDirectory(container) {
    const data = NovaStore.getData();

    const filtered = data.customers.filter((c) => {
        const matchesStatus = customerFilterState.status === "All" || c.status === customerFilterState.status;
        const matchesRep = customerFilterState.repId === "All" || c.repId === customerFilterState.repId;
        const q = customerFilterState.search.trim().toLowerCase();
        const matchesSearch =
            !q ||
            c.name.toLowerCase().includes(q) ||
            c.company.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            (c.city || "").toLowerCase().includes(q);
        return matchesStatus && matchesRep && matchesSearch;
    });

    container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Customers</h1>
        <p class="page-subtitle">Centralized directory of Indian SMB accounts (${data.customers.length} total)</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" id="dir-add-customer">+ Add Customer</button>
      </div>
    </div>

    <div class="card toolbar-card">
      <div class="filter-controls">
        <input
          type="text"
          id="cust-filter-search"
          class="filter-input"
          placeholder="Search name, company, email, city..."
          value="${customerFilterState.search}"
        />
        <select id="cust-filter-status" class="filter-select">
          <option value="All" ${customerFilterState.status === "All" ? "selected" : ""}>All Statuses</option>
          <option value="Active" ${customerFilterState.status === "Active" ? "selected" : ""}>Active</option>
          <option value="Lead" ${customerFilterState.status === "Lead" ? "selected" : ""}>Lead</option>
          <option value="Inactive" ${customerFilterState.status === "Inactive" ? "selected" : ""}>Inactive</option>
        </select>
        <select id="cust-filter-rep" class="filter-select">
          <option value="All" ${customerFilterState.repId === "All" ? "selected" : ""}>All Reps</option>
          ${data.team
        .map(
            (t) => `<option value="${t.id}" ${customerFilterState.repId === t.id ? "selected" : ""}>${t.name}</option>`)
        .join("")}
        </select>
      </div>
    </div>

    <div class="card table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Customer &amp; Company</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Assigned Rep</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${
        filtered.length
         ? filtered
        .map((c) => {
            const rep = data.team.find((t) => t.id === c.repId);
            return `
                        <tr class="clickable-row" data-customer-id="${c.id}">
                          <td>
                            <div class="customer-primary">${c.name}</div>
                            <div class="customer-sub">${c.company}${c.city ? " • " + c.city : ""}</div>
                          </td>
                          <td>
                            <div>${c.email}</div>
                            <div class="customer-sub tabular">${c.phone}</div>
                          </td>
                          <td><span class="status-pill status-${c.status.toLowerCase()}">${c.status}</span></td>
                          <td>${rep ? rep.name : "—"}</td>
                          <td>
                            <div class="row-actions" onclick="event.stopPropagation()">
                              <button class="btn btn-secondary btn-xs" data-edit-cust="${c.id}">Edit</button>
                              <button class="btn btn-danger btn-xs" data-del-cust="${c.id}">Delete</button>
                            </div>
                          </td>
                        </tr>
                      `;
        })
        .join("")
         : `<tr><td colspan="5" class="empty-state">No customers match your current search or filter.</td></tr>`
}
          </tbody>
        </table>
      </div>
    </div>
  `;

    document.getElementById("dir-add-customer").addEventListener("click", () => openModal("customer-modal"));

    document.getElementById("cust-filter-search").addEventListener("input", (e) => {
        customerFilterState.search = e.target.value;
        renderCustomersDirectory(container);
        const input = document.getElementById("cust-filter-search");
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    });

    document.getElementById("cust-filter-status").addEventListener("change", (e) => {
        customerFilterState.status = e.target.value;
        renderCustomersDirectory(container);
    });

    document.getElementById("cust-filter-rep").addEventListener("change", (e) => {
        customerFilterState.repId = e.target.value;
        renderCustomersDirectory(container);
    });

    container.querySelectorAll("tr.clickable-row").forEach((row) => {
        row.addEventListener("click", () => openCustomerDrawer(row.dataset.customerId));
    });

    container.querySelectorAll("[data-edit-cust]").forEach((btn) => {
        btn.addEventListener("click", () => openEditCustomerModal(btn.dataset.editCust));
    });

    container.querySelectorAll("[data-del-cust]").forEach((btn) => {
        btn.addEventListener("click", () => requestDeleteCustomer(btn.dataset.delCust));
    });
}

/* ---------- Sales Pipeline (Kanban) ---------- */
function renderPipelineView(container) {
    const data = NovaStore.getData();

    container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Sales Pipeline</h1>
        <p class="page-subtitle">Drag cards across stages on desktop or use the stage selector on mobile.</p>
      </div>
      <div class="header-actions">
        <button type="button" class="btn btn-secondary" id="pipe-scroll-left" aria-label="Scroll pipeline left">&larr; Left</button>
        <button type="button" class="btn btn-secondary" id="pipe-scroll-right" aria-label="Scroll pipeline right">Right &rarr;</button>
        <button type="button" class="btn btn-primary" id="pipeline-add-lead">+ Add Lead</button>
      </div>
    </div>

    <div class="pipeline-board" id="pipeline-board">
      ${PIPELINE_STAGES.map((stage) => {
            const stageLeads = data.leads.filter((l) => l.stage === stage);
            const stageTotal = stageLeads.reduce((sum, l) => sum + Number(l.value || 0), 0);
            const specialClass = stage === "Won" ? "col-won" : stage === "Lost" ? "col-lost" : "";

            return `
          <div class="pipeline-col ${specialClass}" data-stage="${stage}">
            <div class="pipeline-col-header">
              <span class="pipeline-col-title">${stage} (${stageLeads.length})</span>
              <span class="pipeline-col-total tabular">${NovaFormat.inr(stageTotal)}</span>
            </div>
            <div class="pipeline-cards">
              ${
            stageLeads.length
             ? stageLeads
            .map((lead) => {
                const cust = data.customers.find((c) => c.id === lead.customerId);
                const rep = data.team.find((t) => t.id === lead.repId);
                return `
                          <div class="lead-card" draggable="true" data-lead-id="${lead.id}">
                            <div class="lead-title">${lead.title}</div>
                            <div class="lead-company">${cust ? cust.company : "SMB Account"} • ${lead.source}</div>
                            <div class="lead-meta">
                              <span class="lead-value tabular">${NovaFormat.inr(lead.value)}</span>
                              <span class="lead-rep" title="${rep ? rep.name : ""}">${rep ? rep.initials : "AR"}</span>
                            </div>
                            <select class="stage-select" data-lead-id="${lead.id}" aria-label="Change stage for ${lead.title}">
                              ${PIPELINE_STAGES.map(
                    (s) => `<option value="${s}" ${s === lead.stage ? "selected" : ""}>Move to: ${s}</option>`).join("")}
                            </select>
                          </div>
                        `;
            })
            .join("")
             : `<div class="empty-state" style="padding: 24px 8px; font-size: 12.5px;">Drop lead here</div>`
}
            </div>
          </div>
        `;
        }).join("")}
    </div>
  `;

    const board = document.getElementById("pipeline-board");

    document.getElementById("pipe-scroll-left").addEventListener("click", () => {
        board.scrollBy({
            left: -340,
            behavior: "smooth"
        });
    });

    document.getElementById("pipe-scroll-right").addEventListener("click", () => {
        board.scrollBy({
            left: 340,
            behavior: "smooth"
        });
    });

    document.getElementById("pipeline-add-lead").addEventListener("click", () => openModal("lead-modal"));

    container.querySelectorAll(".stage-select").forEach((select) => {
        select.addEventListener("change", (e) => {
            NovaStore.updateLeadStage(e.target.dataset.leadId, e.target.value);
            renderPipelineView(container);
        });
    });

    let draggedLeadId = null;

    container.querySelectorAll(".lead-card").forEach((card) => {
        card.addEventListener("dragstart", () => {
            draggedLeadId = card.dataset.leadId;
            card.classList.add("dragging");
        });
        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
            draggedLeadId = null;
        });
    });

    container.querySelectorAll(".pipeline-col").forEach((col) => {
        col.addEventListener("dragover", (e) => {
            e.preventDefault();
            col.classList.add("drag-over");
        });
        col.addEventListener("dragleave", () => {
            col.classList.remove("drag-over");
        });
        col.addEventListener("drop", (e) => {
            e.preventDefault();
            col.classList.remove("drag-over");
            if (draggedLeadId) {
                NovaStore.updateLeadStage(draggedLeadId, col.dataset.stage);
                renderPipelineView(container);
            }
        });
    });
}

/* ---------- Tasks & Activities ---------- */
function renderTasksView(container) {
    const data = NovaStore.getData();

    const filteredTasks = data.tasks.filter((t) => {
        if (taskFilterState.status === "completed" && !t.completed)
            return false;
        if (taskFilterState.status === "pending" && t.completed)
            return false;
        if (taskFilterState.status === "overdue" && !NovaFormat.isOverdue(t.dueDate, t.completed))
            return false;
        if (taskFilterState.priority !== "all" && t.priority !== taskFilterState.priority)
            return false;
        if (taskFilterState.date && t.dueDate !== taskFilterState.date)
            return false;
        return true;
    });

    container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Tasks &amp; Activities</h1>
        <p class="page-subtitle">Stay on top of daily follow-ups, reminders, and team activity logs.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" id="tasks-new-btn">+ New Task</button>
      </div>
    </div>

    <div class="card toolbar-card">
      <div class="filter-controls">
        <select id="task-filter-status" class="filter-select">
          <option value="all" ${taskFilterState.status === "all" ? "selected" : ""}>All Statuses</option>
          <option value="pending" ${taskFilterState.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="completed" ${taskFilterState.status === "completed" ? "selected" : ""}>Completed</option>
          <option value="overdue" ${taskFilterState.status === "overdue" ? "selected" : ""}>Overdue</option>
        </select>
        <select id="task-filter-priority" class="filter-select">
          <option value="all" ${taskFilterState.priority === "all" ? "selected" : ""}>All Priorities</option>
          <option value="High" ${taskFilterState.priority === "High" ? "selected" : ""}>High Priority</option>
          <option value="Medium" ${taskFilterState.priority === "Medium" ? "selected" : ""}>Medium Priority</option>
          <option value="Low" ${taskFilterState.priority === "Low" ? "selected" : ""}>Low Priority</option>
        </select>
        <input type="date" id="task-filter-date" class="filter-select" value="${taskFilterState.date}" />
        ${
        taskFilterState.status !== "all" || taskFilterState.priority !== "all" || taskFilterState.date
         ? `<button type="button" class="btn btn-secondary btn-xs" id="task-reset-filters">Clear Filters</button>`
         : ""
}
      </div>
    </div>

    <div class="tasks-activities-grid">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Task Checklist (${filteredTasks.length})</h2>
        </div>
        <ul class="task-list">
          ${
        filteredTasks.length
         ? filteredTasks
        .map((t) => {
            const overdue = NovaFormat.isOverdue(t.dueDate, t.completed);
            const cust = data.customers.find((c) => c.id === t.customerId);
            const rep = data.team.find((r) => r.id === t.repId);
            const pClass = t.priority.toLowerCase();
            return `
                      <li class="task-item ${t.completed ? "done" : ""}">
                        <div class="task-left">
                          <input type="checkbox" class="task-check" data-task-id="${t.id}" ${t.completed ? "checked" : ""} />
                          <div>
                            <div class="task-title">${t.title}</div>
                            <div class="task-meta tabular ${overdue ? "overdue" : ""}">
                              ${overdue ? "Overdue • " : "Due "}${NovaFormat.date(t.dueDate)}
                              ${cust ? " • " + cust.company : ""}
                              ${rep ? " (" + rep.name + ")" : ""}
                            </div>
                          </div>
                        </div>
                        <div class="row-actions">
                          <span class="badge badge-${pClass}">${t.priority}</span>
                          <button type="button" class="btn btn-secondary btn-xs btn-delete-task" data-task-id="${t.id}">Delete</button>
                        </div>
                      </li>
                    `;
        })
        .join("")
         : `<li class="empty-state">No tasks match your current filters.</li>`
}
        </ul>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Activity History</h2>
        </div>
        <ul class="activity-list">
          ${data.activities
        .map(
            (a) => `
              <li class="activity-item">
                <span class="activity-dot ${a.type}"></span>
                <div>
                  <div>${a.text}</div>
                  <span class="activity-time">${a.time}</span>
                </div>
              </li>
            `)
        .join("")}
        </ul>
      </div>
    </div>
  `;

    document.getElementById("tasks-new-btn").addEventListener("click", () => openModal("task-modal"));

    container.querySelectorAll(".task-check").forEach((box) => {
        box.addEventListener("change", () => {
            NovaStore.toggleTask(box.dataset.taskId);
            renderTasksView(container);
        });
    });

    container.querySelectorAll(".btn-delete-task").forEach((btn) => {
        btn.addEventListener("click", () => {
            NovaStore.deleteTask(btn.dataset.taskId);
            renderTasksView(container);
        });
    });

    document.getElementById("task-filter-status").addEventListener("change", (e) => {
        taskFilterState.status = e.target.value;
        renderTasksView(container);
    });

    document.getElementById("task-filter-priority").addEventListener("change", (e) => {
        taskFilterState.priority = e.target.value;
        renderTasksView(container);
    });

    document.getElementById("task-filter-date").addEventListener("change", (e) => {
        taskFilterState.date = e.target.value;
        renderTasksView(container);
    });

    const resetBtn = document.getElementById("task-reset-filters");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            taskFilterState = {
                status: "all",
                priority: "all",
                date: ""
            };
            renderTasksView(container);
        });
    }
}

/* ---------- Team Management ---------- */
function renderTeamView(container) {
    const data = NovaStore.getData();
    const wonLeads = data.leads.filter((l) => l.stage === "Won");
    const totalWonRevenue = wonLeads.reduce((sum, l) => sum + Number(l.value || 0), 0);

    const rolePermissions = {
        "Sales Director": "Full Admin • Pipeline, Team & Billing",
        "Senior Account Exec": "Manage Deals, Customers & Quotes",
        "Sales Representative": "Assigned Leads & Customer Follow-ups",
        "Customer Success": "Onboarding, Support & Renewals",
        "Lead Generation": "Create Leads & Qualify Prospects"
    };

    container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Team Management</h1>
        <p class="page-subtitle">Monitor individual sales performance, assigned leads, and role permissions (${data.team.length} members).</p>
      </div>
    </div>

    <div class="team-grid">
      ${data.team
        .map((member) => {
            const memberLeads = data.leads.filter((l) => l.repId === member.id);
            const memberWon = memberLeads.filter((l) => l.stage === "Won");
            const memberRevenue = memberWon.reduce((sum, l) => sum + Number(l.value || 0), 0);
            const contribution =
                totalWonRevenue > 0 ? ((memberRevenue / totalWonRevenue) * 100).toFixed(1) : "0.0";
            const targetPct = Math.min(100, Math.round((memberRevenue / (member.target || 1)) * 100));

            return `
            <div class="card team-card">
              <div class="team-card-top">
                <div class="team-avatar">${member.initials}</div>
                <div>
                  <div class="team-name">${member.name}</div>
                  <div class="team-role">${member.email} • ${member.phone}</div>
                </div>
              </div>

              <div>
                <span class="perm-badge">${rolePermissions[member.role] || "Standard CRM Access"}</span>
              </div>

              <div class="form-group">
                <label>Role Simulation</label>
                <select class="team-role-select" data-rep-id="${member.id}">
                  ${Object.keys(rolePermissions)
            .map(
                (r) => `<option value="${r}" ${r === member.role ? "selected" : ""}>${r}</option>`)
            .join("")}
                </select>
              </div>

              <div class="team-stats-row tabular">
                <div>
                  <div class="team-stat-val">${memberLeads.length}</div>
                  <div class="team-stat-lbl">Assigned Leads</div>
                </div>
                <div>
                  <div class="team-stat-val">${NovaFormat.inr(memberRevenue)}</div>
                  <div class="team-stat-lbl">Won Revenue</div>
                </div>
                <div>
                  <div class="team-stat-val">${contribution}%</div>
                  <div class="team-stat-lbl">Contribution</div>
                </div>
              </div>

              <div class="progress-wrap">
                <div class="progress-head tabular">
                  <span>Target Attainment (${targetPct}%)</span>
                  <span>Target: ${NovaFormat.inr(member.target)}</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width: ${targetPct}%"></div>
                </div>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

    container.querySelectorAll(".team-role-select").forEach((sel) => {
        sel.addEventListener("change", (e) => {
            NovaStore.updateTeamRole(e.target.dataset.repId, e.target.value);
            renderTeamView(container);
        });
    });
}

/* ---------- Settings ---------- */
function renderSettingsView(container) {
    const { profile } = NovaStore.getData();

    container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your personal profile, company workspace, notifications, and appearance.</p>
      </div>
    </div>

    <div class="settings-grid">
      <div class="settings-stack">
        <!-- Personal Profile & Company Info -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Personal Profile &amp; Company Information</h2>
          </div>
          <form id="settings-profile-form" class="modal-form" style="padding: 0;">
            <div class="form-grid">
              <div class="form-group">
                <label for="set-name">Full Name</label>
                <input type="text" id="set-name" value="${profile.name}" required />
              </div>
              <div class="form-group">
                <label for="set-role">Job Title</label>
                <input type="text" id="set-role" value="${profile.role}" required />
              </div>
              <div class="form-group">
                <label for="set-email">Work Email</label>
                <input type="email" id="set-email" value="${profile.email}" required />
              </div>
              <div class="form-group">
                <label for="set-phone">Phone Number</label>
                <input type="tel" id="set-phone" value="${profile.phone}" required />
              </div>
            </div>
            <div class="form-group">
              <label for="set-company">Company Name</label>
              <input type="text" id="set-company" value="${profile.company}" required />
            </div>
            <div>
              <button type="submit" class="btn btn-primary">Save Profile Changes</button>
              <div id="profile-save-msg" class="save-feedback"></div>
            </div>
          </form>
        </div>

        <!-- Password Change UI -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Change Password</h2>
          </div>
          <form id="settings-password-form" class="modal-form" style="padding: 0;">
            <div class="form-grid">
              <div class="form-group">
                <label for="set-pass-current">Current Password</label>
                <input type="password" id="set-pass-current" placeholder="••••••••" required />
              </div>
              <div class="form-group">
                <label for="set-pass-new">New Password</label>
                <input type="password" id="set-pass-new" placeholder="Min. 8 characters" minlength="6" required />
              </div>
            </div>
            <div>
              <button type="submit" class="btn btn-secondary">Update Password</button>
              <div id="password-save-msg" class="save-feedback"></div>
            </div>
          </form>
        </div>
      </div>

      <div class="settings-stack">
        <!-- Appearance Preferences -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Appearance Preferences</h2>
          </div>
          <p class="page-subtitle" style="margin-bottom: 14px;">
            Choose how NOVA CRM looks on this device. Saved automatically in localStorage.
          </p>
          <div class="segmented-control" id="settings-theme-control">
            <button type="button" class="seg-btn ${profile.theme === "light" ? "active" : ""}" data-theme-choice="light">Light Mode</button>
            <button type="button" class="seg-btn ${profile.theme === "dark" ? "active" : ""}" data-theme-choice="dark">Dark Mode</button>
          </div>
        </div>

        <!-- Notification Preferences -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Notification Preferences</h2>
          </div>
          <div class="toggle-row">
            <span>Email alerts for new leads</span>
            <input type="checkbox" id="notif-email" ${profile.notifications?.emailAlerts ? "checked" : ""} />
          </div>
          <div class="toggle-row">
            <span>Pipeline deal stage updates</span>
            <input type="checkbox" id="notif-deals" ${profile.notifications?.dealUpdates ? "checked" : ""} />
          </div>
          <div class="toggle-row">
            <span>Daily overdue task reminders</span>
            <input type="checkbox" id="notif-tasks" ${profile.notifications?.taskReminders ? "checked" : ""} />
          </div>
        </div>

        <!-- Reset Demo Data -->
        <div class="card danger-zone">
          <div class="card-header">
            <h2 class="card-title" style="color: var(--danger);">Reset Demo Data</h2>
          </div>
          <p class="page-subtitle" style="margin-bottom: 14px;">
            Restore all sample Indian SMB customers, pipeline leads, tasks, and team records back to their original state.
          </p>
          <button type="button" class="btn btn-danger" id="reset-demo-btn">Reset Demo Data</button>
        </div>
      </div>
    </div>
  `;

    document.getElementById("settings-profile-form").addEventListener("submit", (e) => {
        e.preventDefault();
        NovaStore.updateProfile({
            name: document.getElementById("set-name").value.trim(),
            role: document.getElementById("set-role").value.trim(),
            email: document.getElementById("set-email").value.trim(),
            phone: document.getElementById("set-phone").value.trim(),
            company: document.getElementById("set-company").value.trim()
        });
        syncUserHeader();
        document.getElementById("profile-save-msg").textContent = "✓ Profile & company details saved.";
    });

    document.getElementById("settings-password-form").addEventListener("submit", (e) => {
        e.preventDefault();
        e.target.reset();
        document.getElementById("password-save-msg").textContent = "✓ Password updated (UI simulation).";
    });

    container.querySelectorAll("[data-theme-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
            NovaStore.updateProfile({
                theme: btn.dataset.themeChoice
            });
            applySavedTheme();
            renderSettingsView(container);
        });
    });

    ["notif-email", "notif-deals", "notif-tasks"].forEach((id) => {
        document.getElementById(id).addEventListener("change", () => {
            NovaStore.updateProfile({
                notifications: {
                    emailAlerts: document.getElementById("notif-email").checked,
                    dealUpdates: document.getElementById("notif-deals").checked,
                    taskReminders: document.getElementById("notif-tasks").checked
                }
            });
        });
    });

    document.getElementById("reset-demo-btn").addEventListener("click", () => {
        const confirmed = window.confirm(
                "Reset all NOVA CRM demo data? Any custom customers, leads, or tasks you added will be replaced with the original sample dataset.");
        if (!confirmed)
            return;
        NovaStore.resetDemoData();
        applySavedTheme();
        syncUserHeader();
        renderNotifications();
        renderSettingsView(container);
    });
}
