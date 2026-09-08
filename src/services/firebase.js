import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  limit,
} from 'firebase/firestore';
import { invitationConfig } from '../data/invitationData';

// Firebase configuration with environment variables and project defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim() || "AIzaSyBOuvfHBpNpYkm_1nshEsHXAmwYaxPHdaw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || "wedding-51631.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || "wedding-51631",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || "wedding-51631.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || "93945374057",
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim() || "1:93945374057:web:a417f4281ee656307449f8",
};

// Check if valid Firebase configuration is present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('YOUR_') &&
  !firebaseConfig.projectId.includes('YOUR_') &&
  firebaseConfig.apiKey.length > 5
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.info(`%c[Firebase]%c Connected to Cloud Firestore project: ${firebaseConfig.projectId}`, 'color:#C5A880;font-weight:bold', 'color:#6D5D50');
  } catch (error) {
    console.warn('[Firebase] Initialization warning:', error);
    db = null;
  }
}

/**
 * Returns current database connection status
 */
export const getDatabaseStatus = () => ({
  isCloud: Boolean(db),
  projectId: firebaseConfig.projectId || null,
});

const LOCAL_STORAGE_KEY = 'wedding_guestbook_wishes';

// Local storage helpers (fallback if offline)
const getLocalWishes = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading local wishes:', e);
  }
  return invitationConfig.initialWishes || [];
};

const saveLocalWishes = (wishes) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishes));
    window.dispatchEvent(new CustomEvent('local_wishes_updated', { detail: wishes }));
  } catch (e) {
    console.error('Error saving local wishes:', e);
  }
};

/**
 * Real-time listener for wishes across all connected devices
 * @param {Function} callback - Called with array of wishes whenever data changes in the cloud
 * @returns {Function} Unsubscribe function
 */
export const listenToWishes = (callback) => {
  if (db) {
    try {
      const wishesRef = collection(db, 'wishes');
      const q = query(wishesRef, orderBy('createdAt', 'desc'), limit(150));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const wishes = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let timestamp = 'الآن';
            
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
              const date = data.createdAt.toDate();
              timestamp = formatRelativeTime(date);
            } else if (data.createdAt instanceof Date) {
              timestamp = formatRelativeTime(data.createdAt);
            } else if (data.timestamp) {
              timestamp = data.timestamp;
            }

            return {
              id: docSnap.id,
              name: data.name || 'محب ومهنئ',
              wishes: data.wishes || '',
              likes: data.likes || 0,
              timestamp,
              createdAt: data.createdAt,
            };
          });

          // If no wishes in Firestore yet, provide initial wishes as starter
          if (wishes.length === 0 && invitationConfig.initialWishes?.length > 0) {
            callback(invitationConfig.initialWishes);
          } else {
            callback(wishes);
          }
        },
        (error) => {
          console.warn('[Firebase] Snapshot listener note (make sure Firestore is created & rules published):', error);
          callback(getLocalWishes());
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('[Firebase] Firestore subscription failed, using local storage:', err);
    }
  }

  // Fallback to local storage
  callback(getLocalWishes());

  const handleUpdate = (e) => {
    callback(e.detail || getLocalWishes());
  };

  window.addEventListener('local_wishes_updated', handleUpdate);
  return () => {
    window.removeEventListener('local_wishes_updated', handleUpdate);
  };
};

/**
 * Send a new wish to Firestore in real-time with automatic timeout protection
 * @param {{ name: string, wishes: string }} wishData
 */
export const addWish = async ({ name, wishes }) => {
  const trimmedName = name.trim();
  const trimmedWishes = wishes.trim();

  if (!trimmedName || !trimmedWishes) return { success: false };

  if (db) {
    try {
      const wishesRef = collection(db, 'wishes');
      
      // Add timeout so UI never hangs if Firestore is not yet activated in console
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firebase timeout')), 3000)
      );

      const addDocPromise = addDoc(wishesRef, {
        name: trimmedName,
        wishes: trimmedWishes,
        likes: 0,
        createdAt: serverTimestamp(),
      });

      const docRef = await Promise.race([addDocPromise, timeoutPromise]);
      return { success: true, mode: 'cloud', id: docRef.id };
    } catch (err) {
      console.warn('[Firebase] Firestore write failed or timed out (Please create Firestore Database in console):', err);
    }
  }

  // Fallback to LocalStorage immediately so button never hangs
  const current = getLocalWishes();
  const newWish = {
    id: 'w-' + Date.now(),
    name: trimmedName,
    wishes: trimmedWishes,
    likes: 0,
    timestamp: 'الآن',
  };
  saveLocalWishes([newWish, ...current]);
  return { success: true, mode: 'local', id: newWish.id };
};

/**
 * Increment like counter on a wish across all devices
 * @param {string} wishId
 */
export const likeWish = async (wishId) => {
  if (db && !wishId.startsWith('w-')) {
    try {
      const wishRef = doc(db, 'wishes', wishId);
      await updateDoc(wishRef, {
        likes: increment(1),
      });
      return;
    } catch (err) {
      console.warn('[Firebase] Failed to increment like on Firestore:', err);
    }
  }

  // Local storage like update fallback
  const current = getLocalWishes();
  const updated = current.map((w) => {
    if (w.id === wishId) {
      return { ...w, likes: (w.likes || 0) + 1 };
    }
    return w;
  });
  saveLocalWishes(updated);
};

// Helper for Arabic relative time formatting
export function formatRelativeTime(date) {
  try {
    if (!date) return 'الآن';
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 45) return 'الآن';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      if (diffInMinutes === 1) return 'منذ دقيقة';
      if (diffInMinutes === 2) return 'منذ دقيقتين';
      if (diffInMinutes <= 10) return `منذ ${diffInMinutes} دقائق`;
      return `منذ ${diffInMinutes} دقيقة`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      if (diffInHours === 1) return 'منذ ساعة';
      if (diffInHours === 2) return 'منذ ساعتين';
      if (diffInHours <= 10) return `منذ ${diffInHours} ساعات`;
      return `منذ ${diffInHours} ساعة`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'أمس';
    if (diffInDays === 2) return 'منذ يومين';
    if (diffInDays <= 10) return `منذ ${diffInDays} أيام`;
    if (diffInDays < 30) return `منذ ${diffInDays} يوم`;

    return date.toLocaleDateString('ar-EG', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'مؤخراً';
  }
}
