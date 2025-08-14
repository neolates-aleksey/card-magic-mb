import React, { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Sparkles, Wand2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface PromptInputProps {
  onPromptSubmit: (prompt: string) => void;
  isLoading?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const SUGGESTED_PROMPTS = [
  "Плавно вращающийся товар на 360 градусов",
  "Товар появляется с эффектом света",
  "Пульсирующий эффект привлечения внимания",
  "Товар покачивается как в магазине",
  "Эффект золотого блеска на товаре",
  "Плавное увеличение и уменьшение товара"
];

export const PromptInput: React.FC<PromptInputProps> = ({
  onPromptSubmit,
  isLoading = false,
  value = '',
  onChange
}) => {
  const [prompt, setPrompt] = useState(value);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onPromptSubmit(prompt.trim());
    }
  };

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    onChange?.(newPrompt);
  };

  const selectSuggestedPrompt = (suggestion: string) => {
    handlePromptChange(suggestion);
  };

  return (
    <div className="card-elevated rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Wand2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Опишите желаемую анимацию</h3>
      </div>
      
      <Textarea
        placeholder="Например: создай плавную анимацию вращения товара на 360 градусов с мягким освещением..."
        value={prompt}
        onChange={(e) => handlePromptChange(e.target.value)}
        className="min-h-[100px] resize-none"
        disabled={isLoading}
      />
      
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground flex items-center">
          <Sparkles className="h-4 w-4 mr-1" />
          Популярные варианты:
        </p>
        
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((suggestion, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => selectSuggestedPrompt(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </div>
      
      <Button
        onClick={handleSubmit}
        disabled={!prompt.trim() || isLoading}
        className="w-full hero-gradient text-white font-semibold"
        size="lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Создаем анимацию...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Создать анимацию
          </>
        )}
      </Button>
    </div>
  );
};