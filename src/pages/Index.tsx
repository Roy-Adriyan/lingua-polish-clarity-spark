import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TextEditor from '@/components/TextEditor';
import SuggestionPanel from '@/components/SuggestionPanel';
import LanguageSelector from '@/components/LanguageSelector';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  PenLine, 
  Languages, 
  BookOpen, 
  ChevronRight,
  BarChart3,
  Clock,
  FileText,
  AlertCircle
} from 'lucide-react';
import { analyzeText } from '@/utils/textAnalyzer';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en-us");
  const [currentText, setCurrentText] = useState("");
  const [issues, setIssues] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (currentText) {
      const analysisResults = analyzeText(currentText, selectedLanguage);
      setIssues(analysisResults);
    } else {
      setIssues([]);
    }
  }, [currentText, selectedLanguage]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleTextChange = (text: string) => {
    setCurrentText(text);
  };

  const handleApplySuggestion = (id: string, replacement: string) => {
    // Find the issue to apply the suggestion
    const issueToReplace = issues.find(issue => issue.id === id);
    
    if (issueToReplace) {
      // After successful application, remove the issue from the list
      setIssues(prevIssues => prevIssues.filter(issue => issue.id !== id));
      
      toast({
        title: "Suggestion applied",
        description: "The text has been updated with the suggestion."
      });
    }
  };

  const handleDismissSuggestion = (id: string) => {
    // Remove the dismissed issue from the list
    setIssues(prevIssues => prevIssues.filter(issue => issue.id !== id));
    
    toast({
      title: "Suggestion dismissed",
      description: "The suggestion has been removed."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-linguapolish-primary to-linguapolish-secondary">
              NLP-Powered Style and Grammar Checker
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Improve your writing with real-time, contextually appropriate grammar, style, 
            and writing suggestions across multiple languages and dialects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-linguapolish-primary to-linguapolish-secondary hover:from-linguapolish-secondary hover:to-linguapolish-primary"
            >
              Try for Free
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
          
          {/* Language support badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="bg-linguapolish-light text-linguapolish-secondary text-xs font-medium px-3 py-1 rounded-full">English (US)</span>
            <span className="bg-linguapolish-light text-linguapolish-secondary text-xs font-medium px-3 py-1 rounded-full">English (UK)</span>
            <span className="bg-linguapolish-light text-linguapolish-secondary text-xs font-medium px-3 py-1 rounded-full">Spanish</span>
            <span className="bg-linguapolish-light text-linguapolish-secondary text-xs font-medium px-3 py-1 rounded-full">French</span>
            <span className="bg-linguapolish-light text-linguapolish-secondary text-xs font-medium px-3 py-1 rounded-full">German</span>
            <span className="bg-linguapolish-light text-linguapolish-secondary text-xs font-medium px-3 py-1 rounded-full">+7 more</span>
          </div>
        </section>
        
        {/* Main Editor Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-linguapolish-primary to-linguapolish-secondary">
                  Writing Assistant
                </span>
              </h2>
              <div className="w-full md:w-auto">
                <LanguageSelector 
                  selectedLanguage={selectedLanguage} 
                  onLanguageChange={handleLanguageChange} 
                />
              </div>
            </div>
            
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="editor">
                  <PenLine className="w-4 h-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="dashboard">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <TextEditor 
                      language={selectedLanguage} 
                      onTextChange={handleTextChange} 
                      issues={issues}
                      onApplySuggestion={handleApplySuggestion}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <SuggestionPanel
                      issues={issues}
                      onApplySuggestion={handleApplySuggestion}
                      onDismissSuggestion={handleDismissSuggestion}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="dashboard">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Writing Analytics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                      title="Total Documents"
                      value={27}
                      icon={<FileText className="text-linguapolish-primary h-5 w-5" />}
                      trend={{ value: 12, isPositive: true }}
                    />
                    <StatsCard
                      title="Issues Resolved"
                      value={342}
                      icon={<CheckCircle className="text-success h-5 w-5" />}
                      trend={{ value: 8, isPositive: true }}
                    />
                    <StatsCard
                      title="Time Saved"
                      value="5.2 hrs"
                      icon={<Clock className="text-linguapolish-secondary h-5 w-5" />}
                      description="Estimated based on manual proofreading time"
                    />
                    <StatsCard
                      title="Common Issues"
                      value="Passive Voice"
                      icon={<AlertCircle className="text-warning h-5 w-5" />}
                      description="Most frequently detected issue"
                    />
                  </div>
                  
                  <div className="mt-8 bg-linguapolish-light/30 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Detailed analytics are available in the Premium and Professional plans.
                    </p>
                    <Button className="bg-linguapolish-primary hover:bg-linguapolish-secondary">
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features for Better Writing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-linguapolish-light rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="text-linguapolish-primary h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Grammar Checker</h3>
              <p className="text-gray-600">
                Advanced detection of grammatical errors, verb tense consistency, and punctuation issues.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-linguapolish-light rounded-lg flex items-center justify-center mb-4">
                <PenLine className="text-linguapolish-primary h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Style Analysis</h3>
              <p className="text-gray-600">
                Suggestions for improving clarity, reducing wordiness, and enhancing overall writing style.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-linguapolish-light rounded-lg flex items-center justify-center mb-4">
                <Languages className="text-linguapolish-primary h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Multilingual Support</h3>
              <p className="text-gray-600">
                Check your writing in 12 different languages, including regional variants.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-linguapolish-light rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-linguapolish-primary h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Readability Analysis</h3>
              <p className="text-gray-600">
                Assess reading level, sentence complexity, and audience appropriateness.
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-linguapolish-primary to-linguapolish-secondary rounded-xl shadow-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Writing?</h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              Join thousands of writers, students, and professionals who use LinguaPolish to perfect their writing.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-linguapolish-primary hover:bg-gray-100">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
