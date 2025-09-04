
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(email, password);
      
      // Store token and user info
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        throw new Error('No token received from server');
      }
      
      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Always show generic message for security - don't reveal if username exists
      // Only show rate limiting message if it's specifically a rate limit error
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error.message && error.message.includes('Too many')) {
        errorMessage = "Too many login attempts. Please wait a few minutes before trying again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-circus-gold via-circus-cream to-white px-4">
      <form
        className="bg-white/90 border-2 border-circus-gold rounded-xl shadow-xl max-w-sm w-full p-8 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="font-circus text-3xl text-circus-gold mb-2 text-center">Admin Login</h2>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="email"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="current-password"
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-circus-gold text-white hover:bg-circus-red transition-colors font-alt disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};
export default Login;
