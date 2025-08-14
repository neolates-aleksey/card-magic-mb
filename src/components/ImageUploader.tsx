import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageUpload: (file: File | null) => void;
  uploadedImage?: File | null;
  isLoading?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  uploadedImage,
  isLoading = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(imageFile);
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const clearImage = useCallback(() => {
    setPreview(null);
    onImageUpload(null);
  }, [onImageUpload]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  React.useEffect(() => {
    if (uploadedImage) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(uploadedImage);
    } else {
      setPreview(null);
    }
  }, [uploadedImage]);

  if (preview) {
    return (
      <div className="card-elevated rounded-lg p-6">
        <div className="relative">
          <img
            src={preview}
            alt="Uploaded product card"
            className="w-full h-64 object-cover rounded-lg"
          />
          <Button
            onClick={clearImage}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3 text-center">
          Карточка товара загружена
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "upload-area rounded-lg p-8 text-center transition-all duration-300",
        isDragOver && "dragover",
        isLoading && "opacity-50 pointer-events-none"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 rounded-full bg-gradient-primary">
          <Upload className="h-8 w-8 text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Загрузите карточку товара
          </h3>
          <p className="text-muted-foreground">
            Перетащите изображение сюда или нажмите для выбора
          </p>
        </div>
        
        <Button variant="outline" className="cursor-pointer" disabled={isLoading} onClick={openFileDialog}>
          <ImageIcon className="h-4 w-4 mr-2" />
          Выбрать файл
        </Button>
        
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />
        
        <p className="text-xs text-muted-foreground">
          Поддерживаются форматы: JPG, PNG, WebP
        </p>
      </div>
    </div>
  );
};