import { useApp } from '@/context/AppContext';
import { Language } from '@/types/equipment';
import { languageNames } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Sun, Moon, Globe, MapPin, Palette } from 'lucide-react';

export function Settings() {
  const { t, theme, setTheme, language, setLanguage, location } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold text-foreground">
          {t('nav.settings')}
        </h2>
        <p className="text-muted-foreground">
          Customize your experience
        </p>
      </div>

      {/* Theme Settings */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sage/50 to-teal/50 flex items-center justify-center">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t('settings.theme')}</h3>
            <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
            className="gap-2 h-12"
          >
            <Sun className="h-4 w-4" />
            {t('settings.light')}
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
            className="gap-2 h-12"
          >
            <Moon className="h-4 w-4" />
            {t('settings.dark')}
          </Button>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sage/50 to-teal/50 flex items-center justify-center">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t('settings.language')}</h3>
            <p className="text-sm text-muted-foreground">Select your preferred language</p>
          </div>
        </div>

        <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <SelectItem key={lang} value={lang}>
                {languageNames[lang]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location Info */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sage/50 to-teal/50 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t('settings.location')}</h3>
            <p className="text-sm text-muted-foreground">Your detected location</p>
          </div>
        </div>

        {location ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">City</p>
              <p className="font-medium text-foreground">{location.city}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Country</p>
              <p className="font-medium text-foreground">{location.country}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Timezone</p>
              <p className="font-medium text-foreground text-sm">{location.timezone}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Detecting location...</p>
        )}
      </div>

      {/* App Info */}
      <div className="bg-muted/50 rounded-xl p-6 text-center">
        <h3 className="font-display font-bold text-foreground mb-2">
          Chemical Equipment Parameter Visualizer
        </h3>
        <p className="text-sm text-muted-foreground">
          Version 1.0.0 • Built with React, Chart.js & Tailwind CSS
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Upload CSV files to analyze and visualize your chemical equipment data
        </p>
      </div>
    </motion.div>
  );
}
