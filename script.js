/* KAPITBARYO CORE ARCHITECTURE ENGINE LOGIC SYSTEM */

// SYSTEM DATABASE INITIALIZATION LEDGER MAPPING
const SYSTEM_DB = {
  users: JSON.parse(localStorage.getItem('kb_users')) || [
    { email: 'resident@kapitbaryo.com', password: '123456', name: 'Juan Dela Cruz', phone: '09171234567', dob: '1992-06-15', address: 'Blk 4 Lot 2, Phase 1, Barangay Hall District', role: 'resident' },
    { email: 'admin@kapitbaryo.com', password: 'admin123', name: 'System Administrator Controller', role: 'admin' }
  ],
  requests: JSON.parse(localStorage.getItem('kb_requests')) || [
    { id: 'REQ-8742', userEmail: 'resident@kapitbaryo.com', userName: 'Juan Dela Cruz', type: 'Barangay Clearance', purpose: 'Local Employment onboarding assignment', status: 'Pending', date: '2026-05-10' },
    { id: 'REQ-1294', userEmail: 'resident@kapitbaryo.com', userName: 'Juan Dela Cruz', type: 'Certificate of Residency', purpose: 'Bank Account Requirement', status: 'Approved', date: '2026-04-22' }
  ],
  pulses: JSON.parse(localStorage.getItem('kb_pulses')) || [
    { id: 1001, userEmail: 'resident@kapitbaryo.com', userName: 'Juan Dela Cruz', category: 'Streetlight', desc: 'Corner post main line illumination bulb has flickered out fully, causing dark hazard areas.', status: 'Under Review', likes: 12, likedBy: [], comments: [{ author: 'Admin Support Desk', text: 'Engineering dispatched units to look into baseline switches this Thursday.', date: '2026-05-12' }], date: '2026-05-11', img: '' }
  ],
  announcements: JSON.parse(localStorage.getItem('kb_announcements')) || [
    { id: 501, title: 'Typhoon Operational Precautionary Advisory Protocol', type: 'Emergency Alert', content: 'Severe atmospheric weather updates indicate processing downpours across structural sectors. Emergency response hubs loaded.', date: '2026-05-16' },
    { id: 502, title: 'Community General Assembly Meeting Block', type: 'Barangay Event', content: 'Open forum alignment regarding software platform migrations scheduled inside complex court areas.', date: '2026-05-14' }
  ],
  appointments: JSON.parse(localStorage.getItem('kb_appointments')) || [
    { id: 901, userEmail: 'resident@kapitbaryo.com', date: '2026-05-20', time: '10:00 AM - 11:00 AM' }
  ]
};

// SYNCHRONIZATION TRANSACTION LAYER CONTROL
function commitLocalDB() {
  localStorage.setItem('kb_users', JSON.stringify(SYSTEM_DB.users));
  localStorage.setItem('kb_requests', JSON.stringify(SYSTEM_DB.requests));
  localStorage.setItem('kb_pulses', JSON.stringify(SYSTEM_DB.pulses));
  localStorage.setItem('kb_announcements', JSON.stringify(SYSTEM_DB.announcements));
  localStorage.setItem('kb_appointments', JSON.stringify(SYSTEM_DB.appointments));
  updateDynamicMetrics();
}

let activeUserSession = JSON.parse(localStorage.getItem('kb_activeSession')) || null;
let imagePreviewCacheData = "";

// ROUTING MATRIX STATE CONTROLLER ENGINE
function navigate(targetPageID) {
  document.querySelectorAll('.page').forEach(view => view.classList.remove('active'));
  
  // SESSION GUARD PROTECTIONS OVERLAY
  if (targetPageID === 'dashboard' && (!activeUserSession || activeUserSession.role !== 'resident')) targetPageID = 'login';
  if (targetPageID === 'admin' && (!activeUserSession || activeUserSession.role !== 'admin')) targetPageID = 'login';

  const targetElement = document.getElementById(`page-${targetPageID}`);
  if (targetElement) {
    targetElement.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // NAVIGATION BAR ADAPTABILITY PROFILE
  const navbarElement = document.getElementById('public-nav');
  const footerElement = document.getElementById('landing-footer');
  if (targetPageID === 'dashboard' || targetPageID === 'admin') {
    navbarElement.style.display = 'none';
    footerElement.style.display = 'none';
  } else {
    navbarElement.style.display = 'flex';
    footerElement.style.display = 'block';
  }

  // INTERNALS CONTEXTUAL INITIALIZATION INTERFACE
  if (targetPageID === 'services') renderServicesCatalogue();
  if (targetPageID === 'pulse') renderPulseFeed();
  if (targetPageID === 'announcements') renderAnnouncements();
  if (targetPageID === 'dashboard') setupResidentDashboardUI();
  if (targetPageID === 'admin') setupAdminDashboardUI();
  
  updateDynamicMetrics();
  
  // Close mobile nav menu wrapper upon tracking navigation executions
  const links = document.getElementById('nav-links');
  if (links) links.classList.remove('active');
}

// APPLICATION INITIAL WINDOW DISPATCH HOOK
window.addEventListener('DOMContentLoaded', () => {
  setupCoreEventListeners();
  updateAuthNavigationControls();
  
  // Detect current initialization page placement status checks
  if (activeUserSession) {
    navigate(activeUserSession.role === 'admin' ? 'admin' : 'dashboard');
  } else {
    navigate('home');
  }

  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  }, 600);
});

// CORE EVENT LISTENERS CENTRAL HOOK
function setupCoreEventListeners() {
  document.getElementById('login-form')?.addEventListener('submit', handleLoginValidation);
  document.getElementById('register-form')?.addEventListener('submit', handleRegistrationValidation);
  document.getElementById('pulse-submission-form')?.addEventListener('submit', handlePulseSubmission);
  document.getElementById('dash-doc-form')?.addEventListener('submit', handleDocumentApplicationSubmit);
  document.getElementById('dash-appointment-form')?.addEventListener('submit', handleAppointmentBooking);
  document.getElementById('admin-announcement-form')?.addEventListener('submit', handleAdminNoticePublish);
}

// MANAGEMENT OF SYSTEM UTILITY NOTIFICATIONS
function showToast(textMsg, variant = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const alertBox = document.createElement('div');
  alertBox.className = `toast ${variant} glass`;
  alertBox.innerHTML = `<span>${variant === 'success' ? '💡' : '⚠️'}</span> <span>${textMsg}</span>`;
  container.appendChild(alertBox);
  setTimeout(() => { alertBox.remove(); }, 3500);
}

// TOGGLE RESPONSIVE MOBILE BAR OVERLAYS
function toggleMobileNav() {
  document.getElementById('nav-links')?.classList.toggle('active');
}

// APPLICATION STYLE INTERACTION RULES (DARK MODE)
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  showToast("Interface display layout visual spectrum inverted.", "success");
}

function togglePasswordVisibility(targetInputID) {
  const element = document.getElementById(targetInputID);
  if (!element) return;
  element.type = element.type === 'password' ? 'text' : 'password';
}

// PUBLIC VISIBILITY NAVIGATION MAPPING SWITCHES
function updateAuthNavigationControls() {
  const container = document.getElementById('auth-buttons');
  if (!container) return;
  if (activeUserSession) {
    container.innerHTML = `
      <button class="btn btn-outline" onclick="navigate('${activeUserSession.role === 'admin' ? 'admin' : 'dashboard'}')">Panel Workspace</button>
      <button class="btn btn-danger" onclick="logout()">Logout</button>
    `;
  } else {
    container.innerHTML = `
      <button class="btn btn-outline" onclick="navigate('login')">Login</button>
      <button class="btn btn-primary" onclick="navigate('register')">Register</button>
    `;
  }
}

// LOGOUT MANAGEMENT PROTOCOLS
function logout() {
  localStorage.removeItem('kb_activeSession');
  activeUserSession = null;
  updateAuthNavigationControls();
  showToast("Active session cleared safely. Retransitioning interface.", "success");
  navigate('home');
}

// FILL CHOSEN DEMO VALUES SHORTCUT
function fillDemo(typeRole) {
  if (typeRole === 'resident') {
    document.getElementById('login-email').value = "resident@kapitbaryo.com";
    document.getElementById('login-password').value = "123456";
  } else {
    document.getElementById('login-email').value = "admin@kapitbaryo.com";
    document.getElementById('login-password').value = "admin123";
  }
  showToast("Demo profile shortcuts structural elements mapped down.", "success");
}

// SECURITY AUTHPASS HANDLERS LAYER
function handleLoginValidation(e) {
  e.preventDefault();
  const mailVal = document.getElementById('login-email').value.trim();
  const passVal = document.getElementById('login-password').value;

  const profileMatch = SYSTEM_DB.users.find(u => u.email.toLowerCase() === mailVal.toLowerCase() && u.password === passVal);
  if (profileMatch) {
    activeUserSession = profileMatch;
    localStorage.setItem('kb_activeSession', JSON.stringify(profileMatch));
    updateAuthNavigationControls();
    showToast(`Access granted. Welcome back ${profileMatch.name}!`, "success");
    navigate(profileMatch.role === 'admin' ? 'admin' : 'dashboard');
  } else {
    showToast("Credentials mismatch detected inside active directory.", "error");
  }
}

function handleRegistrationValidation(e) {
  e.preventDefault();
  const pass = document.getElementById('reg-password').value;
  const match = document.getElementById('reg-confirm').value;

  if (pass !== match) {
    showToast("Password integrity arrays validation mismatch.", "error");
    return;
  }

  const mailInput = document.getElementById('reg-email').value.trim();
  if (SYSTEM_DB.users.some(u => u.email.toLowerCase() === mailInput.toLowerCase())) {
    showToast("Target credential entry allocation exists inside registry records.", "error");
    return;
  }

  const identityProfile = {
    email: mailInput,
    password: pass,
    name: document.getElementById('reg-name').value.trim(),
    phone: document.getElementById('reg-phone').value.trim(),
    dob: document.getElementById('reg-dob').value,
    address: document.getElementById('reg-address').value.trim(),
    role: 'resident'
  };

  SYSTEM_DB.users.push(identityProfile);
  commitLocalDB();
  showToast("Profile ledger registration successfully established.", "success");
  document.getElementById('register-form').reset();
  navigate('login');
}

// SERVICES MANAGEMENT SCHEMATIC SYSTEM MAP
const SERVICES_LEDGER = [
  { name: 'Barangay Clearance', desc: 'Required credential profile validation layout mapping framework used inside job tracking applications.', rules: 'Requires: 1 Valid Government Identification Card.', cost: '₱20', time: '15-30 Minutes Immediate Processing' },
  { name: 'Certificate of Residency', desc: 'Official validation authentication statement verification certifying your localized address structural mapping.', rules: 'Requires: Proof of tenancy statement or monthly bill address markers.', cost: '₱20', time: '10 Minutes Fulfillment Time' },
  { name: 'Indigency Certificate', desc: 'Waiver confirmation framework providing subsidized social assistance pathways.', rules: 'Requires: Referral confirmation layout form from community leader.', cost: 'Free', time: 'Immediate Issuance' },
  { name: 'Business Permit Clearance', desc: 'Sanction tracking permissions operational matrix processing clearance maps.', rules: 'Requires: DTI Ledger Certification, Local location blueprint overview data.', cost: '₱20', time: '1 Business Processing Day' },
  { name: 'Cedula', desc: 'Community Tax Certificate operational validation token ledger configuration document.', rules: 'Requires: Computed declarations proof parameters or signature logs.', cost: '₱20', time: '5 Minute Counter Fulfillment' }
];

function renderServicesCatalogue() {
  const container = document.getElementById('services-grid-list');
  if (!container) return;
  container.innerHTML = SERVICES_LEDGER.map(s => `
    <div class="card glass">
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <p style="font-size:0.85rem; color:var(--text-light); font-style:italic;">${s.rules}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; pt-2;">
        <div><strong>Price: ${s.cost}</strong><br><small style="color:var(--text-light);">${s.time}</small></div>
        <button class="btn btn-primary" onclick="initiateDirectDocumentRequest('${s.name}')">Apply Now</button>
      </div>
    </div>
  `).join('');
}

function initiateDirectDocumentRequest(docNameTitle) {
  if (!activeUserSession || activeUserSession.role !== 'resident') {
    showToast("Active user secure session allocation is required to perform processing tasks.", "error");
    navigate('login');
    return;
  }
  navigate('dashboard');
  switchDashTab('dash-request', document.querySelector('[onclick*="dash-request"]'));
  document.getElementById('dash-req-type').value = docNameTitle;
  updateDashPriceValue();
}

// COMMUNITY PULSE INTERACTION ENGINE CONTROLLER
function previewPulseImage(evt) {
  const read = new FileReader();
  read.onload = function() {
    imagePreviewCacheData = read.result;
    const box = document.getElementById('pulse-img-preview');
    if (box) { box.src = read.result; box.style.display = 'block'; }
  };
  if(evt.target.files[0]) read.readAsDataURL(evt.target.files[0]);
}

function handlePulseSubmission(e) {
  e.preventDefault();
  if (!activeUserSession) {
    showToast("Anonymous submissions restricted. Secure entity session allocation required.", "error");
    navigate('login');
    return;
  }

  const payload = {
    id: Date.now(),
    userEmail: activeUserSession.email,
    userName: activeUserSession.name,
    category: document.getElementById('pulse-category').value,
    desc: document.getElementById('pulse-desc').value.trim(),
    status: 'Pending',
    likes: 0,
    likedBy: [],
    comments: [],
    date: new Date().toISOString().split('T')[0],
    img: imagePreviewCacheData
  };

  SYSTEM_DB.pulses.push(payload);
  commitLocalDB();
  showToast("Public infrastructure concern safely recorded into global ledger monitoring boards.", "success");
  document.getElementById('pulse-submission-form').reset();
  const preview = document.getElementById('pulse-img-preview');
  if (preview) preview.style.display = 'none';
  imagePreviewCacheData = "";
  renderPulseFeed();
}

function renderPulseFeed() {
  const viewFeed = document.getElementById('pulse-container-feed');
  if (!viewFeed) return;

  const keySearch = document.getElementById('pulse-search')?.value.toLowerCase() || "";
  const filterCat = document.getElementById('pulse-filter')?.value || "ALL";

  let dataset = SYSTEM_DB.pulses.filter(item => {
    const matchKey = item.desc.toLowerCase().includes(keySearch) || item.userName.toLowerCase().includes(keySearch);
    const matchCat = filterCat === 'ALL' || item.category === filterCat;
    return matchKey && matchCat;
  });

  if (dataset.length === 0) {
    viewFeed.innerHTML = `<div class="card glass text-center"><p>No public concern records match query filters.</p></div>`;
    return;
  }

  viewFeed.innerHTML = dataset.slice().reverse().map(p => `
    <div class="card glass" style="margin-bottom:1.5rem;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div><strong>👤 ${p.userName}</strong> <small style="color:var(--text-light); margin-left:10px;">${p.date}</small></div>
        <span class="badge badge-${p.status.toLowerCase().replace(/\s/g, '')}">${p.status}</span>
      </div>
      <p><strong>Category Tag:</strong> <span style="color:var(--primary); font-weight:600;">${p.category}</span></p>
      <p style="font-size:1rem; line-height:1.4;">${p.desc}</p>
      ${p.img ? `<img src="${p.img}" style="max-width:100%; max-height:260px; border-radius:8px; margin:5px 0; object-fit:cover;">` : ''}
      
      <div style="display:flex; gap:15px; margin-top:10px; border-top:1px solid var(--glass-border); padding-top:10px;">
        <button class="btn btn-outline" style="padding:4px 12px; font-size:0.85rem;" onclick="executePulseReaction(${p.id})">👍 Endorse (${p.likes})</button>
      </div>

      <div style="background:rgba(0,0,0,0.02); padding:10px; border-radius:8px; margin-top:10px;">
        <h5 style="margin-bottom:5px;">System Comments Register (${p.comments.length})</h5>
        <div style="display:flex; flex-direction:column; gap:5px; max-height:150px; overflow-y:auto; margin-bottom:10px;">
          ${p.comments.map(c => `<div style="font-size:0.82rem;"><strong>${c.author}:</strong> ${c.text} <small style="color:var(--text-light); float:right;">${c.date}</small></div>`).join('')}
        </div>
        <div style="display:flex; gap:5px;">
          <input type="text" placeholder="Write feedback commentary..." id="cmt-input-${p.id}" style="padding:5px 10px; font-size:0.82rem; flex:1;">
          <button class="btn btn-primary" style="padding:4px 10px; font-size:0.82rem;" onclick="appendPulseCommentary(${p.id})">Post</button>
        </div>
      </div>
    </div>
  `).join('');
}

function executePulseReaction(pulseKeyID) {
  if (!activeUserSession) return showToast("Authentication check failed.", "error");
  const row = SYSTEM_DB.pulses.find(p => p.id === pulseKeyID);
  if (!row) return;
  
  if (!row.likedBy) row.likedBy = [];
  if (row.likedBy.includes(activeUserSession.email)) {
    showToast("Feedback interaction validation already exists on entity.", "error");
    return;
  }

  row.likes++;
  row.likedBy.push(activeUserSession.email);
  commitLocalDB();
  renderPulseFeed();
}

function appendPulseCommentary(pId) {
  if (!activeUserSession) return showToast("Authentication verification configuration required.", "error");
  const targetedInput = document.getElementById(`cmt-input-${pId}`);
  if (!targetedInput || !targetedInput.value.trim()) return;

  const matchPulse = SYSTEM_DB.pulses.find(p => p.id === pId);
  if (matchPulse) {
    matchPulse.comments.push({
      author: activeUserSession.name,
      text: targetedInput.value.trim(),
      date: new Date().toISOString().split('T')[0]
    });
    commitLocalDB();
    targetedInput.value = "";
    renderPulseFeed();
    showToast("Feedback comment committed safely into concern card.", "success");
  }
}

// ANNOUNCEMENTS DATA ENGINE
function renderAnnouncements() {
  const container = document.getElementById('announcements-display-list');
  if (!container) return;

  const keyText = document.getElementById('announcement-search')?.value.toLowerCase() || "";
  const filterType = document.getElementById('announcement-filter')?.value || "ALL";

  const targetSet = SYSTEM_DB.announcements.filter(a => {
    const checkKey = a.title.toLowerCase().includes(keyText) || a.content.toLowerCase().includes(keyText);
    const checkType = filterType === 'ALL' || a.type === filterType;
    return checkKey && checkType;
  });

  if (targetSet.length === 0) {
    container.innerHTML = `<div class="card glass text-center" style="grid-column: 1/-1;"><p>No announcements currently match selection parameters.</p></div>`;
    return;
  }

  container.innerHTML = targetSet.slice().reverse().map(a => `
    <div class="card glass" style="border-left: 5px solid ${a.type === 'Emergency Alert' ? 'var(--danger)' : 'var(--primary)'};">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="badge" style="background:var(--primary-light); color:var(--primary); font-weight:700;">${a.type}</span>
        <small style="color:var(--text-light); font-weight:500;">${a.date}</small>
      </div>
      <h3>${a.title}</h3>
      <p style="font-size:0.95rem; line-height:1.5; color:var(--text-dark);">${a.content}</p>
      <button class="btn btn-outline" style="align-self: flex-start; padding: 4px 10px; font-size: 0.8rem;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'">Toggle Full Metadata Trace</button>
      <div style="display:none; font-size:0.75rem; background:rgba(0,0,0,0.03); padding:8px; border-radius:5px; margin-top:5px; font-family:monospace; color:var(--text-light);">
        System-ID Trace Link Verification Code: SHA256-${a.id}x9841
      </div>
    </div>
  `).join('');
}

// RESIDENT DASHBOARD TAB AND INTERACTION RULES CONTROL
function switchDashTab(tabElementID, buttonNode) {
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sidebar-links button').forEach(b => b.classList.remove('active'));
  
  document.getElementById(tabElementID)?.classList.add('active');
  buttonNode?.classList.add('active');
}

function updateDashPriceValue() {
  const selection = document.getElementById('dash-req-type').value;
  document.getElementById('dash-price-tag').innerText = selection === 'Indigency Certificate' ? 'Free' : '₱20';
}

function setupResidentDashboardUI() {
  if (!activeUserSession) return;
  document.getElementById('dash-user-display').innerText = activeUserSession.name;
  
  const userDocs = SYSTEM_DB.requests.filter(r => r.userEmail === activeUserSession.email);
  document.getElementById('user-count-total').innerText = userDocs.length;
  document.getElementById('user-count-pending').innerText = userDocs.filter(r => r.status === 'Pending').length;
  document.getElementById('user-count-ready').innerText = userDocs.filter(r => r.status === 'Ready for Pickup').length;

  // Render recent listings inside overview box
  const noticesBox = document.getElementById('dash-recent-announcements');
  if (noticesBox) {
    noticesBox.innerHTML = SYSTEM_DB.announcements.slice(-2).reverse().map(a => `
      <div style="border-bottom: 1px solid var(--glass-border); padding: 8px 0;">
        <strong>[${a.type}] ${a.title}</strong> - <span style="font-size:0.8rem; color:var(--text-light);">${a.date}</span>
      </div>
    `).join('') || "<p>No recent bulletins.</p>";
  }

  // Populate dynamic records processing history datatable
  const tableBody = document.getElementById('resident-requests-table');
  if (tableBody) {
    if (userDocs.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No document logs associated with account.</td></tr>`;
    } else {
      tableBody.innerHTML = userDocs.slice().reverse().map(r => `
        <tr>
          <td style="font-family:monospace; font-weight:600; color:var(--primary);">${r.id}</td>
          <td><strong>${r.type}</strong></td>
          <td style="color:var(--text-light); font-size:0.85rem;">${r.purpose}</td>
          <td><span class="badge badge-${r.status.toLowerCase().replace(/\s/g, '')}">${r.status}</span></td>
          <td><button class="btn btn-outline" style="padding:2px 8px; font-size:0.8rem;" onclick="viewPrintReceiptInvoice('${r.id}')">View Invoice</button></td>
        </tr>
      `).join('');
    }
  }

  // Populate dynamic appointments listing container
  const appointmentsBox = document.getElementById('user-appointments-list');
  if (appointmentsBox) {
    const userAppts = SYSTEM_DB.appointments.filter(a => a.userEmail === activeUserSession.email);
    appointmentsBox.innerHTML = userAppts.map(a => `
      <div class="glass" style="padding:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; border-left:4px solid var(--secondary);">
        <div>📅 <strong>${a.date}</strong><br><small style="color:var(--text-light);">${a.time}</small></div>
        <button class="btn btn-danger" style="padding:2px 6px; font-size:0.75rem;" onclick="cancelAppointmentItem(${a.id})">Cancel</button>
      </div>
    `).join('') || `<p style="font-size:0.85rem; color:var(--text-light);">No reserved slots linked to profile.</p>`;
  }
}

function handleDocumentApplicationSubmit(e) {
  e.preventDefault();
  const queueKey = 'REQ-' + Math.floor(1000 + Math.random() * 9000);
  const applicationPayload = {
    id: queueKey,
    userEmail: activeUserSession.email,
    userName: activeUserSession.name,
    type: document.getElementById('dash-req-type').value,
    purpose: document.getElementById('dash-req-purpose').value.trim(),
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  };

  SYSTEM_DB.requests.push(applicationPayload);
  commitLocalDB();
  showToast(`Application successfully processed. Tracker: ${queueKey}`, "success");
  document.getElementById('dash-doc-form').reset();
  setupResidentDashboardUI();
  viewPrintReceiptInvoice(queueKey);
}

function handleAppointmentBooking(e) {
  e.preventDefault();
  const dateTarget = document.getElementById('appt-date').value;
  const timeTarget = document.getElementById('appt-time').value;

  // Prevent double booking checking mechanism
  const collision = SYSTEM_DB.appointments.some(a => a.date === dateTarget && a.time === timeTarget);
  if (collision) {
    showToast("The targeted operational time segment has already been fully reserved. Please pick alternative hours.", "error");
    return;
  }

  SYSTEM_DB.appointments.push({
    id: Date.now(),
    userEmail: activeUserSession.email,
    date: dateTarget,
    time: timeTarget
  });
  commitLocalDB();
  showToast("Pickup slot successfully locked and certified.", "success");
  document.getElementById('dash-appointment-form').reset();
  setupResidentDashboardUI();
}

function cancelAppointmentItem(apptKey) {
  SYSTEM_DB.appointments = SYSTEM_DB.appointments.filter(a => a.id !== apptKey);
  commitLocalDB();
  showToast("Pickup appointment slot released.", "success");
  setupResidentDashboardUI();
}

// INVOICE RECEIPT METRICS GENERATOR
function viewPrintReceiptInvoice(reqUid) {
  const fileRow = SYSTEM_DB.requests.find(r => r.id === reqUid);
  if (!fileRow) return;

  document.getElementById('rcpt-id').innerText = fileRow.id;
  document.getElementById('rcpt-name').innerText = fileRow.userName;
  document.getElementById('rcpt-type').innerText = fileRow.type;
  document.getElementById('rcpt-purpose').innerText = fileRow.purpose;
  
  const statusBadge = document.getElementById('rcpt-status');
  statusBadge.className = `badge badge-${fileRow.status.toLowerCase().replace(/\s/g, '')}`;
  statusBadge.innerText = fileRow.status;

  document.getElementById('receipt-modal-view').classList.add('active');
}

function closeReceiptModal() {
  document.getElementById('receipt-modal-view').classList.remove('active');
}

// ADMIN PANEL TAB AND CORE ACTION LOGIC CONTROLLER
function switchAdminTab(targetTabUid, elementBtn) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  elementBtn.closest('.sidebar-links').querySelectorAll('button').forEach(b => b.classList.remove('active'));
  
  document.getElementById(targetTabUid)?.classList.add('active');
  elementBtn?.classList.add('active');
}

function setupAdminDashboardUI() {
  document.getElementById('adm-stat-users').innerText = SYSTEM_DB.users.filter(u => u.role !== 'admin').length;
  document.getElementById('adm-stat-docs').innerText = SYSTEM_DB.requests.length;
  document.getElementById('adm-stat-concerns').innerText = SYSTEM_DB.pulses.length;

  // Render core registered residents roster
  const rosterBox = document.getElementById('admin-user-roster-list');
  if (rosterBox) {
    const residents = SYSTEM_DB.users.filter(u => u.role !== 'admin');
    rosterBox.innerHTML = residents.map(u => `
      <li style="font-size:0.85rem; padding: 6px; border-bottom: 1px solid var(--glass-border);">
        <strong>👤 ${u.name}</strong> — Email: ${u.email} | Tel: ${u.phone || 'N/A'} <br>
        <span style="color:var(--text-light); font-size:0.78rem;">📍 Address: ${u.address || 'Not Declared'}</span>
      </li>
    `).join('') || "<li>No registered system profiles available.</li>";
  }

  // Populate administrative processing list tables
  const requestsTbody = document.getElementById('admin-global-requests-table');
  if (requestsTbody) {
    requestsTbody.innerHTML = SYSTEM_DB.requests.map(r => `
      <tr>
        <td style="font-family:monospace; font-weight:600;">${r.id}</td>
        <td><strong>${r.userName}</strong></td>
        <td>${r.type}</td>
        <td>
          <select class="glass" style="padding:4px 8px; font-size:0.82rem;" onchange="adminModifyRequestStatus('${r.id}', this.value)">
            <option value="Pending" ${r.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Processing" ${r.status === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Approved" ${r.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Ready for Pickup" ${r.status === 'Ready for Pickup' ? 'selected' : ''}>Ready for Pickup</option>
            <option value="Completed" ${r.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Rejected" ${r.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </td>
        <td>
          <button class="btn btn-outline" style="padding:2px 8px; font-size:0.75rem;" onclick="viewPrintReceiptInvoice('${r.id}')">Inspect</button>
        </td>
      </tr>
    `).join('') || `<tr><td colspan="5" class="text-center">No document entries filed.</td></tr>`;
  }

  // Populate administrative public pulse management records
  const concernsTbody = document.getElementById('admin-global-concerns-table');
  if (concernsTbody) {
    concernsTbody.innerHTML = SYSTEM_DB.pulses.map(p => `
      <tr>
        <td style="font-family:monospace; font-size:0.8rem;">#${p.id}</td>
        <td><strong>${p.userName}</strong></td>
        <td><span style="color:var(--primary); font-weight:600;">${p.category}</span></td>
        <td style="font-size:0.85rem; max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.desc}</td>
        <td>
          <select class="glass" style="padding:4px 8px; font-size:0.82rem;" onchange="adminModifyConcernStatus(${p.id}, this.value)">
            <option value="Pending" ${p.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Under Review" ${p.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
            <option value="In Progress" ${p.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${p.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
          </select>
        </td>
        <td>
          <button class="btn btn-danger" style="padding:2px 8px; font-size:0.75rem;" onclick="adminPurgeConcernReport(${p.id})">Delete</button>
        </td>
      </tr>
    `).join('') || `<tr><td colspan="6" class="text-center">No reported community public entries recorded.</td></tr>`;
  }

  // Render administrative bulletin notices lists
  const noticesControlBox = document.getElementById('admin-notices-control-list');
  if (noticesControlBox) {
    noticesControlBox.innerHTML = SYSTEM_DB.announcements.map(a => `
      <div class="glass" style="padding:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
        <div><strong>${a.title}</strong><br><small style="color:var(--text-light);">${a.type} | ${a.date}</small></div>
        <button class="btn btn-danger" style="padding:2px 6px; font-size:0.72rem;" onclick="adminRevokeNoticeBulletin(${a.id})">Revoke</button>
      </div>
    `).join('') || `<p style="font-size:0.85rem; color:var(--text-light);">No active published notices listed.</p>`;
  }

  generateVisualAnalyticsBars();
}

function adminModifyRequestStatus(reqId, newStatus) {
  const matchObj = SYSTEM_DB.requests.find(r => r.id === reqId);
  if (matchObj) {
    matchObj.status = newStatus;
    commitLocalDB();
    showToast(`Application code status tracker updated over to ${newStatus}`, "success");
    setupAdminDashboardUI();
  }
}

function adminModifyConcernStatus(pId, newStatus) {
  const matchingPulse = SYSTEM_DB.pulses.find(p => p.id === pId);
  if (matchingPulse) {
    matchingPulse.status = newStatus;
    commitLocalDB();
    showToast(`Public concern workflow shifted over to: ${newStatus}`, "success");
    setupAdminDashboardUI();
  }
}

function adminPurgeConcernReport(pId) {
  if(!confirm("Execute permanent removal purge of concern card data?")) return;
  SYSTEM_DB.pulses = SYSTEM_DB.pulses.filter(p => p.id !== pId);
  commitLocalDB();
  showToast("Concern record entry erased from global feed dashboards.", "success");
  setupAdminDashboardUI();
}

function handleAdminNoticePublish(e) {
  e.preventDefault();
  SYSTEM_DB.announcements.push({
    id: Date.now(),
    title: document.getElementById('ann-title').value.trim(),
    type: document.getElementById('ann-type').value,
    content: document.getElementById('ann-content').value.trim(),
    date: new Date().toISOString().split('T')[0]
  });
  commitLocalDB();
  showToast("Official bulletin announcement deployed live to public notice layers.", "success");
  document.getElementById('admin-announcement-form').reset();
  setupAdminDashboardUI();
}

function adminRevokeNoticeBulletin(annId) {
  SYSTEM_DB.announcements = SYSTEM_DB.announcements.filter(a => a.id !== annId);
  commitLocalDB();
  showToast("Official public notice entry revoked from client interfaces.", "success");
  setupAdminDashboardUI();
}

// SIMULATED JAVASCRIPT ANALYTICS GENERATION BAR ENGINE
function generateVisualAnalyticsBars() {
  const chartWrapper = document.getElementById('admin-chart-area');
  if (!chartWrapper) return;

  // Process item categorical calculations
  const mappingCounters = {};
  SYSTEM_DB.requests.forEach(r => {
    mappingCounters[r.type] = (mappingCounters[r.type] || 0) + 1;
  });

  const aggregateLimitMax = Math.max(...Object.values(mappingCounters), 1);

  chartWrapper.innerHTML = Object.keys(mappingCounters).map(key => {
    const percentWidth = (mappingCounters[key] / aggregateLimitMax) * 100;
    return `
      <div class="chart-bar-row" style="margin-bottom: 12px;">
        <div class="chart-bar-wrapper">
          <div class="chart-bar-label">${key}</div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="width: ${percentWidth}%"></div>
          </div>
          <div style="font-size:0.85rem; font-weight:700; width:30px; text-align:right;">${mappingCounters[key]}</div>
        </div>
      </div>
    `;
  }).join('') || `<p style="font-size:0.85rem; color:var(--text-light); text-align:center;">Insufficient data inside application vectors to map trend lines.</p>`;
}

// PERFORMANCE COUNTER AND PUBLIC STATS AUTOMATED CALCULATIONS LAYER
function updateDynamicMetrics() {
  const resLabel = document.getElementById('stat-residents');
  const docLabel = document.getElementById('stat-docs');
  const resvLabel = document.getElementById('stat-resolved');
  const actLabel = document.getElementById('stat-active');

  if (resLabel) resLabel.innerText = SYSTEM_DB.users.filter(u => u.role !== 'admin').length;
  if (docLabel) docLabel.innerText = SYSTEM_DB.requests.length;
  if (resvLabel) resvLabel.innerText = SYSTEM_DB.pulses.filter(p => p.status === 'Resolved').length;
  if (actLabel) actLabel.innerText = SYSTEM_DB.announcements.length;
}

function handleContactSubmit(e) {
  e.preventDefault();
  showToast("Your message tracking array has been dispatched into the simulation matrix.", "success");
  e.target.reset();
}