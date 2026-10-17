import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';

export const ContactPage: React.FC = () => {
  const { content, showToast } = useContent();
  const { contact } = content;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'strategy',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Please provide message details (minimum 10 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitted(true);
    showToast('Inquiry sent successfully! Our team will respond shortly.');
  };

  return (
    <div className="py-12 lg:py-16 bg-[#f6f7fc] dark:bg-[#070d18] min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-2">
            <span>Get In Touch</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
            <span>Contact Us</span>
          </div>

          <PerspectiveHeading
            text={contact.title}
            as="h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15233c] dark:text-white tracking-tight mb-4 [text-wrap:balance] font-display"
          />

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {contact.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details & Office Details */}
          <div className="lg:col-span-5 space-y-6">
            
            <Card3D maxTilt={6} scale={1.01} className="w-full">
              <div className="bg-white dark:bg-[#111C2E] p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
                <h2 className="text-lg font-bold text-[#15233c] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 font-display">
                  Headquarters & Direct Channels
                </h2>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Office Address</span>
                    <p className="text-sm font-semibold text-[#15233c] dark:text-white mt-0.5">
                      {contact.officeAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Direct Telephone</span>
                    <a 
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} 
                      className="text-sm font-semibold text-[#15233c] dark:text-white hover:text-[#245237] dark:hover:text-[#21afc2] transition-colors tabular-nums mt-0.5 block"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Inquiries Email</span>
                    <a 
                      href={`mailto:${contact.email}`} 
                      className="text-sm font-semibold text-[#15233c] dark:text-white hover:text-[#245237] dark:hover:text-[#21afc2] transition-colors mt-0.5 block"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Working Hours</span>
                    <p className="text-sm font-semibold text-[#15233c] dark:text-white mt-0.5">
                      {contact.hours}
                    </p>
                  </div>
                </div>
              </div>
            </Card3D>

            {/* Ricardo Affiliation Assurance */}
            <div className="p-6 rounded-3xl bg-[#15233c] dark:bg-[#0B111E] text-white border border-white/10 dark:border-slate-800 shadow-xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#21afc2] block mb-1">
                Ricardo Global Network
              </span>
              <p className="text-xs text-slate-300 dark:text-slate-400 leading-relaxed">
                As a Ricardo Company, we guarantee confidentiality and compliance across all government probity requirements and tender processes.
              </p>
            </div>

          </div>

          {/* Interactive Form with Dark Mode Inputs */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111C2E] p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl">
            
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#245237] dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#15233c] dark:text-white mb-2 font-display">
                  Inquiry Received
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
                  Thank you, <strong>{formData.name}</strong>. A senior infrastructure advisor from Bombheq Partners will review your message and contact you within one business day.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      serviceInterest: 'strategy',
                      subject: '',
                      message: ''
                    });
                  }}
                  className="px-6 py-3 text-xs font-semibold text-[#245237] dark:text-[#21afc2] bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition-all cursor-pointer transform hover:-translate-y-0.5 border border-emerald-200 dark:border-emerald-800"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-[#15233c] dark:text-white mb-1 font-display">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All fields marked with an asterisk (*) are required.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Eleanor Rigby"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all focus:outline-none bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white ${
                        errors.name 
                          ? 'border-red-500 bg-red-50/30' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. eleanor@agency.gov.au"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all focus:outline-none bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white ${
                        errors.email 
                          ? 'border-red-500 bg-red-50/30' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+61 400 000 000"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Advisory Discipline
                    </label>
                    <select
                      value={formData.serviceInterest}
                      onChange={e => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20 focus:outline-none"
                    >
                      <option value="strategy">Strategy & Policy Advice</option>
                      <option value="transaction">Procurement & Transaction</option>
                      <option value="disputes">Contract Disputes & Expert Witness</option>
                      <option value="commercial">Commercial & Delivery Governance</option>
                      <option value="careers">Careers & Joining the Team</option>
                      <option value="other">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of project or requirement"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your infrastructure initiative, timeframe, or specific advisory need..."
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all focus:outline-none bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white ${
                      errors.message 
                        ? 'border-red-500 bg-red-50/30' 
                        : 'border-slate-200 dark:border-slate-700 focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#0b111e] rounded-xl transition-all transform hover:-translate-y-0.5 shadow-xs hover:shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Advisory Request</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
