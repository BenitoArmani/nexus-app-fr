'use client'
import { useState } from 'react'
import { MOCK_COURSES, MOCK_QUIZ } from '@/lib/mock-data'

export function useEducation() {
  const [courses] = useState(MOCK_COURSES)
  const [quiz] = useState(MOCK_QUIZ)
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [quizActive, setQuizActive] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null)

  const categories = ['Tous', 'Programmation', 'Marketing', 'Photographie', 'Musique', 'Finance']
  const filtered = selectedCategory === 'Tous' ? courses : courses.filter(c => c.category === selectedCategory)

  const answerQuiz = (index: number) => {
    setQuizAnswered(index)
    if (index === quiz[quizIndex].correct) setQuizScore(s => s + 1)
    setTimeout(() => {
      setQuizAnswered(null)
      if (quizIndex < quiz.length - 1) setQuizIndex(i => i + 1)
      else setQuizActive(false)
    }, 1500)
  }

  return { courses: filtered, categories, selectedCategory, setSelectedCategory, quiz, quizActive, setQuizActive, quizIndex, quizScore, quizAnswered, answerQuiz }
}
