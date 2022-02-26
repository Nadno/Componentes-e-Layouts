createTabList('.tablist');

function createTabList(tablistQuery) {
  const tabList = document.querySelector(tablistQuery);
  let currentHash = location.hash;

  (function init() {
    window.onpopstate = selectTabByCurrentHash;

    if (!currentHash) return selectFirstTab();
    selectTabByCurrentHash();
  })();

  function selectTab(tab) {
    if (!tab || !tab.matches('.tab') || tab.matches('.tab.selected')) return;
    currentHash = tab.hash;

    setAttrs(tab, { 'aria-selected': true });
    tab.classList.add('selected');
    tab.removeAttribute('href');

    requestAnimationFrame(() => {
      tab.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'end',
      });

      const panel = document.querySelector(currentHash);
      panel.classList.add('active');
      requestAnimationFrame(() => panel.classList.add('shown'));
    });
  }

  function unselectTab(tab) {
    if (!tab || !tab.matches('.tab.selected')) return;
    setAttrs(tab, { 'aria-selected': false });
    tab.classList.remove('selected');
    tab.setAttribute('href', currentHash);

    const panel = document.querySelector(currentHash);
    panel.classList.remove('active', 'shown');
  }

  function selectTabByCurrentHash() {
    let tabQuery = location.hash
      ? location.hash.replace(/-panel$/, '-tab')
      : '.tab';

    unselectTab(tabList.querySelector('.tab.selected'));
    selectTab(tabList.querySelector(tabQuery));
  }

  function selectFirstTab() {
    selectTab(tabList.querySelector('.tab'));
  }

  function setAttrs(el, attrs) {
    for (const key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }
}
