import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function ProtectedRoute({ children, allowedRole }) {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    checkRole();
  }, [isLoaded, user]);

  const checkRole = async () => {
    try {
      const docSnap = await getDoc(doc(db, "users", user.id));
      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === allowedRole) {
          setAllowed(true);
        } else {
          // Galat role — apne dashboard pe bhejo
          navigate(`/${role}`);
        }
      } else {
        // Role hi nahi — home pe bhejo
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      navigate("/");
    }
    setChecking(false);
  };

  if (checking) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
      <p className="text-white text-lg">Checking access...</p>
    </div>
  );

  return allowed ? children : null;
}

export default ProtectedRoute;