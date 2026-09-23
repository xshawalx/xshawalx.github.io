(() => {
  "use strict";

  const config = window.XSHAWALX_LINKS;
  if (!config) return;

  const icons = {
    youtube: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.2 7.1a3 3 0 0 0-2.1-2.1C19.2 4.5 12 4.5 12 4.5s-7.2 0-9.1.5A3 3 0 0 0 .8 7.1 31 31 0 0 0 .3 12a31 31 0 0 0 .5 4.9A3 3 0 0 0 2.9 19c1.9.5 9.1.5 9.1.5s7.2 0 9.1-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9ZM9.7 15.2V8.8L15.9 12l-6.2 3.2Z"/></svg>',
    instagram: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm-.1 2A3.1 3.1 0 0 0 4 7.1v9.8A3.1 3.1 0 0 0 7.1 20h9.8a3.1 3.1 0 0 0 3.1-3.1V7.1A3.1 3.1 0 0 0 16.9 4H7.1Zm10.2 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 6.9a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2Zm0 2A3.1 3.1 0 1 0 12 15a3.1 3.1 0 0 0 0-6.2Z"/></svg>',
    tiktok: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.8 2h3a5.1 5.1 0 0 0 3.2 3.2v3.1a8.2 8.2 0 0 1-3.2-.7V15a7 7 0 1 1-7-7c.4 0 .8 0 1.2.1v3.2a3.8 3.8 0 1 0 2.8 3.7V2Z"/></svg>',
    threads: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.3 2C6.7 2 3 5.9 3 11.9c0 6.3 3.5 10.1 9.3 10.1 4.5 0 7.6-2.2 8.5-6 .7-3-.6-5.2-3.2-6.3-.4-3-2.3-4.7-5.4-4.8-2.1-.1-4 .8-5.1 2.4l2 1.4c.7-1 1.7-1.5 3-1.5 1.5.1 2.5.7 2.9 1.8-.8-.1-1.6-.2-2.3-.1-3.5.1-5.7 1.7-5.7 4.3 0 2.4 1.9 4.1 4.7 4.1 2.9 0 5-1.7 5.6-4.5 1.1.7 1.5 1.7 1.2 2.8-.6 2.5-2.6 3.8-6.1 3.8-4.3 0-6.8-2.7-6.8-7.6 0-4.6 2.6-7.5 6.7-7.5 3.2 0 5.6 1.6 6.9 4.6l2.2-1.1C19.7 4.1 16.6 2 12.3 2Zm-.6 13c-1.4 0-2.3-.7-2.3-1.8 0-1.2 1.1-1.9 3.3-2 1 0 1.9.1 2.6.3-.2 2.2-1.5 3.5-3.6 3.5Z"/></svg>',
    medium: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 5.1 7.1 5l5.3 11.6L17.1 5H22v1.1l-1.4 1v9.8l1.4 1v1.1h-7v-1.1l1.5-1V8.8L11.9 20h-1L5.8 8.9v7.2l2 1.8V19H2v-1.1l1.9-1.8V7.8L2 6.2V5.1Z"/></svg>',
    linkedin: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.7 3.1A2.1 2.1 0 1 1 4.7 7.3a2.1 2.1 0 0 1 0-4.2ZM2.9 9h3.6v12H2.9V9Zm5.8 0h3.4v1.6h.1c.5-.9 1.7-2 3.6-2 3.8 0 4.5 2.5 4.5 5.8V21h-3.6v-5.8c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H8.7V9Z"/></svg>'
  };

  const socialRoot = document.querySelector("#social-links");
  if (socialRoot) {
    const fragment = document.createDocumentFragment();

    config.social.forEach(({ label, url, icon }) => {
      if (!label || !url) return;

      const link = document.createElement("a");
      link.className = "social-link";
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `${label} — opens in a new tab`);
      link.innerHTML = `${icons[icon] || ""}<span class="social-label">${label}</span>`;
      fragment.appendChild(link);
    });

    socialRoot.appendChild(fragment);
  }

  const supportRoot = document.querySelector("#support-action");
  if (supportRoot && Array.isArray(config.support)) {
    const fragment = document.createDocumentFragment();

    config.support.forEach(({ label, url, primary }) => {
      if (!label || !url) return;

      const link = document.createElement("a");
      link.className = `support-link${primary ? " support-link--primary" : ""}`;
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${label} ↗`;
      link.setAttribute("aria-label", `Support Shawal via ${label} — opens in a new tab`);
      fragment.appendChild(link);
    });

    supportRoot.appendChild(fragment);
  }
})();
