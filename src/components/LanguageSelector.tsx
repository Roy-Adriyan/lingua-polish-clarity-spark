
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { id: "en-us", name: "English (US)", flag: "🇺🇸" },
  { id: "en-gb", name: "English (UK)", flag: "🇬🇧" },
  { id: "es", name: "Spanish", flag: "🇪🇸" },
  { id: "fr", name: "French", flag: "🇫🇷" },
  { id: "de", name: "German", flag: "🇩🇪" },
  { id: "pt", name: "Portuguese", flag: "🇵🇹" },
  { id: "it", name: "Italian", flag: "🇮🇹" },
  { id: "zh", name: "Mandarin Chinese", flag: "🇨🇳" },
  { id: "ja", name: "Japanese", flag: "🇯🇵" },
  { id: "hi", name: "Hindi", flag: "🇮🇳" },
  { id: "ru", name: "Russian", flag: "🇷🇺" },
  { id: "ar", name: "Arabic", flag: "🇸🇦" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector = ({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) => {
  const selected = languages.find((lang) => lang.id === selectedLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center justify-between w-full md:w-48">
          <div className="flex items-center">
            <span className="mr-2">{selected?.flag}</span>
            <span>{selected?.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full md:w-48">
        <DropdownMenuRadioGroup
          value={selectedLanguage}
          onValueChange={onLanguageChange}
        >
          {languages.map((language) => (
            <DropdownMenuRadioItem
              key={language.id}
              value={language.id}
              className="flex items-center justify-between px-2 py-2"
            >
              <div className="flex items-center">
                <span className="mr-2">{language.flag}</span>
                <span>{language.name}</span>
              </div>
              {language.id === selectedLanguage && (
                <Check className="h-4 w-4 text-linguapolish-primary" />
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
