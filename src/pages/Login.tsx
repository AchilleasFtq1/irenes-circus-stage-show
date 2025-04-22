
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Dummy admin login for demonstration
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setError("");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin credentials.");
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
          type="text"
          placeholder="Username"
          value={username}
          autoComplete="username"
          onChange={e => setUsername(e.target.value)}
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
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="bg-circus-gold text-white hover:bg-circus-red transition-colors font-alt">
          Login
        </Button>
      </form>
    </div>
  );
};
export default Login;
