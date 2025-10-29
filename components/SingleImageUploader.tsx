'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase-client';
import { toast } from 'sonner';

interface SingleImageUploaderProps {
  imageUrl: string | null;
  onImageChange: (imageUrl: string | null) => void;
  bucketName?: string;
}

export default function SingleImageUploader({
  imageUrl,
  onImageChange,
  bucketName = 'bbq-packages'
}: SingleImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const supabase = getSupabaseClient();

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
      return null;
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setUploading(true);

    const uploadedUrl = await uploadImage(file);

    if (uploadedUrl) {
      onImageChange(uploadedUrl);
      toast.success('Image uploaded successfully');
    }

    setUploading(false);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    onImageChange(null);
    toast.success('Image removed');
  };

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="relative group rounded-lg overflow-hidden border-2 border-gray-200 aspect-video max-w-md">
          <img
            src={imageUrl}
            alt="Package"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
            <button
              type="button"
              onClick={removeImage}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all max-w-md ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="single-image-upload"
          />

          <div className="text-center">
            {uploading ? (
              <>
                <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-lg font-semibold text-gray-700">Uploading image...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait</p>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Drag and drop an image here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Supports: JPG, PNG, WEBP (Max 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
