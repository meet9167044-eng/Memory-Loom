import AnimatedHeading from '../ui/AnimatedHeading'
import FadeIn from '../ui/FadeIn'

const NAV_LINKS = ['Timelines', 'Fragments', 'Paradoxes', 'Repair']

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'

export default function IntroHero({ onEnter }) {
  return (
    <div className="relative flex min-h-svh flex-col bg-black font-sans text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src={VIDEO_URL}
      />

      <div className="relative z-10 flex min-h-svh flex-col px-6 pt-6 md:px-12 lg:px-16">
        <header>
          <div className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
            <span className="text-2xl font-semibold tracking-tight">LOOM</span>

            <nav className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <button
                  key={link}
                  type="button"
                  onClick={onEnter}
                  className="text-sm text-white transition-colors hover:text-gray-300"
                >
                  {link}
                </button>
              ))}
            </nav>

            <button
              type="button"
              onClick={onEnter}
              className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100"
            >
              Enter the Loom
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-end pb-12 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end">
            <div>
              <AnimatedHeading
                text={'Weaving reality\nfrom forgotten memory.'}
                className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl"
              />

              <FadeIn delay={800} duration={1000}>
                <p className="mb-5 text-base text-gray-300 md:text-lg">
                  You are the Senior Reality Archivist. Restore Memory Integrity
                  from 42.5% before the Last Forgotten City vanishes from
                  history itself.
                </p>
              </FadeIn>

              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={onEnter}
                    className="rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-gray-100"
                  >
                    Enter the Loom
                  </button>
                  <button
                    type="button"
                    onClick={onEnter}
                    className="liquid-glass rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black"
                  >
                    View Mission Brief
                  </button>
                </div>
              </FadeIn>
            </div>

            <FadeIn
              delay={1400}
              duration={1000}
              className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end"
            >
              <div className="liquid-glass rounded-xl border border-white/20 px-6 py-3">
                <p className="text-lg font-light md:text-xl lg:text-2xl">
                  Integrity. Timelines. Paradoxes.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}
