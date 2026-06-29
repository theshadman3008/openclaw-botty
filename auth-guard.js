// auth-guard.js — incluso da tutte le pagine protette
// Verifica Firebase Auth + cookie 24h. Se non autenticato → login.html

(function() {
  const SESSION_COOKIE = 'ross_session';
  const SESSION_MAX_AGE = 24 * 60 * 60; // 24h in secondi

  function getSessionCookie() {
    const match = document.cookie.match(new RegExp('(?:^|; )' + SESSION_COOKIE + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setSessionCookie(uid) {
    const expires = new Date(Date.now() + SESSION_MAX_AGE * 1000).toUTCString();
    document.cookie = SESSION_COOKIE + '=' + encodeURIComponent(uid)
      + '; expires=' + expires
      + '; path=/; SameSite=Strict';
  }

  function clearSessionCookie() {
    document.cookie = SESSION_COOKIE + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
  }

  // Nascondi subito il contenuto fino a verifica
  document.documentElement.style.visibility = 'hidden';

  // Aspetta Firebase
  window.__authGuardReady = new Promise(function(resolve) {
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof firebase === 'undefined') {
        clearSessionCookie();
        window.location.replace('login.html');
        return;
      }

      const auth = firebase.auth();

      // Imposta persistenza SESSION (tab-based) — Firebase gestisce il token,
      // il nostro cookie gestisce la scadenza 24h
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
        auth.onAuthStateChanged(function(user) {
          if (!user) {
            clearSessionCookie();
            window.location.replace('login.html');
            return;
          }

          // Controlla cookie 24h
          const session = getSessionCookie();
          if (!session) {
            // Cookie scaduto → forza logout + redirect
            auth.signOut().then(function() {
              window.location.replace('login.html');
            });
            return;
          }

          // Tutto ok: mostra pagina
          document.documentElement.style.visibility = '';
          resolve(user);
        });
      });
    });
  });

  // Esponi utility globali
  window.rossAuth = {
    setSession: setSessionCookie,
    clearSession: clearSessionCookie,
    getSession: getSessionCookie,
    logout: function() {
      clearSessionCookie();
      if (typeof firebase !== 'undefined') {
        firebase.auth().signOut().then(function() {
          window.location.replace('login.html');
        });
      } else {
        window.location.replace('login.html');
      }
    }
  };
})();
