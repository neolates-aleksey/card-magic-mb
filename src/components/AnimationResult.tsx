import React from 'react';
import { Download, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AnimationResultProps {
  videoUrl?: string | null;
  isLoading?: boolean;
  onDownload?: () => void;
  onRegenerate?: () => void;
}

export const AnimationResult: React.FC<AnimationResultProps> = ({
  videoUrl,
  isLoading = false,
  onDownload,
  onRegenerate
}) => {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className="animate-pulse-slow">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Создаем анимацию</h3>
            <p className="text-muted-foreground">
              Kling AI обрабатывает ваше изображение...
            </p>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-gradient-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!videoUrl) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Play className="h-5 w-5 mr-2 text-primary" />
          Готовая анимация
        </h3>
        
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-auto"
            autoPlay
            loop
            muted
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={togglePlayPause}
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={onDownload}
            className="flex-1"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Скачать
          </Button>
          
          <Button
            onClick={onRegenerate}
            variant="secondary"
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Создать новую
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Анимация готова! Используйте её для своих карточек товаров.
          </p>
        </div>
      </div>
    </Card>
  );
};