
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-primary mx-auto rounded-2xl h-20 w-20 flex items-center justify-center text-white text-3xl font-bold mb-8 shadow-lg animate-float">
              B
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-6 animate-fade-in">
              Welcome to Block-connect
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
              The digital hub for your residential community. Connect, communicate, and collaborate with neighbors and building management in one seamless platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg" variant="default" className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need in one place</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Community Dashboard",
                description: "Stay updated with announcements and events from your building community and management.",
                delay: 0
              },
              {
                title: "Discussion Forum",
                description: "Engage in meaningful conversations with neighbors about community matters.",
                delay: 0.1
              },
              {
                title: "Real-time Chat",
                description: "Direct messaging and group chats for quick and efficient communication.",
                delay: 0.2
              },
              {
                title: "Document Storage",
                description: "Securely access and share important building documents and information.",
                delay: 0.3
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-background rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all duration-300 animate-fade-in opacity-0"
                style={{ animationDelay: `${feature.delay + 0.5}s` }}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to connect with your community?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join Block-connect today and be part of a more connected, informed, and engaged residential community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      I already have an account
                    </Button>
                  </Link>
                </>
              )}
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
