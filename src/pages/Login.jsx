import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();


  // ----------- LOGIN FUNCTION -------------
  const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (data.user) {
      navigate("/dashboard"); // go to dashboard after login
    }

  if (error) {
    console.log("Login error:" + error.message);
    alert(`Login error: ${error.message}`);

  } else {
    console.log("Login success:", data);
  }
};

// -------------- SIGNUP FUNCTION -------------------
  const handleSignup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (data.user) {
      navigate("/dashboard"); //  go to dashboard after sign-up
    }

  if (error) {
    console.log("Signup error:", error.message);
    alert(`Signup error: ${error.message}`);

  } else {
    console.log("Signup success:", data);
  }
};

  return (
    <div className="container">
      {/* ------------- Navigation Tabs ---------------- */}
      <div className="view-selector">
        <button className={`view-button ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>
            Login
        </button>
        <button className={`view-button ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>
            Sign Up
        </button>
      </div>

      <h2>{mode === "login" ? "Existing User" : "New User"}</h2>

      {/* -------------- Input Fields to accept email and password ------------------- */}
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* ----------------- Main CTA to trigger the action and move to the next page ------------------- */}
      <button className="cta-button"
        onClick={mode === "login" ? handleLogin : handleSignup}
      >
        {mode === "login" ? "Login" : "Sign Up"}
      </button>
    </div>
  );
}