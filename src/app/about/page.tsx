'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Users, Award, Globe, Shield, Zap, Target, Star, TrendingUp, Heart, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const stats = [
    { icon: Users, label: 'Team Members', value: '500+', color: 'from-purple-500 to-pink-500' },
    { icon: Globe, label: 'Projects Completed', value: '2500+', color: 'from-blue-500 to-purple-500' },
    { icon: Award, label: 'Years of Experience', value: '30+', color: 'from-green-500 to-blue-500' },
    { icon: Shield, label: 'Certifications', value: 'ISO Certified', color: 'from-orange-500 to-red-500' }
  ];

  const timeline = [
    {
      year: '1994',
      title: 'Foundation',
      description: 'PC Solutions was established with a vision to transform businesses through technology.',
      icon: Star
    },
    {
      year: '2005',
      title: 'Expansion',
      description: 'Expanded operations to multiple locations and began international projects.',
      icon: TrendingUp
    },
    {
      year: '2015',
      title: 'Innovation',
      description: 'Embraced cloud solutions and digital transformation services.',
      icon: Lightbulb
    },
    {
      year: '2024',
      title: 'Leadership',
      description: 'Became a leading B2B IT solutions provider with 500+ professionals.',
      icon: Award
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer-Centric',
      description: 'We put our customers at the heart of everything we do, building lasting relationships based on trust and quality.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Shield,
      title: 'Quality & Excellence',
      description: 'We maintain the highest standards with ISO certifications and CMMi Level 3 compliance.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We embrace cutting-edge technologies including AI, cloud solutions, and custom application development.',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Target,
      title: 'Tailored Solutions',
      description: 'Every solution is crafted to meet specific business needs and drive operational efficiency.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const services = [
    'Digital Solutions Consultancy',
    'Cloud Solutions',
    'App Development & Deployment',
    'Networking',
    'Security',
    'Systems Integration',
    'Facility Management Services'
  ];

  const certifications = [
    'ISO/IEC 20000-2011',
    'ISO 27001-2013',
    'ISO 9001:2015',
    'CMMi Level 3'
  ];

  const partners = [
    'HPE', 'Microsoft', 'AWS', 'Cisco'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-slate-900/20"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
            >
              About PC Solutions
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              For over three decades, we've been transforming businesses through innovative IT solutions,
              building lasting partnerships, and delivering excellence in digital transformation.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8" data-aos="fade-up">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 text-center">
                    <CardHeader>
                      <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-white text-3xl font-bold">{stat.value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300 text-lg">
                        {stat.label}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From humble beginnings to industry leadership, discover the milestones that shaped PC Solutions.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-500 to-pink-500 h-full hidden md:block"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
                    data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="md:w-1/2 w-full md:px-8">
                      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-2xl">{item.year}</CardTitle>
                              <CardTitle className="text-purple-300 text-xl">{item.title}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-gray-300 text-lg">
                            {item.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="md:w-1/2 w-full"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 h-full">
                    <CardHeader>
                      <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-white text-2xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300 text-lg leading-relaxed">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expertise & Certifications */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Our Expertise */}
            <div data-aos="fade-right">
              <h2 className="text-4xl font-bold text-white mb-8">Our Expertise</h2>
              <div className="grid grid-cols-1 gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Target className="h-6 w-6 text-purple-400 mr-4 flex-shrink-0" />
                    <span className="text-gray-300 text-lg">{service}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications & Partners */}
            <div data-aos="fade-left">
              <h2 className="text-4xl font-bold text-white mb-8">Certifications & Partners</h2>

              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-purple-300 mb-4">Certifications</h3>
                <div className="grid grid-cols-1 gap-3">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-white font-semibold text-lg">{cert}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-purple-300 mb-4">Technology Partners</h3>
                <div className="flex flex-wrap gap-3">
                  {partners.map((partner, index) => (
                    <motion.span
                      key={index}
                      className="bg-white/10 backdrop-blur-sm border border-purple-500/30 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {partner}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          data-aos="fade-up"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl font-bold text-white mb-4">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                PC Solutions positions itself as a pure business-to-business (B2B) company committed to customer-centricity
                and quality that clients can rely on. We craft tailored solutions to meet specific business needs and goals,
                helping businesses leverage technology for operational efficiency and growth.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}