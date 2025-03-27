
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/AuthForm';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleSuccess = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary mx-auto rounded-2xl h-16 w-16 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
            B
          </div>
          <h1 className="text-3xl font-bold">Block-connect</h1>
          <p className="text-muted-foreground mt-2">
            Join your block's community platform
          </p>
        </div>
        
        <RegisterForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default Register;
