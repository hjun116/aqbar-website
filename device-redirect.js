(function () {
  'use strict';

  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var isMobilePage = file === 'index-mobile.html';
  var isDesktopPage = file === 'index.html' || file === '';
  if (!isMobilePage && !isDesktopPage) return;

  var params = new URLSearchParams(location.search);
  var viewParam = params.get('view');

  if (viewParam === 'desktop' || viewParam === 'mobile') {
    try { sessionStorage.setItem('aq-view', viewParam); } catch (e) {}
  }

  var pref = viewParam;
  if (!pref) {
    try { pref = sessionStorage.getItem('aq-view'); } catch (e) {}
  }

  var isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
  var hash = location.hash || '';

  if (pref === 'desktop') {
    if (isMobilePage) {
      location.replace('index.html' + hash);
    }
    return;
  }

  if (pref === 'mobile') {
    if (isDesktopPage) {
      location.replace('index-mobile.html' + hash);
    }
    return;
  }

  if (isMobileViewport && isDesktopPage) {
    location.replace('index-mobile.html' + hash);
    return;
  }

  if (!isMobileViewport && isMobilePage) {
    location.replace('index.html' + hash);
  }
})();
