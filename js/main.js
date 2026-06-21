(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".site-nav");
  var searchBar = document.querySelector(".header-search");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen);
      toggle.classList.toggle("is-open", isOpen);
      if (searchBar) {
        searchBar.classList.toggle("mobile-visible", isOpen);
      }
    });

    nav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        if (searchBar) {
          searchBar.classList.remove("mobile-visible");
        }
      });
    });
  }

  /* Active nav link */
  var current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* Page search */
  var searchInput = document.querySelector(".search-input");
  var searchBtn = document.querySelector(".search-btn");
  var noResult = document.querySelector(".search-no-result");

  function runSearch() {
    if (!searchInput) return;
    var query = searchInput.value.trim().toLowerCase();
    var items = document.querySelectorAll(
      ".hero, .report-card, .step, .card, .item, .sidebar-link, .download-btn"
    );
    var anyVisible = false;

    items.forEach(function (el) {
      el.querySelectorAll("mark.search-highlight").forEach(function (mark) {
        mark.replaceWith(document.createTextNode(mark.textContent));
      });
    });

    if (!query) {
      items.forEach(function (el) {
        el.style.display = "";
      });
      if (noResult) noResult.classList.remove("visible");
      return;
    }

    items.forEach(function (el) {
      var text = el.textContent.toLowerCase();
      var match = text.includes(query);
      el.style.display = match ? "" : "none";
      if (match) anyVisible = true;

      if (match && query.length >= 2) {
        highlightText(el, query);
      }
    });

    if (noResult) {
      noResult.classList.toggle("visible", !anyVisible);
    }
  }

  function highlightText(el, query) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var text = node.textContent;
      var lower = text.toLowerCase();
      var idx = lower.indexOf(query);
      if (idx === -1) return;

      var frag = document.createDocumentFragment();
      var last = 0;
      while (idx !== -1) {
        if (idx > last) {
          frag.appendChild(document.createTextNode(text.slice(last, idx)));
        }
        var mark = document.createElement("mark");
        mark.className = "search-highlight";
        mark.textContent = text.slice(idx, idx + query.length);
        frag.appendChild(mark);
        last = idx + query.length;
        idx = lower.indexOf(query, last);
      }
      if (last < text.length) {
        frag.appendChild(document.createTextNode(text.slice(last)));
      }
      node.parentNode.replaceChild(frag, node);
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", runSearch);
  }
  if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") runSearch();
    });
    searchInput.addEventListener("input", function () {
      if (!searchInput.value.trim()) runSearch();
    });
  }
})();
