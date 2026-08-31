import { firebaseConfig } from 'config/FirebaseConfig';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const app = initializeApp(firebaseConfig);
const analytics: Analytics | null =
  typeof window !== 'undefined' ? getAnalytics(app) : null;

export { analytics, app as default };
