import { useEffect, useState } from 'react'

export default function AnimatedHeading({
  text,
  className = '',
  charDelay = 30,
  initialDelay = 200,
  transitionDuration = 500,
}) {
  const [animate, setAnimate] = useState(false)
  const lines = text.split('\n')

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), initialDelay)
    return () => clearTimeout(timer)
  }, [initialDelay])

  return (
    <h1 className={className} style={{ letterSpacing: '-0.04em' }}>
      {lines.map((line, lineIndex) => {
        const priorChars = lines
          .slice(0, lineIndex)
          .reduce((sum, priorLine) => sum + priorLine.length, 0)

        return (
          <span key={lineIndex} className="block">
            {line.split('').map((char, charIndex) => {
              const delay =
                priorChars * charDelay + charIndex * charDelay
              const displayChar = char === ' ' ? '\u00A0' : char

              return (
                <span
                  key={`${lineIndex}-${charIndex}`}
                  className="inline-block transition-all"
                  style={{
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateX(0)' : 'translateX(-18px)',
                    transitionDuration: `${transitionDuration}ms`,
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {displayChar}
                </span>
              )
            })}
          </span>
        )
      })}
    </h1>
  )
}
