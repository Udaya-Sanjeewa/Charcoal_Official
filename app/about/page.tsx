'use client';

import { Leaf, Users, Award, Truck, Shield, Heart } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Leaf,
      title: t('about.sustainability_first'),
      description: t('about.sustainability_desc')
    },
    {
      icon: Shield,
      title: t('about.premium_quality'),
      description: t('about.premium_quality_desc')
    },
    {
      icon: Heart,
      title: t('about.customer_care'),
      description: t('about.customer_care_desc')
    }
  ];

  const milestones = [
    { year: "2018", title: t('about.company_founded'), description: t('about.company_founded_desc') },
    { year: "2019", title: t('about.first_warehouse'), description: t('about.first_warehouse_desc') },
    { year: "2021", title: t('about.customers_500'), description: t('about.customers_500_desc') },
    { year: "2023", title: t('about.regional_expansion'), description: t('about.regional_expansion_desc') },
    { year: "2024", title: t('about.happy_clients_1000'), description: t('about.happy_clients_1000_desc') }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-16">
      {/* Header */}
      <section className="bg-[#333333] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6">
                {t('about.our_story')}
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  {t('about.story_p1')}
                </p>
                <p>
                  {t('about.story_p2')}
                </p>
                <p>
                  {t('about.story_p3')}
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Our facility"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#7BB661] text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm">{t('about.happy_customers')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="card-hover bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mb-6">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-[#333333] mb-4">{t('about.our_mission')}</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.mission_text')}
              </p>
            </div>

            <div className="card-hover bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mb-6">
                <Leaf className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-[#333333] mb-4">{t('about.our_vision')}</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.vision_text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6">
              {t('about.core_values')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These fundamental principles guide everything we do and shape our commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center card-hover bg-[#FAF7F2] p-8 rounded-2xl">
                  <div className="w-20 h-20 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#333333] mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6">
              {t('about.our_journey')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.journey_subtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-8 bottom-8 w-1 bg-[#7BB661] hidden md:block"></div>

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-start">
                    {/* Timeline dot */}
                    <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center text-white font-bold text-sm mr-8 flex-shrink-0 z-10">
                      {milestone.year}
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-lg flex-grow">
                      <h3 className="text-xl font-bold text-[#333333] mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-[#333333] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('about.by_numbers')}
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#7BB661] mb-4">1000+</div>
              <div className="text-xl">{t('about.happy_customers')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#7BB661] mb-4">50K+</div>
              <div className="text-xl">{t('about.cords_delivered')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#7BB661] mb-4">3</div>
              <div className="text-xl">{t('about.states_served')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#7BB661] mb-4">24/7</div>
              <div className="text-xl">{t('about.customer_support')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6">
            {t('about.ready_to_join')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('about.join_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="btn-gradient text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center justify-center"
            >
              {t('about.get_started_today')}
            </Link>
            <Link 
              href="/products" 
              className="border-2 border-[#333333] text-[#333333] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#333333] hover:text-white transition-all duration-300 inline-flex items-center justify-center"
            >
              {t('nav.products')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}