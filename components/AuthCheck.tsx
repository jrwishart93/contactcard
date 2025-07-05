import { ReactNode } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AuthCheck({ children }: { children: ReactNode }) {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;
  if (!user) {
    return (
      <div className="p-4 space-y-4">
        <p>You must sign in to access this page.</p>
        <button
          onClick={signIn}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
