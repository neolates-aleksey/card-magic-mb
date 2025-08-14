import React, { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { PromptInput } from '@/components/PromptInput';
import { AnimationResult } from '@/components/AnimationResult';
import { Card } from '@/components/ui/card';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { generateAnimation } from '@/lib/api';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [animationUrl, setAnimationUrl] = useState<string | null>(null);

  const handleImageUpload = (file: File | null) => {
    setUploadedImage(file);
    setAnimationUrl(null); // Clear previous results
    if (file) {
      toast.success('Изображение загружено успешно!');
    } else {
      toast.message('Изображение очищено');
    }
  };

  const handlePromptSubmit = async (promptText: string) => {
    if (!uploadedImage) {
      toast.error('Сначала загрузите изображение карточки товара');
      return;
    }

    setIsGenerating(true);
    toast.info('Отправляем запрос в Kling AI...');

    try {
      const videoUrl = await generateAnimation({
        imageFile: uploadedImage,
        prompt: promptText
      });
      setAnimationUrl(videoUrl);
      toast.success('Анимация создана успешно!');
    } catch (error) {
      toast.error('Ошибка при создании анимации');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (animationUrl) {
      const link = document.createElement('a');
      link.href = animationUrl;
      link.download = 'animated-product-card.mp4';
      link.click();
      toast.success('Скачивание начато!');
    }
  };

  const handleRegenerate = () => {
    setAnimationUrl(null);
    toast.info('Готов к созданию новой анимации');
  };

  const hasResult = isGenerating || Boolean(animationUrl);

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/marketbrains-logo.svg" alt="MarketBrains" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-2xl font-bold">MarketBrains</h1>
                <p className="text-sm text-muted-foreground">Анимация карточек товаров</p>
              </div>
            </div>
            <div />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Оживите ваши карточки товаров
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Создавайте потрясающие анимации для маркетплейсов с помощью ИИ
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center card-elevated">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="font-semibold">Загрузите фото</h3>
                <p className="text-sm text-muted-foreground">
                  Выберите изображение карточки товара
                </p>
              </div>
            </Card>

            <Card className="p-6 text-center card-elevated">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="font-semibold">Опишите анимацию</h3>
                <p className="text-sm text-muted-foreground">
                  Напишите, какую анимацию хотите получить
                </p>
              </div>
            </Card>

            <Card className="p-6 text-center card-elevated">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="font-semibold">Получите результат</h3>
                <p className="text-sm text-muted-foreground">
                  Скачайте готовую анимацию
                </p>
              </div>
            </Card>
          </div>

          {/* Main Form */}
          <div className="grid lg:grid-cols-2 gap-8">
            {hasResult ? (
              <>
                {/* Right column first when generating/has result */}
                <div className="space-y-6">
                  {(isGenerating || animationUrl) && (
                    <AnimationResult
                      videoUrl={animationUrl}
                      isLoading={isGenerating}
                      onDownload={handleDownload}
                      onRegenerate={handleRegenerate}
                    />
                  )}
                </div>
                <div className="space-y-6">
                  {!uploadedImage && !isGenerating && !animationUrl && (
                    <Card className="p-8 text-center">
                      <div className="space-y-4">
                        <div className="animate-bounce-gentle">
                          <ArrowRight className="h-12 w-12 mx-auto text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Начните с загрузки изображения
                          </h3>
                          <p className="text-muted-foreground">
                            Результат анимации появится здесь
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                  <ImageUploader
                    onImageUpload={handleImageUpload}
                    uploadedImage={uploadedImage}
                    isLoading={isGenerating}
                  />
                  {uploadedImage && (
                    <PromptInput
                      onPromptSubmit={handlePromptSubmit}
                      isLoading={isGenerating}
                      value={prompt}
                      onChange={setPrompt}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Default order: left column first */}
                <div className="space-y-6">
                  {!uploadedImage && !isGenerating && !animationUrl && (
                    <Card className="p-8 text-center">
                      <div className="space-y-4">
                        <div className="animate-bounce-gentle">
                          <ArrowRight className="h-12 w-12 mx-auto text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Начните с загрузки изображения
                          </h3>
                          <p className="text-muted-foreground">
                            Результат анимации появится здесь
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                  <ImageUploader
                    onImageUpload={handleImageUpload}
                    uploadedImage={uploadedImage}
                    isLoading={isGenerating}
                  />
                  {uploadedImage && (
                    <PromptInput
                      onPromptSubmit={handlePromptSubmit}
                      isLoading={isGenerating}
                      value={prompt}
                      onChange={setPrompt}
                    />
                  )}
                </div>
                <div className="space-y-6">
                  {(isGenerating || animationUrl) && (
                    <AnimationResult
                      videoUrl={animationUrl}
                      isLoading={isGenerating}
                      onDownload={handleDownload}
                      onRegenerate={handleRegenerate}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
