'use client'
import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import gsap from 'gsap'

interface Props {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const animated = useRef(false)

  useEffect(() => {
    if (!isInView || animated.current || !ref.current) return
    animated.current = true
    const obj = { value: 0 }
    const tween = gsap.to(obj, {
      value: target,
      duration,
      ease: 'power2.out',
      onUpdate() {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(obj.value)}${suffix}`
        }
      },
    })
    return () => { tween.kill() }
  }, [isInView, target, duration, suffix, prefix])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
