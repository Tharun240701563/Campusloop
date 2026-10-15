/**
 * ========================================================
 * CampusLoop — JavaScript Logic File
 * Beginner-friendly code for college web programming project
 * ========================================================
 */

// Key constants for localStorage
const STORAGE_KEYS = {
  LOST_FOUND: 'campusloop_lost_found',
  MATERIALS: 'campusloop_materials',
  MARKETPLACE: 'campusloop_marketplace',
  REGISTRATIONS: 'campusloop_registrations'
};

/**
 * --------------------------------------------------------
 * 1. Sample Data (Loaded only when user visits for the first time)
 * --------------------------------------------------------
 */
const DEFAULT_LOST_FOUND = [
  {
    id: 'lf-1',
    type: 'Found',
    name: 'Casio fx-991EX Scientific Calculator',
    category: 'Stationery & Books',
    location: 'Central Library 2nd Floor Reading Room',
    contact: 'library-desk@college.edu',
    description: 'Found on table 12. Has a small blue sticker on the back cover.'
  },
  {
    id: 'lf-2',
    type: 'Lost',
    name: 'Navy Blue Fastrack Backpack',
    category: 'Wallets & Bags',
    location: 'Near Student Cafeteria Benches',
    contact: 'rohit.sharma@college.edu',
    description: 'Contains a spiral notebook and an engineering drawing scale ruler.'
  }
];

const DEFAULT_MATERIALS = [
  {
    id: 'mat-1',
    title: 'Data Structures & Algorithms Handwritten Notes',
    subject: 'Computer Science',
    category: 'Lecture Notes',
    author: 'Aarav (4th Sem)',
    link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 'mat-2',
    title: 'Engineering Mathematics III Previous Year Papers (2022-2025)',
    subject: 'Mathematics',
    category: 'Exam Papers (PYQ)',
    author: 'Priya (Student Council)',
    link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }
];

const DEFAULT_MARKETPLACE = [
  {
    id: 'mp-1',
    name: 'Standard Engineering Mini Drafter & Sheet Container',
    price: 350,
    category: 'Drafting & Lab Kits',
    contact: '9876543210',
    description: 'Barely used 1st year mechanical drawing tool. Complete with clamp and scales.'
  },
  {
    id: 'mp-2',
    name: 'Let Us C (Yashavant Kanetkar 18th Edition)',
    price: 180,
    category: 'Textbooks',
    contact: 'aditi.c@college.edu',
    description: 'Neat textbook in good condition with no missing pages. Great for beginners.'
  }
];

// Sample fixed college events
const COLLEGE_EVENTS = [
  {
    id: 'evt-1',
    title: 'HackMatrix 2026 — 24H Campus Hackathon',
    date: 'March 28, 2026 • 10:00 AM',
    venue: 'Main Auditorium & CS Labs',
    category: 'Technical Hackathon',
    description: 'Build web, mobile, and AI prototypes in 24 hours. Free meals, swags, and exciting cash prizes for winners!'
  },
  {
    id: 'evt-2',
    title: 'Campus Career & Internship Fair',
    date: 'April 05, 2026 • 09:30 AM',
    venue: 'Campus Sports Complex',
    category: 'Career Fair',
    description: 'Meet hiring managers and startup recruiters. Bring copies of your resume for on-the-spot interviews.'
  },
  {
    id: 'evt-3',
    title: 'Aura 2026 — Annual Cultural Music Fest',
    date: 'April 14, 2026 • 05:00 PM',
    venue: 'Open Air Amphitheatre',
    category: 'Cultural Fest',
    description: 'An evening of live band performances, street plays, and dance battles by various college clubs.'
  },
  {
    id: 'evt-4',
    title: 'Hands-on Web Development Workshop',
    date: 'April 20, 2026 • 02:00 PM',
    venue: 'Seminar Hall B, Block 3',
    category: 'Skill Workshop',
    description: 'Learn modern HTML, CSS, JavaScript, and GitHub basics. Laptops recommended.'
  }
];

/**
 * --------------------------------------------------------
 * 2. Helper Functions for LocalStorage
 * --------------------------------------------------------
 */
// Safely get data from localStorage (or return fallback)
function getStoredData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error('Error reading localStorage key:', key, error);
    return fallback;
  }
}

// Safely save data to localStorage
function saveStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing localStorage key:', key, error);
  }
}

/**
 * --------------------------------------------------------
 * 3. Notification Toast Message
 * --------------------------------------------------------
 */
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  toastMessage.textContent = message;
  toast.classList.remove('hidden');

  if (isError) {
    toast.classList.add('error');
  } else {
    toast.classList.remove('error');
  }

  // Automatically hide toast after 3.5 seconds
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

/**
 * --------------------------------------------------------
 * 4. Page Navigation & Section Switching
 * --------------------------------------------------------
 */
function navigateTo(sectionId) {
  // If no sectionId or section not found, fallback to 'home'
  if (!sectionId || !document.getElementById(sectionId)) {
    sectionId = 'home';
  }

  // Hide all sections explicitly
  const sections = document.querySelectorAll('.page-section');
  sections.forEach((sec) => {
    sec.classList.remove('active');
    sec.style.display = 'none';
  });

  // Show target section explicitly
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.style.display = 'block';
  }

  // Update navbar links active styling
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Close mobile menu if open
  const navMenu = document.getElementById('nav-menu');
  if (navMenu) {
    navMenu.classList.remove('open');
  }

  // Scroll smoothly to top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update browser address bar hash without full page reload
  try {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, '#' + sectionId);
    } else {
      window.location.hash = sectionId;
    }
  } catch (err) {
    // Graceful fallback for file:// protocol
    window.location.hash = sectionId;
  }
}

/**
 * --------------------------------------------------------
 * 5. Update Home Page Counters
 * --------------------------------------------------------
 */
function updateHomeCounters() {
  const materials = getStoredData(STORAGE_KEYS.MATERIALS, DEFAULT_MATERIALS);
  const lostFound = getStoredData(STORAGE_KEYS.LOST_FOUND, DEFAULT_LOST_FOUND);
  const marketplace = getStoredData(STORAGE_KEYS.MARKETPLACE, DEFAULT_MARKETPLACE);

  const matCountEl = document.getElementById('stat-materials-count');
  const lfCountEl = document.getElementById('stat-lost-count');
  const mpCountEl = document.getElementById('stat-market-count');

  if (matCountEl) matCountEl.textContent = materials.length;
  if (lfCountEl) lfCountEl.textContent = lostFound.length;
  if (mpCountEl) mpCountEl.textContent = marketplace.length;
}

/**
 * --------------------------------------------------------
 * 6. Lost & Found Module
 * --------------------------------------------------------
 */
function renderLostFound() {
  const items = getStoredData(STORAGE_KEYS.LOST_FOUND, DEFAULT_LOST_FOUND);
  const listContainer = document.getElementById('lost-found-list');
  const searchVal = document.getElementById('lf-search').value.toLowerCase().trim();
  const filterType = document.getElementById('lf-filter-type').value;

  // Filter items based on user search and dropdown selection
  const filtered = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchVal) ||
      item.location.toLowerCase().includes(searchVal) ||
      item.description.toLowerCase().includes(searchVal);

    const matchesType = filterType === 'all' || item.type === filterType;

    return matchesSearch && matchesType;
  });

  // Empty state handling
  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔎</div>
        <h4>No matching items found</h4>
        <p>Try clearing your search or add a new report using the form.</p>
      </div>
    `;
    return;
  }

  // Render cards
  listContainer.innerHTML = filtered
    .map((item) => {
      const badgeClass = item.type === 'Lost' ? 'badge-lost' : 'badge-found';
      return `
        <div class="item-card">
          <div>
            <div class="item-top">
              <span class="badge ${badgeClass}">${item.type.toUpperCase()}</span>
              <span class="badge badge-category">${item.category}</span>
            </div>
            <h4 class="item-title">${escapeHTML(item.name)}</h4>
            <p class="item-desc">${escapeHTML(item.description)}</p>
            <div class="item-meta">
              <span>📍 <strong>Location:</strong> ${escapeHTML(item.location)}</span>
              <span>📞 <strong>Contact:</strong> ${escapeHTML(item.contact)}</span>
            </div>
          </div>
          <div class="item-bottom">
            <span style="font-size: 0.75rem; color: #94a3b8;">Active Report</span>
            <button class="btn btn-danger" onclick="deleteLostFound('${item.id}')">Delete</button>
          </div>
        </div>
      `;
    })
    .join('');
}

// Add Item Submit Handler
function setupLostFoundForm() {
  const form = document.getElementById('lost-found-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const type = document.getElementById('lf-type').value;
    const name = document.getElementById('lf-name').value.trim();
    const category = document.getElementById('lf-category').value;
    const location = document.getElementById('lf-location').value.trim();
    const contact = document.getElementById('lf-contact').value.trim();
    const description = document.getElementById('lf-description').value.trim();

    // Validation
    if (!name || !location || !contact || !description) {
      showToast('Please fill in all required fields.', true);
      return;
    }

    const newItem = {
      id: 'lf-' + Date.now(),
      type,
      name,
      category,
      location,
      contact,
      description
    };

    const items = getStoredData(STORAGE_KEYS.LOST_FOUND, DEFAULT_LOST_FOUND);
    items.unshift(newItem); // Add new item at top
    saveStoredData(STORAGE_KEYS.LOST_FOUND, items);

    form.reset();
    renderLostFound();
    updateHomeCounters();
    showToast(`Successfully reported ${type.toLowerCase()} item!`);
  });
}

// Delete Lost & Found item
function deleteLostFound(id) {
  if (!confirm('Are you sure you want to delete this listing?')) return;

  const items = getStoredData(STORAGE_KEYS.LOST_FOUND, DEFAULT_LOST_FOUND);
  const updated = items.filter((item) => item.id !== id);
  saveStoredData(STORAGE_KEYS.LOST_FOUND, updated);

  renderLostFound();
  updateHomeCounters();
  showToast('Item deleted successfully.');
}

/**
 * --------------------------------------------------------
 * 7. Study Materials Module
 * --------------------------------------------------------
 */
function renderMaterials() {
  const materials = getStoredData(STORAGE_KEYS.MATERIALS, DEFAULT_MATERIALS);
  const listContainer = document.getElementById('materials-list');
  const searchVal = document.getElementById('mat-search').value.toLowerCase().trim();

  const filtered = materials.filter((mat) => {
    return (
      mat.title.toLowerCase().includes(searchVal) ||
      mat.subject.toLowerCase().includes(searchVal) ||
      mat.category.toLowerCase().includes(searchVal)
    );
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📖</div>
        <h4>No study materials found</h4>
        <p>Upload lecture notes or papers using the form on the left.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filtered
    .map((mat) => {
      return `
        <div class="item-card">
          <div>
            <div class="item-top">
              <span class="badge badge-category">${mat.category}</span>
              <span style="font-size: 0.8rem; font-weight: 700; color: #4f46e5;">${escapeHTML(mat.subject)}</span>
            </div>
            <h4 class="item-title">${escapeHTML(mat.title)}</h4>
            <div class="item-meta" style="margin-top: 8px;">
              <span>👤 <strong>Shared by:</strong> ${escapeHTML(mat.author)}</span>
            </div>
          </div>
          <div class="item-bottom">
            <a href="${escapeHTML(mat.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 0.8rem; padding: 5px 12px;">
              Open PDF ↗
            </a>
            <button class="btn btn-danger" onclick="deleteMaterial('${mat.id}')">Delete</button>
          </div>
        </div>
      `;
    })
    .join('');
}

// Add Material Form Handler
function setupMaterialForm() {
  const form = document.getElementById('material-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('mat-title').value.trim();
    const subject = document.getElementById('mat-subject').value.trim();
    const category = document.getElementById('mat-category').value;
    const link = document.getElementById('mat-link').value.trim();
    const author = document.getElementById('mat-author').value.trim();

    if (!title || !subject || !link || !author) {
      showToast('Please fill in all required fields.', true);
      return;
    }

    // Basic URL validation
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      showToast('Please enter a valid link starting with http:// or https://', true);
      return;
    }

    const newMaterial = {
      id: 'mat-' + Date.now(),
      title,
      subject,
      category,
      link,
      author
    };

    const materials = getStoredData(STORAGE_KEYS.MATERIALS, DEFAULT_MATERIALS);
    materials.unshift(newMaterial);
    saveStoredData(STORAGE_KEYS.MATERIALS, materials);

    form.reset();
    renderMaterials();
    updateHomeCounters();
    showToast('Study material shared successfully!');
  });
}

// Delete Material
function deleteMaterial(id) {
  if (!confirm('Are you sure you want to remove this resource?')) return;

  const materials = getStoredData(STORAGE_KEYS.MATERIALS, DEFAULT_MATERIALS);
  const updated = materials.filter((m) => m.id !== id);
  saveStoredData(STORAGE_KEYS.MATERIALS, updated);

  renderMaterials();
  updateHomeCounters();
  showToast('Resource removed.');
}

/**
 * --------------------------------------------------------
 * 8. College Events & Registrations Module
 * --------------------------------------------------------
 */
function renderEvents() {
  const eventsContainer = document.getElementById('events-catalog');
  const eventSelect = document.getElementById('reg-event');

  // Render event cards
  eventsContainer.innerHTML = COLLEGE_EVENTS.map((evt) => {
    return `
      <div class="event-card">
        <div>
          <span class="event-date-badge">📅 ${evt.date}</span>
          <h3>${evt.title}</h3>
          <p>${evt.description}</p>
          <div class="event-details">
            <span>📍 <strong>Venue:</strong> ${evt.venue}</span>
            <span>🏷️ <strong>Category:</strong> ${evt.category}</span>
          </div>
        </div>
        <div>
          <button class="btn btn-primary w-full" onclick="selectEventForRegistration('${evt.id}')">
            Register for Event
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Populate Event dropdown in registration form
  eventSelect.innerHTML = COLLEGE_EVENTS.map((evt) => {
    return `<option value="${evt.title}">${evt.title} (${evt.date.split('•')[0].trim()})</option>`;
  }).join('');
}

// Select event and scroll smoothly to registration form
function selectEventForRegistration(eventId) {
  const event = COLLEGE_EVENTS.find((e) => e.id === eventId);
  if (!event) return;

  const eventSelect = document.getElementById('reg-event');
  if (eventSelect) {
    eventSelect.value = event.title;
  }

  // Smooth scroll down to registration form
  const regSection = document.getElementById('registration-section');
  if (regSection) {
    regSection.scrollIntoView({ behavior: 'smooth' });
  }

  showToast(`Selected "${event.title}". Please enter your details below.`);
}

// Handle Event Registration Form
function setupEventRegistrationForm() {
  const form = document.getElementById('event-reg-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const eventName = document.getElementById('reg-event').value;
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const roll = document.getElementById('reg-roll').value.trim();

    // Form validation
    if (!name || !email || !roll) {
      showToast('Please fill in all registration fields.', true);
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address.', true);
      return;
    }

    const registrations = getStoredData(STORAGE_KEYS.REGISTRATIONS, []);

    // Check if student already registered for this event with this email/roll
    const alreadyRegistered = registrations.some(
      (reg) => reg.eventName === eventName && (reg.email.toLowerCase() === email.toLowerCase() || reg.roll.toLowerCase() === roll.toLowerCase())
    );

    if (alreadyRegistered) {
      showToast('You have already registered for this event!', true);
      return;
    }

    // Generate random pass code (e.g. PASS-7821)
    const passCode = 'PASS-' + Math.floor(1000 + Math.random() * 9000);

    const newRegistration = {
      id: 'reg-' + Date.now(),
      eventName,
      name,
      email,
      roll,
      passCode,
      dateRegistered: new Date().toLocaleDateString()
    };

    registrations.unshift(newRegistration);
    saveStoredData(STORAGE_KEYS.REGISTRATIONS, registrations);

    form.reset();
    renderRegistrations();
    showToast(`Registration confirmed! Your Pass Code is ${passCode}.`);
  });
}

// Render "My Registered Event Passes"
function renderRegistrations() {
  const registrations = getStoredData(STORAGE_KEYS.REGISTRATIONS, []);
  const listContainer = document.getElementById('my-registrations-list');

  if (registrations.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state" style="padding: 1.5rem;">
        <p>No active event passes found. Register for an event above to receive your pass.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = registrations
    .map((reg) => {
      return `
        <div class="ticket-pass">
          <div class="ticket-header">
            <span style="font-size: 0.75rem; font-weight: 700; color: #4338ca; text-transform: uppercase;">Campus Pass</span>
            <span class="ticket-code">${reg.passCode}</span>
          </div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 800; color: #1e1b4b; margin-bottom: 2px;">${escapeHTML(reg.eventName)}</h4>
            <p style="font-size: 0.8rem; color: #475569;">Attendee: <strong>${escapeHTML(reg.name)}</strong> (${escapeHTML(reg.roll)})</p>
            <p style="font-size: 0.75rem; color: #64748b;">Registered on: ${reg.dateRegistered}</p>
          </div>
          <div style="border-top: 1px dashed #c7d2fe; padding-top: 6px; display: flex; justify-content: flex-end;">
            <button class="btn btn-danger" onclick="cancelRegistration('${reg.id}')" style="font-size: 0.75rem; padding: 4px 8px;">
              Cancel Pass
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

// Cancel / Delete a registration
function cancelRegistration(id) {
  if (!confirm('Cancel this event pass?')) return;

  const registrations = getStoredData(STORAGE_KEYS.REGISTRATIONS, []);
  const updated = registrations.filter((r) => r.id !== id);
  saveStoredData(STORAGE_KEYS.REGISTRATIONS, updated);

  renderRegistrations();
  showToast('Event pass cancelled.');
}

/**
 * --------------------------------------------------------
 * 9. Student Marketplace Module
 * --------------------------------------------------------
 */
function renderMarketplace() {
  const items = getStoredData(STORAGE_KEYS.MARKETPLACE, DEFAULT_MARKETPLACE);
  const listContainer = document.getElementById('marketplace-list');
  const searchVal = document.getElementById('mp-search').value.toLowerCase().trim();
  const filterCat = document.getElementById('mp-filter-category').value;

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchVal) ||
      item.description.toLowerCase().includes(searchVal);

    const matchesCategory = filterCat === 'all' || item.category === filterCat;

    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛍️</div>
        <h4>No marketplace items found</h4>
        <p>Be the first to list student items using the form on the left.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filtered
    .map((item) => {
      return `
        <div class="item-card">
          <div>
            <div class="item-top">
              <span class="badge badge-price">₹${item.price}</span>
              <span class="badge badge-category">${item.category}</span>
            </div>
            <h4 class="item-title">${escapeHTML(item.name)}</h4>
            <p class="item-desc">${escapeHTML(item.description)}</p>
            <div class="item-meta">
              <span>📞 <strong>Seller Contact:</strong> ${escapeHTML(item.contact)}</span>
            </div>
          </div>
          <div class="item-bottom">
            <span style="font-size: 0.75rem; color: #10b981; font-weight: 700;">● Available</span>
            <button class="btn btn-danger" onclick="deleteMarketplace('${item.id}')">Delete</button>
          </div>
        </div>
      `;
    })
    .join('');
}

// Add Marketplace Item Handler
function setupMarketplaceForm() {
  const form = document.getElementById('marketplace-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('mp-name').value.trim();
    const price = parseFloat(document.getElementById('mp-price').value);
    const category = document.getElementById('mp-category').value;
    const contact = document.getElementById('mp-contact').value.trim();
    const description = document.getElementById('mp-description').value.trim();

    if (!name || isNaN(price) || price < 0 || !contact || !description) {
      showToast('Please provide valid details and price.', true);
      return;
    }

    const newItem = {
      id: 'mp-' + Date.now(),
      name,
      price,
      category,
      contact,
      description
    };

    const items = getStoredData(STORAGE_KEYS.MARKETPLACE, DEFAULT_MARKETPLACE);
    items.unshift(newItem);
    saveStoredData(STORAGE_KEYS.MARKETPLACE, items);

    form.reset();
    renderMarketplace();
    updateHomeCounters();
    showToast('Item listed on student marketplace!');
  });
}

// Delete Marketplace item
function deleteMarketplace(id) {
  if (!confirm('Are you sure you want to remove this listing?')) return;

  const items = getStoredData(STORAGE_KEYS.MARKETPLACE, DEFAULT_MARKETPLACE);
  const updated = items.filter((item) => item.id !== id);
  saveStoredData(STORAGE_KEYS.MARKETPLACE, updated);

  renderMarketplace();
  updateHomeCounters();
  showToast('Listing removed.');
}

/**
 * --------------------------------------------------------
 * 10. Security & Input Sanitization Helper
 * --------------------------------------------------------
 */
// Escape dangerous characters to prevent XSS when inserting into innerHTML
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Simple email format check
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * --------------------------------------------------------
 * 11. Initialization on DOMContentLoaded
 * --------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Mobile Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // 2. Setup Navigation Links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      navigateTo(section);
    });
  });

  // 3. Attach search and filter listeners
  // Lost & Found
  document.getElementById('lf-search').addEventListener('input', renderLostFound);
  document.getElementById('lf-filter-type').addEventListener('change', renderLostFound);

  // Study Materials
  document.getElementById('mat-search').addEventListener('input', renderMaterials);

  // Marketplace
  document.getElementById('mp-search').addEventListener('input', renderMarketplace);
  document.getElementById('mp-filter-category').addEventListener('change', renderMarketplace);

  // 4. Setup form submissions
  setupLostFoundForm();
  setupMaterialForm();
  setupEventRegistrationForm();
  setupMarketplaceForm();

  // 5. Initial Rendering of all modules
  renderLostFound();
  renderMaterials();
  renderEvents();
  renderRegistrations();
  renderMarketplace();
  updateHomeCounters();

  // 6. Handle URL Hash on initial page load (e.g. if user opened index.html#events)
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash && document.getElementById(currentHash)) {
    navigateTo(currentHash);
  } else {
    navigateTo('home');
  }

  console.log('✅ CampusLoop student platform initialized successfully.');
});
