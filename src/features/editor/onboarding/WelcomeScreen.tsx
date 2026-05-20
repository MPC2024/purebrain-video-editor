'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Smartphone,
  Sparkles,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SLIDES = [
  {
    title: 'Edit Anywhere',
    description: 'Professional video editing on your mobile device. No computer needed.',
    icon: Smartphone,
    gradient: 'from-blue-600 to-cyan-500',
    features: [
      'Works on phone, tablet, and desktop',
      'Touch-friendly interface',
      'Full offline support',
    ],
  },
  {
    title: 'AI-Powered Tools',
    description: 'Smart features to speed up your editing workflow.',
    icon: Sparkles,
    gradient: 'from-purple-600 to-pink-500',
    features: [
      'Auto-captions and transcription',
      'Intelligent cropping suggestions',
      'Automatic color grading',
    ],
  },
  {
    title: 'Export Everywhere',
    description: 'Optimized presets for all major social platforms.',
    icon: Download,
    gradient: 'from-orange-500 to-red-500',
    features: [
      'TikTok, Instagram, YouTube presets',
      'Multiple aspect ratios',
      'High-quality exports',
    ],
  },
]

interface WelcomeScreenProps {
  onDismiss?: () => void
}

export default function WelcomeScreen({ onDismiss }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const hasSeenOnboarding = localStorage.getItem('purebrain-onboarding-seen')
      if (!hasSeenOnboarding) {
        setIsVisible(true)
      }
    }
  }, [])

  const handleDismiss = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('purebrain-onboarding-seen', 'true')
    }
    setIsVisible(false)
    onDismiss?.()
  }

  const handleNextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      handleDismiss()
    }
  }

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  if (!isVisible) return null

  const slide = SLIDES[currentSlide]
  const Icon = slide.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-background rounded-xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Close onboarding"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 min-h-96">
          {/* Left side - Icon and Title */}
          <div className="flex flex-col justify-center space-y-6">
            <div
              className={cn(
                'w-24 h-24 rounded-2xl bg-gradient-to-br flex items-center justify-center',
                `${slide.gradient}`
              )}
            >
              <Icon className="h-12 w-12 text-white" />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground">{slide.title}</h2>
              <p className="text-lg text-muted-foreground">{slide.description}</p>
            </div>

            {/* Features */}
            <ul className="space-y-2">
              {slide.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Illustration placeholder */}
          <div className="hidden md:flex flex-col justify-center">
            <div
              className={cn(
                'aspect-square rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-center p-8',
                `${slide.gradient}`
              )}
            >
              <div className="space-y-4">
                <Icon className="h-20 w-20 mx-auto opacity-20" />
                <p className="text-sm opacity-75">{slide.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-8 md:px-12 pb-8 space-y-4">
          {/* Slide indicators */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    idx === currentSlide
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/30'
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {currentSlide + 1} / {SLIDES.length}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex-1" />

            {currentSlide === SLIDES.length - 1 ? (
              <Button
                size="lg"
                onClick={handleDismiss}
                className="gap-2"
              >
                Get Started
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={handleDismiss}
                  className="px-6"
                >
                  Skip
                </Button>
                <Button
                  size="lg"
                  onClick={handleNextSlide}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
