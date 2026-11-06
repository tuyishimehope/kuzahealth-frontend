import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe, Check } from "lucide-react";

// Language configuration with proper metadata
const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", native: "English" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼", native: "Ikinyarwanda" },
  { code: "fr", name: "French", flag: "🇫🇷", native: "Français" },
];

// Core language selector hook for reusability
const useLanguageSelector = (initialLang = "en") => {
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (langCode: React.SetStateAction<string>) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    // Simulate language change callback
    console.log(`Language changed to: ${langCode}`);
  };

  return {
    currentLang,
    isOpen,
    setIsOpen,
    changeLanguage,
    currentLanguage: LANGUAGES.find((lang) => lang.code === currentLang),
  };
};

export const ModernDropdownSelector = ({
  lang,
  changeLanguage,
  tone = "light",
}: {
  lang: any;
  changeLanguage: any;
  /** "dark" renders a translucent pill for dark/hero backgrounds */
  tone?: "light" | "dark";
}) => {
  const {
    currentLang,
    isOpen,
    setIsOpen,
    changeLanguage: handleChange,
    currentLanguage,
  } = useLanguageSelector(lang);

  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref type for a div element

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    handleChange(langCode);
    changeLanguage(langCode); // Call parent callback
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          tone === "dark"
            ? "flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            : "flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Globe className={`w-4 h-4 ${tone === "dark" ? "text-white/70" : "text-muted-foreground"}`} />
        <span className={`text-[13px] font-medium ${tone === "dark" ? "text-white" : "text-foreground"}`}>
          {currentLanguage?.code.toUpperCase()}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 ${tone === "dark" ? "text-white/60" : "text-muted-foreground"} transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-float">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
              role="option"
              aria-selected={currentLang === language.code}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{language.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{language.name}</div>
                  <div className="text-xs text-neutral-500">{language.native}</div>
                </div>
              </div>
              {currentLang === language.code && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
