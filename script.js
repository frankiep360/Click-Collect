// Search functionality
const searchInput = document.querySelector('.navbar-search input');
const searchButton = document.querySelector('.navbar-search img');

if (searchButton && searchInput) {
  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
}

function handleSearch() {
  const query = searchInput.value.trim();
  if (query) {
    showNotification(`Searching for: ${query}`, 'info');
  }
}

// Tab switching for Lists page
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('[id^="custom-lists"], [id^="reading-lists"]');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    
    // Update active tab button
    tabButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update visible content
    tabContents.forEach((content) => {
      if (content.id === tabName) {
        content.style.display = 'flex';
      } else {
        content.style.display = 'none';
      }
    });
  });
});

// List buttons interaction
const listButtons = document.querySelectorAll('.list-button:not(.add-list-btn)');
listButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const title = btn.querySelector('.list-button-title')?.textContent;
    showNotification(`Opened: ${title}`, 'info');
  });
});

// Add list button
const addListBtn = document.querySelector('.add-list-btn');
addListBtn?.addEventListener('click', () => {
  showNotification('New list created (demo)', 'success');
});

// Add to List button functionality
const addToListButtons = document.querySelectorAll('.book-buttons .btn:first-child');

addToListButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const bookCard = button.closest('.book-card');
    const bookTitle = bookCard?.querySelector('.book-title')?.textContent || 'Selected item';

    showNotification(`"${bookTitle}" has been added to your list!`, 'success');
    
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
  });
});

// Share button functionality
const shareButtons = document.querySelectorAll('.book-buttons .btn:last-child');

shareButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const bookCard = button.closest('.book-card');
    const bookTitle = bookCard?.querySelector('.book-title')?.textContent || 'this item';
    showShareModal(bookTitle);
  });
});

// Share modal
function showShareModal(bookTitle) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Share "${bookTitle}"</h3>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        <button class="share-option" data-method="email"><span>📧</span> Share via Email</button>
        <button class="share-option" data-method="copy"><span>🔗</span> Copy Link</button>
        <button class="share-option" data-method="social"><span>🌐</span> Share on Social Media</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('active'), 10);

  const closeBtn = modal.querySelector('.modal-close');
  closeBtn?.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  modal.querySelectorAll('.share-option').forEach((option) => {
    option.addEventListener('click', () => {
      const method = option.getAttribute('data-method');
      handleShare(method, bookTitle);
      closeModal(modal);
    });
  });
}

function closeModal(modal) {
  modal.classList.remove('active');
  setTimeout(() => modal.remove(), 300);
}

function handleShare(method, bookTitle) {
  switch (method) {
    case 'email':
      showNotification('Opening email client...', 'info');
      break;
    case 'copy': {
      const url = window.location.href;
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showNotification('Link copied to clipboard!', 'success');
        }).catch(() => showNotification('Copy failed. Select and copy manually.', 'warning'));
      } else {
        showNotification('Clipboard not available. Copy manually.', 'warning');
      }
      break;
    }
    case 'social':
      showNotification('Opening social media share options...', 'info');
      break;
  }
}

// Navigation links
const navLinks = document.querySelectorAll('.navbar-link');

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const linkText = link.querySelector('span')?.textContent?.trim();
    const href = link.getAttribute('href') || '';
    const isHashLink = href === '#' || href === '';

    if (!isHashLink) {
      if (linkText === 'Lists') {
        return; // allow navigation to lists page
      }
      return; // allow default navigation for other real links
    }

    e.preventDefault();

    navLinks.forEach((l) => l.classList.remove('active'));
    link.classList.add('active');

    switch (linkText) {
      case 'Current Reservation':
        showNotification('Viewing your current reservations', 'info');
        break;
      case 'Lists':
        showNotification('Opening your lists', 'info');
        break;
      case 'My Account':
        showAccountMenu(link);
        break;
    }
  });
});

// Account dropdown menu
function showAccountMenu(link) {
  const existing = document.querySelector('.account-dropdown');
  if (existing) {
    existing.remove();
    return;
  }

  const dropdown = document.createElement('div');
  dropdown.className = 'account-dropdown';
  dropdown.innerHTML = `
    <a href="#profile">My Profile</a>
    <a href="#settings">Settings</a>
    <a href="#history">Borrowing History</a>
    <div class="dropdown-separator"></div>
    <a href="#logout">Log Out</a>
  `;

  link.appendChild(dropdown);
  setTimeout(() => dropdown.classList.add('active'), 10);

  setTimeout(() => {
    const closeDropdown = (e) => {
      if (!link.contains(e.target)) {
        dropdown.classList.remove('active');
        setTimeout(() => dropdown.remove(), 200);
        document.removeEventListener('click', closeDropdown);
      }
    };
    document.addEventListener('click', closeDropdown);
  }, 100);

  dropdown.querySelectorAll('a').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const action = item.textContent?.trim();
      showNotification(`${action} clicked`, 'info');
      dropdown.remove();
    });
  });
}

// View All links
const viewAllLinks = document.querySelectorAll('.view-all-link');

viewAllLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.closest('.recent-section')?.querySelector('.recent-title')?.textContent || 'this section';
    showNotification(`Viewing all items in: ${section}`, 'info');
  });
});

// Recent cards hover effect
const recentCards = document.querySelectorAll('.recent-card');

recentCards.forEach((card) => {
  card.addEventListener('click', () => {
    const bookTitle = 'The Design of Everyday Things';
    showNotification(`Opening: ${bookTitle}`, 'info');
  });

  const overlay = document.createElement('div');
  overlay.className = 'card-overlay';
  overlay.innerHTML = '<span>View Details</span>';
  card.appendChild(overlay);
});

// Book card animations
const bookCards = document.querySelectorAll('.book-card');

bookCards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// Footer links
const footerLinks = document.querySelectorAll('.footer-link');

footerLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const linkText = link.textContent?.trim();
    showNotification(`Navigating to: ${linkText}`, 'info');
  });
});

// Social media icons
const socialIcons = document.querySelectorAll('.social-icon');

socialIcons.forEach((icon) => {
  icon.addEventListener('click', () => {
    showNotification('Opening social media page...', 'info');
  });
});

// Lists page interactions
const listsPage = document.querySelector('.lists-page');

if (listsPage) {
  const listFilterButtons = document.querySelectorAll('.list-filter button');
  listFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      listFilterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const label = btn.textContent?.trim() || 'Filter';
      showNotification(`${label} filter applied`, 'info');
    });
  });

  const listsSearchInput = document.querySelector('.lists-search input');
  const listsSearchButton = document.querySelector('.lists-search button');
  const triggerListSearch = () => {
    const term = listsSearchInput?.value.trim();
    if (term) {
      showNotification(`Searching lists for: ${term}`, 'info');
    }
  };
  listsSearchButton?.addEventListener('click', triggerListSearch);
  listsSearchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') triggerListSearch();
  });

  const listCardViewButtons = document.querySelectorAll('.list-card .view-list');
  listCardViewButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.closest('.list-card')?.querySelector('.list-card-title')?.textContent || 'Selected list';
      showNotification(`Opening list: ${title}`, 'info');
    });
  });

  const listCardShareButtons = document.querySelectorAll('.share-list');
  listCardShareButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.closest('.list-card')?.querySelector('.list-card-title')?.textContent || 'this list';
      showShareModal(title);
    });
  });

  const createListButton = document.querySelector('.create-list');
  createListButton?.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('New list created (demo)', 'success');
  });
}

// Notification system
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span class="notification-icon">${getNotificationIcon(type)}</span>
    <span class="notification-message">${message}</span>
    <button class="notification-close" aria-label="Close">&times;</button>
  `;

  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add('show'), 10);

  notification.querySelector('.notification-close')?.addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  });

  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}

function getNotificationIcon(type) {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    default:
      return 'ℹ';
  }
}

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Demo availability toggle for variety
const availabilityElements = document.querySelectorAll('.availability');
availabilityElements.forEach((element, index) => {
  if (index % 3 === 0 && Math.random() > 0.7) {
    const icon = element.querySelector('.availability-icon');
    const text = element.querySelector('.availability-text');
    if (text && icon) {
      text.textContent = 'Unavailable';
      text.style.color = '#c41e3a';
      icon.style.filter = 'hue-rotate(280deg)';
    }
  }
});

// Page load transition
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Initialize
console.log('Click and Collect Library - Interactive features loaded');
