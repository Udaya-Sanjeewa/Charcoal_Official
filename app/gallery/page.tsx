'use client';

import { useState } from 'react';
import { X, Play, ChevronLeft, ChevronRight, Factory, Store, Users, Truck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  const categories = [
    { id: 'all', name: t('gallery.all'), icon: null },
    { id: 'factory', name: t('gallery.factory'), icon: Factory },
    { id: 'stores', name: t('gallery.stores'), icon: Store },
    { id: 'work', name: t('gallery.work_environment'), icon: Users },
    { id: 'delivery', name: t('gallery.delivery'), icon: Truck }
  ];

  const mediaItems = [
    // Factory Images and Videos
    {
      id: 1,
      type: 'image',
      category: 'factory',
      title: t('gallery.main_production_facility'),
      description: t('gallery.main_production_desc'),
      src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      type: 'video',
      category: 'factory',
      title: t('gallery.coconut_processing'),
      description: t('gallery.coconut_processing_desc'),
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      type: 'image',
      category: 'factory',
      title: t('gallery.quality_control'),
      description: t('gallery.quality_control_desc'),
      src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      type: 'image',
      category: 'factory',
      title: t('gallery.seasoning_area'),
      description: t('gallery.seasoning_desc'),
      src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },

    // Store Images
    {
      id: 5,
      type: 'image',
      category: 'stores',
      title: t('gallery.main_retail_store'),
      description: t('gallery.main_retail_desc'),
      src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 6,
      type: 'image',
      category: 'stores',
      title: t('gallery.product_display'),
      description: t('gallery.product_display_desc'),
      src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 7,
      type: 'image',
      category: 'stores',
      title: t('gallery.customer_service'),
      description: t('gallery.customer_service_desc'),
      src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },

    // Work Environment
    {
      id: 8,
      type: 'image',
      category: 'work',
      title: t('gallery.team_meeting'),
      description: t('gallery.team_meeting_desc'),
      src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 9,
      type: 'video',
      category: 'work',
      title: t('gallery.safety_training'),
      description: t('gallery.safety_training_desc'),
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 10,
      type: 'image',
      category: 'work',
      title: t('gallery.production_team'),
      description: t('gallery.production_team_desc'),
      src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },

    // Delivery
    {
      id: 11,
      type: 'image',
      category: 'delivery',
      title: t('gallery.delivery_fleet'),
      description: t('gallery.delivery_fleet_desc'),
      src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 12,
      type: 'video',
      category: 'delivery',
      title: t('gallery.loading_process'),
      description: t('gallery.loading_process_desc'),
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 13,
      type: 'image',
      category: 'delivery',
      title: t('gallery.customer_delivery'),
      description: t('gallery.customer_delivery_desc'),
      src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 14,
      type: 'image',
      category: 'delivery',
      title: t('gallery.gps_tracking'),
      description: t('gallery.gps_tracking_desc'),
      src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      thumbnail: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const filteredMedia = selectedCategory === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === selectedCategory);

  const openModal = (media: any, index: number) => {
    setSelectedMedia(media);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredMedia.length) % filteredMedia.length
      : (currentIndex + 1) % filteredMedia.length;
    
    setCurrentIndex(newIndex);
    setSelectedMedia(filteredMedia[newIndex]);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-16">
      {/* Header */}
      <section className="bg-[#333333] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('gallery.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-[#7BB661] text-white'
                      : 'bg-gray-200 text-[#333333] hover:bg-gray-300'
                  }`}
                >
                  {Icon && <Icon size={20} />}
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((media, index) => (
              <div
                key={media.id}
                className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => openModal(media, index)}
              >
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <img 
                    src={media.thumbnail} 
                    alt={media.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {media.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <Play className="text-[#333333] ml-1" size={24} />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      media.category === 'factory' ? 'bg-blue-500 text-white' :
                      media.category === 'stores' ? 'bg-purple-500 text-white' :
                      media.category === 'work' ? 'bg-green-500 text-white' :
                      'bg-orange-500 text-white'
                    }`}>
                      {categories.find(cat => cat.id === media.category)?.name}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#333333] mb-2">{media.title}</h3>
                  <p className="text-gray-600 text-sm">{media.description}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No media found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-full overflow-visible">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 z-50 bg-white bg-opacity-90 hover:bg-white text-black p-3 rounded-full transition-all duration-300 shadow-lg"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            {filteredMedia.length > 1 && (
              <>
                <button
                  onClick={() => navigateMedia('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => navigateMedia('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Media Content */}
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="relative">
                {selectedMedia.type === 'image' ? (
                  <img 
                    src={selectedMedia.src} 
                    alt={selectedMedia.title}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                ) : (
                  <video 
                    src={selectedMedia.src}
                    controls
                    className="w-full h-auto max-h-[70vh]"
                    autoPlay
                  />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedMedia.category === 'factory' ? 'bg-blue-500 text-white' :
                    selectedMedia.category === 'stores' ? 'bg-purple-500 text-white' :
                    selectedMedia.category === 'work' ? 'bg-green-500 text-white' :
                    'bg-orange-500 text-white'
                  }`}>
                    {categories.find(cat => cat.id === selectedMedia.category)?.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {currentIndex + 1} of {filteredMedia.length}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#333333] mb-2">{selectedMedia.title}</h3>
                <p className="text-gray-600">{selectedMedia.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <section className="py-16 bg-[#333333] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('gallery.operations_numbers')}
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Factory className="mx-auto mb-4 text-[#7BB661]" size={48} />
              <div className="text-3xl font-bold text-[#7BB661] mb-2">2</div>
              <div className="text-lg">{t('gallery.production_facilities')}</div>
            </div>
            <div className="text-center">
              <Store className="mx-auto mb-4 text-[#7BB661]" size={48} />
              <div className="text-3xl font-bold text-[#7BB661] mb-2">5</div>
              <div className="text-lg">{t('gallery.retail_locations')}</div>
            </div>
            <div className="text-center">
              <Users className="mx-auto mb-4 text-[#7BB661]" size={48} />
              <div className="text-3xl font-bold text-[#7BB661] mb-2">50+</div>
              <div className="text-lg">{t('gallery.team_members')}</div>
            </div>
            <div className="text-center">
              <Truck className="mx-auto mb-4 text-[#7BB661]" size={48} />
              <div className="text-3xl font-bold text-[#7BB661] mb-2">15</div>
              <div className="text-lg">{t('gallery.delivery_vehicles')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-6">
            {t('gallery.want_to_visit')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('gallery.visit_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact"
              className="btn-gradient text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center justify-center"
            >
              {t('gallery.schedule_tour')}
            </a>
            <a 
              href="/products"
              className="border-2 border-[#333333] text-[#333333] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#333333] hover:text-white transition-all duration-300 inline-flex items-center justify-center"
            >
              {t('nav.products')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}