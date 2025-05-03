
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-linguapolish-primary">LinguaPolish</h3>
            <p className="text-gray-600 text-sm">
              Advanced NLP-powered style and grammar checking platform for multiple languages.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-linguapolish-primary">Features</a></li>
              <li><a href="#" className="hover:text-linguapolish-primary">Pricing</a></li>
              <li><a href="#" className="hover:text-linguapolish-primary">Use Cases</a></li>
              <li><a href="#" className="hover:text-linguapolish-primary">Languages</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-linguapolish-primary">Blog</a></li>
              <li><a href="#" className="hover:text-linguapolish-primary">Documentation</a></li>
              <li><a href="#" className="hover:text-linguapolish-primary">FAQs</a></li>
              <li><a href="#" className="hover:text-linguapolish-primary">Support</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-linguapolish-primary">About Us</a></li>
              <li><a href="#" className="hover:text-linguapolish-primary">Careers</a></li>
              <li><a href="#" className="hover:text-linguapolish-primary">Contact</a></li>
              <li><a href="#" className="hover:text-linguapolish-primary">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© 2025 LinguaPolish. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Made with <Heart className="h-4 w-4 text-linguapolish-primary mx-1" /> and advanced NLP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
