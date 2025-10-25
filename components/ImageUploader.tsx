'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase-client';
import { toast } from 'sonner';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onImagesChange, maxImages = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast.error('You must be logged in to upload images');
        return null;
      }

      const supabase = getSupabaseClient(token);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
      return null;
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    const remainingSlots = maxImages - images.length;
    if (fileArray.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more image(s)`);
      return;
    }

    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }

    if (imageFiles.length !== fileArray.length) {
      toast.error('Some files were skipped (not images)');
    }

    setUploading(true);

    const uploadPromises = imageFiles.map(file => uploadImage(file));
    const uploadedUrls = await Promise.all(uploadPromises);

    const successfulUploads = uploadedUrls.filter((url): url is string => url !== null);

    if (successfulUploads.length > 0) {
      onImagesChange([...images, ...successfulUploads]);
      toast.success(`Successfully uploaded ${successfulUploads.length} image(s)`);
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
      handleFiles(e.dataTransfer.files);
    }
  }, [images, maxImages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
    toast.success('Image removed');
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          dragActive
            ? 'border-[#EA580C] bg-orange-50'
            : 'border-gray-300 hover:border-[#EA580C] hover:bg-gray-50'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          disabled={uploading || images.length >= maxImages}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="image-upload"
        />

        <div className="text-center">
          {uploading ? (
            <>
              <Loader2 className="mx-auto h-12 w-12 text-[#EA580C] animate-spin mb-4" />
              <p className="text-lg font-semibold text-gray-700">Uploading images...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait</p>
            </>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Drag and drop images here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files
              </p>
              <p className="text-xs text-gray-400">
                Supports: JPG, PNG, GIF, WEBP ({images.length}/{maxImages} images)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-gray-200 aspect-square">
              <img
                src={imageUrl}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-semibold">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
