'use client'
import { Check, X } from 'lucide-react'
import { checkPasswordStrength } from '@/lib/security'

interface PasswordStrengthProps {
  password: string
  className?: string
}

const REQS = [
  { key: 'length',    label: '8 caractères minimum' },
  { key: 'uppercase', label: '1 majuscule' },
  { key: 'digit',     label: '1 chiffre' },
  { key: 'special',   label: '1 caractère spécial' },
  { key: 'noCommon',  label: 'Non trivial' },
] as const

export default function PasswordStrength({ password, className = '' }: PasswordStrengthProps) {
  if (!password) return null
  const { score, label, color, barColor, requirements } = checkPasswordStrength(password)

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Strength bars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? barColor : 'bg-white/10'}`}
          />
        ))}
      </div>

      {/* Label */}
      {label && <p className={`text-xs font-semibold ${color}`}>Force : {label}</p>}

      {/* Requirements checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {REQS.map(({ key, label: reqLabel }) => (
          <div
            key={key}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              requirements[key] ? 'text-emerald-400' : 'text-text-muted'
            }`}
          >
            {requirements[key] ? <Check size={10} /> : <X size={10} />}
            {reqLabel}
          </div>
        ))}
      </div>
    </div>
  )
}
