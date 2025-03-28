import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, MessageSquare, FileText, Plus, ArrowRight } from 'lucide-react';
import '@/styles/animations.css';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showAnimations, setShowAnimations] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure the page is ready
    const timer = setTimeout(() => {
      setShowAnimations(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const renderLogo = () => (
    <div className={`logo-container flex items-center ${showAnimations ? 'animate' : ''}`}>
      <div className="bg-primary rounded-md h-8 w-8 flex items-center justify-center text-white font-bold mr-2">
        B
      </div>
      <span className="text-xl font-semibold">Block-connect</span>
    </div>
  );

  const renderButtons = () => {
    if (loading) {
      return (
        <Button size="lg" disabled className="w-full sm:w-auto">
          <div className="shimmer w-24" />
        </Button>
      );
    }

    if (isAuthenticated) {
      return (
        <Link to="/dashboard">
          <Button size="lg" className="w-full sm:w-auto group">
            Go to Dashboard
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <Link to="/register">
          <Button size="lg" className="w-full sm:w-auto group">
            Get Started
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link to="/login">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            I already have an account
          </Button>
        </Link>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 dark:bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {renderLogo()}
          <div className={`flex items-center gap-4 ${showAnimations ? 'animate-fade-in animate-delay-200' : ''}`}>
            {!loading && !isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/register?role=admin')}
                className="group"
              >
                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                Create Block Space
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className={`max-w-3xl mx-auto text-center ${showAnimations ? 'animate-fade-in' : ''}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Connect Your Residential Community
            </h1>
            <p className={`text-xl text-muted-foreground mb-8 ${showAnimations ? 'animate-fade-in animate-delay-100' : ''}`}>
              A modern platform for managing residential blocks, fostering community engagement, and streamlining communication.
            </p>
            <div className={`flex flex-col sm:flex-row justify-center ${showAnimations ? 'animate-fade-in animate-delay-200' : ''}`}>
              <div className={`button-container ${showAnimations ? 'animate' : ''}`}>
                {renderButtons()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Building2,
                title: "Block Management",
                description: "Efficiently manage your residential block with digital tools.",
                delay: "0",
              },
              {
                icon: Users,
                title: "Community",
                description: "Build stronger connections within your residential community.",
                delay: "100",
              },
              {
                icon: MessageSquare,
                title: "Communication",
                description: "Stay connected with real-time messaging and announcements.",
                delay: "200",
              },
              {
                icon: FileText,
                title: "Documentation",
                description: "Keep all important documents organized and accessible.",
                delay: "300",
              },
            ].map((feature, index) => (
              <Card 
                key={index} 
                className={`glass hover:scale-105 transition-transform duration-300 ${showAnimations ? 'animate-fade-in' : ''}`}
                style={{ animationDelay: showAnimations ? `${feature.delay}ms` : '0ms' }}
              >
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className={`glass rounded-2xl p-8 md:p-12 text-center ${showAnimations ? 'animate-scale-in' : ''}`}>
            <h2 className="text-3xl font-bold mb-4">Ready to connect with your community?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join Block-connect today and be part of a more connected, informed, and engaged residential community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className={`button-container ${showAnimations ? 'animate' : ''}`}>
                {renderButtons()}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted/30 py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="bg-primary rounded-md h-8 w-8 flex items-center justify-center text-white font-bold mr-2">
                B
              </div>
              <span className="text-xl font-semibold">Block-connect</span>
            </div>
            <div className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Block-connect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
