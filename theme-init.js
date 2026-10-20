/* Runs before the page paints so saved display choices don't flash.
   Keys: "theme" (light | dark; absent = match device),
         "stlnc-text" (large | xl), "stlnc-spacing" ("1"). */
(function () {
  var root = document.documentElement;
  function get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  var theme = get('theme');
  if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
  var text = get('stlnc-text');
  if (text === 'large' || text === 'xl') root.setAttribute('data-text', text);
  if (get('stlnc-spacing') === '1') root.setAttribute('data-spacing', '1');
})();
