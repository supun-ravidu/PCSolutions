

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare, Headphones, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
};

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone Support',
    details: ['0774301436', '0662224650'],
    description: 'Mon-Fri 9AM-6PM',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Mail,
    title: 'Email Support',
    details: ['info@pcsolutions.lk', 'sales@pcsolutions.lk'],
    description: 'We respond within 24 hours',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: MapPin,
    title: 'Office Location',
    details: ['47A/1, King Street', 'Matale, Sri Lanka'],
    description: 'Visit our office',
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Mon-Fri: 9AM-6PM', 'Sat: 10AM-4PM', 'Sun: Closed'],
    description: 'Office and phone support hours',
    color: 'from-orange-500 to-red-500'
  }
];

const faqs = [
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy on all products. Items must be in original condition with all accessories and packaging.'
  },
  {
    question: 'Do you offer warranties?',
    answer: 'Yes, all our products come with manufacturer warranties. Gaming components typically have 2-3 year warranties.'
  },
  {
    question: 'Can I track my order?',
    answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track orders from your account dashboard.'
  },
  {
    question: 'Do you offer technical support?',
    answer: 'Yes, our technical support team is available to help with setup, troubleshooting, and product recommendations.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and financing options through our partners.'
  },
  {
    question: 'Do you offer custom builds?',
    answer: 'Yes, we specialize in custom PC builds. Contact our sales team to discuss your requirements and get a quote.'
  }
];

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    
    try {
      // Save to Firebase Firestore
      await addDoc(collection(db, 'contactSubmissions'), {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        category: data.category,
        message: data.message,
        status: 'unread',
        priority: data.category === 'Technical Support' ? 'high' : 'normal',
        submittedAt: Timestamp.now(),
        readAt: null,
        respondedAt: null,
        notes: ''
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      reset();

      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setIsSubmitting(false);
      alert('Failed to submit form. Please try again.');
    }
  };

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
              Contact Us
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Have questions about our IT solutions or need technical support?
              We're here to help you succeed with cutting-edge technology.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-aos="fade-up">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 text-center h-full">
                    <CardHeader>
                      <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-white text-xl">{info.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-300 text-lg mb-1">{detail}</p>
                      ))}
                      <p className="text-sm text-gray-400 mt-3">{info.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div data-aos="fade-right">
              <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-purple-400" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-center py-8"
                      >
                        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                        <p className="text-gray-300">
                          Thank you for contacting us. We'll get back to you within 24 hours.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Full Name *
                            </label>
                            <Input
                              {...register('name', { required: 'Name is required' })}
                              className="bg-white/10 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
                              placeholder="Your full name"
                            />
                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Email Address *
                            </label>
                            <Input
                              {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                  value: /^\S+@\S+$/i,
                                  message: 'Invalid email address'
                                }
                              })}
                              type="email"
                              className="bg-white/10 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
                              placeholder="your@email.com"
                            />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Phone Number
                            </label>
                            <Input
                              {...register('phone')}
                              type="tel"
                              className="bg-white/10 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
                              placeholder="0774301436"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Category
                            </label>
                            <select
                              {...register('category')}
                              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                            >
                              <option value="general" className="bg-slate-800">General Inquiry</option>
                              <option value="technical" className="bg-slate-800">Technical Support</option>
                              <option value="sales" className="bg-slate-800">Sales</option>
                              <option value="returns" className="bg-slate-800">Returns & Exchanges</option>
                              <option value="warranty" className="bg-slate-800">Warranty</option>
                              <option value="custom" className="bg-slate-800">Custom Builds</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Subject *
                          </label>
                          <Input
                            {...register('subject', { required: 'Subject is required' })}
                            className="bg-white/10 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
                            placeholder="Brief description of your inquiry"
                          />
                          {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Message *
                          </label>
                          <textarea
                            {...register('message', { required: 'Message is required' })}
                            rows={6}
                            className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 resize-none"
                            placeholder="Please provide details about your inquiry..."
                          />
                          {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div data-aos="fade-left">
              <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                    <Headphones className="h-8 w-8 text-purple-400" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Find quick answers to common questions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {faqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        className="border border-purple-500/20 rounded-lg overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <button
                          onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                          className="w-full text-left p-4 bg-white/5 hover:bg-white/10 transition-colors duration-300 flex items-center justify-between"
                        >
                          <span className="text-white font-medium pr-4">{faq.question}</span>
                          <motion.div
                            animate={{ rotate: activeFaq === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <svg className="h-5 w-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {activeFaq === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 bg-purple-500/10 border-t border-purple-500/20">
                                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Store Location */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto" data-aos="fade-up">
          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                <MapPin className="h-8 w-8 text-purple-400" />
                Visit Our Store
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Come experience our showroom and meet our expert team in person.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Location Details</h3>
                  <div className="space-y-3 text-gray-300">
                    <p className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      47A/1, King Street, Matale, Sri Lanka
                    </p>
                    <p className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      0774301436 / 0662224650
                    </p>
                    <p className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      info@pcsolutions.lk
                    </p>
                    <p className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      Mon-Fri: 9AM-6PM, Sat: 10AM-4PM
                    </p>
                  </div>
                </div>
                <div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg h-48 flex items-center justify-center border border-purple-500/30">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                      <p className="text-gray-300">Interactive map</p>
                      <p className="text-sm text-gray-400">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black/20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          data-aos="fade-up"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-8">
              <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Schedule a Consultation
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Ready to discuss your technology needs? Book a free consultation with our experts
                and discover how we can help transform your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3">
                  Book Consultation
                </Button>
                <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3">
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}