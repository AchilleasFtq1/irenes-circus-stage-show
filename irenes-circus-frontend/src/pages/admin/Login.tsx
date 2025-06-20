import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await authAPI.login(email, password);
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        navigate('/admin/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-circus-cream to-white">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-6">
          <h1 className="font-circus text-3xl text-circus-gold">Admin Login</h1>
          <p className="font-alt text-circus-dark mt-2">Irene's Circus Management</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-alt text-circus-dark mb-1" htmlFor="email">
              <span className="flex items-center gap-2">
                <Mail className="text-circus-gold" size={18}/>
                Email
              </span>
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-circus-cream/20 border-circus-gold text-circus-dark"
              placeholder="admin@irenescircus.com"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block font-alt text-circus-dark mb-1" htmlFor="password">
              <span className="flex items-center gap-2">
                <Lock className="text-circus-gold" size={18}/>
                Password
              </span>
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-circus-cream/20 border-circus-gold text-circus-dark"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-circus-gold text-circus-dark font-bold hover:bg-circus-red hover:text-circus-cream transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="text-center mt-8">
          <a 
            href="/" 
            className="text-circus-gold hover:text-circus-red transition-colors font-alt"
          >
            Return to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 