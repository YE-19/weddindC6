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

// Firebase configuration loaded from Vite environment variables or hardcoded values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Check if valid Firebase configuration is present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('YOUR_') &&
  !firebaseConfig.projectId.includes('YOUR_')
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization warning:', error);
    db = null;
  }
}

const LOCAL_STORAGE_KEY = 'wedding_guestbook_wishes';

// Local storage helper
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
 * Real-time listener for wishes
 * @param {Function} callback - Called with array of wishes whenever data changes
 * @returns {Function} Unsubscribe function
 */
export const listenToWishes = (callback) => {
  if (db) {
    try {
      const wishesRef = collection(db, 'wishes');
      const q = query(wishesRef, orderBy('createdAt', 'desc'), limit(100));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const wishes = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let timestamp = 'الآن';
            if (data.createdAt && data.createdAt.toDate) {
              const date = data.createdAt.toDate();
              timestamp = formatRelativeTime(date);
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

          // If no wishes in Firestore yet, provide initial wishes as fallback
          if (wishes.length === 0 && invitationConfig.initialWishes?.length > 0) {
            callback(invitationConfig.initialWishes);
          } else {
            callback(wishes);
          }
        },
        (error) => {
          console.warn('Firestore snapshot error, falling back to local data:', error);
          callback(getLocalWishes());
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('Firestore subscription failed, using local storage:', err);
    }
  }

  // Fallback to local storage and custom events
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
 * Send a new wish to Firestore or local storage
 * @param {{ name: string, wishes: string }} wishData
 */
export const addWish = async ({ name, wishes }) => {
  const trimmedName = name.trim();
  const trimmedWishes = wishes.trim();

  if (!trimmedName || !trimmedWishes) return;

  if (db) {
    try {
      const wishesRef = collection(db, 'wishes');
      await addDoc(wishesRef, {
        name: trimmedName,
        wishes: trimmedWishes,
        likes: 0,
        createdAt: serverTimestamp(),
      });
      return { success: true, mode: 'cloud' };
    } catch (err) {
      console.warn('Failed to add wish to Firestore, saving locally:', err);
    }
  }

  // Fallback to LocalStorage
  const current = getLocalWishes();
  const newWish = {
    id: 'w-' + Date.now(),
    name: trimmedName,
    wishes: trimmedWishes,
    likes: 0,
    timestamp: 'الآن',
  };
  saveLocalWishes([newWish, ...current]);
  return { success: true, mode: 'local' };
};

/**
 * Increment like counter on a wish
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
      console.warn('Failed to like wish on Firestore:', err);
    }
  }

  // Local storage like update
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
function formatRelativeTime(date) {
  try {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'الآن';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'أمس';
    if (diffInDays < 30) return `منذ ${diffInDays} يوم`;

    return date.toLocaleDateString('ar-EG', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'مؤخراً';
  }
}
