import React from 'react';

export default function LoginPage() {
  // This page should never be shown - the app is set to internal access mode
  // which means users are auto-authenticated by the Zite platform
  // If this page appears, it means the user is not authenticated in the workspace
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">MOON TRAVELS</h1>
        <p className="text-muted-foreground mb-6">Travel Agency Management System</p>
        
        <div className="bg-muted rounded border border-border p-4 text-sm">
          <p className="text-foreground font-semibold mb-2">Access Required</p>
          <p className="text-muted-foreground">
            This application requires authentication through your workspace. 
            Please ensure you have been granted access to Moon Travels.
          </p>
        </div>
      </div>
    </div>
  );
}
