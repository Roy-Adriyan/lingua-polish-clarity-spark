
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, User, Settings, Menu, X } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="w-full bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-linguapolish-primary to-linguapolish-secondary rounded-md w-10 h-10 flex items-center justify-center">
            <Globe className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-linguapolish-primary to-linguapolish-secondary">LinguaPolish</h1>
            <p className="text-xs text-gray-500">Style & Grammar Checker</p>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-linguapolish-primary transition-colors">Home</a>
          <a href="#" className="text-gray-600 hover:text-linguapolish-primary transition-colors">Features</a>
          <a href="#" className="text-gray-600 hover:text-linguapolish-primary transition-colors">Pricing</a>
          <a href="#" className="text-gray-600 hover:text-linguapolish-primary transition-colors">About</a>
        </nav>
        
        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button className="bg-gradient-to-r from-linguapolish-primary to-linguapolish-secondary hover:from-linguapolish-secondary hover:to-linguapolish-primary">
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 border-b animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <a href="#" className="text-gray-600 hover:text-linguapolish-primary transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-linguapolish-primary transition-colors">Features</a>
            <a href="#" className="text-gray-600 hover:text-linguapolish-primary transition-colors">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-linguapolish-primary transition-colors">About</a>
            <Button variant="outline" size="sm" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button className="bg-gradient-to-r from-linguapolish-primary to-linguapolish-secondary hover:from-linguapolish-secondary hover:to-linguapolish-primary">
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
