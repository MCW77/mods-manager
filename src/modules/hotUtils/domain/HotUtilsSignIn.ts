/**
 * "Fetch with HotUtils" for everyone: the HotUtils sign-in popup.
 *
 * When the current profile has no HotUtils session ID, the optimizer opens HotUtils' sign-in page in a popup. The
 * player signs in there with their EA account; HotUtils then posts
 *   { type: "hotutils-gi-link", linkId, allyCode, playerName }
 * back to this window (to this page's exact origin only) and closes the popup. `linkId` is the HotUtils session ID
 * the optimizer already stores per profile, so from there on the usual "Fetch with HotUtils" path runs.
 *
 * Security: a message is accepted ONLY when `event.origin` is exactly the HotUtils site's origin and the message has
 * the expected type and shape. Anything else is ignored.
 *
 * REACT_APP_HOTUTILS_SITE overrides the HotUtils site for development (e.g. http://localhost:5180 for a local HotUtils
 * site, or https://dev-v2.hotutils.com), the same way REACT_APP_API_BASE overrides the API.
 */

export const HOTUTILS_SITE = process.env.REACT_APP_HOTUTILS_SITE || "https://www.hotutils.com";

export const HOTUTILS_SIGN_IN_PATH = "/connect/grand-ivory";

export const HOTUTILS_MESSAGE_TYPE = "hotutils-gi-link";

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLY_CODE = /^\d{9}$/;

function defer<T>() {
  let deferred: {
    promise: Promise<T> | null;
    resolve: ((value: T) => void) | null;
    reject: ((reason?: any) => void) | null;
  } = {
    promise: null,
    resolve: null,
    reject: null,
  };

  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred as {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
  };
}

/** The HotUtils site's origin (scheme://host[:port]). */
export function hotUtilsOrigin(site = HOTUTILS_SITE) {
  return new URL(site).origin;
}

/** The popup's address: HotUtils' sign-in page, told which origin to answer. */
export function hotUtilsSignInUrl(ownOrigin: string, site = HOTUTILS_SITE) {
  return `${hotUtilsOrigin(site)}${HOTUTILS_SIGN_IN_PATH}?origin=${encodeURIComponent(ownOrigin)}`;
}

/**
 * The sign-in result carried by `event`, or null when the event is not one we accept: wrong origin, wrong type, or a
 * malformed body.
 */
export function readHotUtilsSignIn(event: MessageEvent, expectedOrigin = hotUtilsOrigin()) {
  if (!event || event.origin !== expectedOrigin) return null;
  const data = event.data;
  if (!data || typeof data !== "object" || data.type !== HOTUTILS_MESSAGE_TYPE) return null;
  if (typeof data.linkId !== "string" || !GUID.test(data.linkId)) return null;
  if (typeof data.allyCode !== "string" || !ALLY_CODE.test(data.allyCode)) return null;
  return {
    linkId: data.linkId,
    allyCode: data.allyCode,
    playerName: typeof data.playerName === "string" ? data.playerName : null,
  };
}

/**
 * Opens the HotUtils sign-in popup and calls `onSignedIn({ linkId, allyCode, playerName })` once, when HotUtils answers.
 * Must be called from a click handler, or the browser blocks the popup.
 *
 * @returns {string} The HotUtils session ID, or "" if the popup was blocked or closed without signing in.
 */
export async function openHotUtilsSignIn({ site = HOTUTILS_SITE, win = window } = {}) {
  const sessionId = defer<string>();
  const expectedOrigin = hotUtilsOrigin(site);
  const huSignInUrl = hotUtilsSignInUrl(win.location.origin, site);
  const popup = win.open(huSignInUrl, "hotutils-sign-in", "popup,width=480,height=720");
  if (!popup) {
    sessionId.resolve("");
    return await sessionId.promise;
  }

  let watcher: number | null = null;
  const stop = () => {
    win.removeEventListener("message", listener);
    if (watcher !== null) win.clearInterval(watcher);
  };
  function listener(event: MessageEvent) {
    const signIn = readHotUtilsSignIn(event, expectedOrigin);
    if (!signIn) return;
    stop();
    sessionId.resolve(signIn.linkId);
  }
  win.addEventListener("message", listener);
  // Stop listening once the player closes the popup without finishing. The popup closes itself right after it posts
  // its answer, so wait one more tick after first seeing it closed: the message is never dropped for being late.
  let closedSeen = false;
  watcher = win.setInterval(() => {
    if (!popup.closed) return;
    if (closedSeen) {
      stop();

      sessionId.resolve("");
    }
    closedSeen = true;
  }, 1000);
  return await sessionId.promise;
}
