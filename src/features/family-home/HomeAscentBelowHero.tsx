import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { SectionHeading } from '@/design-system/ascent/SectionHeading'
import { cn } from '@/lib/utils'

function StatCard({ title, body }: { title: string; body: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-sm',
        'motion-safe:transition-shadow motion-safe:duration-200 motion-safe:hover:shadow-md',
      )}
    >
      <p className="font-heading text-lg font-bold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  )
}

function MissionCard({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
      <h3 className="font-heading text-xl font-bold text-teal-900">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{body}</p>
      <Link
        to={href}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-600 px-4 text-sm font-bold text-white hover:bg-teal-700"
      >
        {cta}
      </Link>
    </div>
  )
}

export function HomeAscentBelowHero() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-8 md:space-y-16 md:py-12">
      <section className="rounded-3xl border border-amber-100/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm md:p-10" aria-labelledby="home-trust-heading">
        <SectionHeading
          id="home-trust-heading"
          kicker={t('home.ascentTrustKicker')}
          title={t('home.ascentTrustTitle')}
          align="center"
          className="max-w-3xl"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title={t('home.ascentStat1Title')} body={t('home.ascentStat1Body')} />
          <StatCard title={t('home.ascentStat2Title')} body={t('home.ascentStat2Body')} />
          <StatCard title={t('home.ascentStat3Title')} body={t('home.ascentStat3Body')} />
          <StatCard title={t('home.ascentStat4Title')} body={t('home.ascentStat4Body')} />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-ascent-warm px-6 py-10 md:px-10" aria-labelledby="home-mission-heading">
        <SectionHeading
          id="home-mission-heading"
          kicker={t('home.ascentMissionKicker')}
          title={t('home.ascentMissionTitle')}
          description={t('home.ascentMissionBody')}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <MissionCard
            title={t('home.ascentPillar1Title')}
            body={t('home.ascentPillar1Body')}
            href="/track/social-safety"
            cta={t('home.ascentPillar1Cta')}
          />
          <MissionCard
            title={t('home.ascentPillar2Title')}
            body={t('home.ascentPillar2Body')}
            href="/practice"
            cta={t('home.ascentPillar2Cta')}
          />
          <MissionCard
            title={t('home.ascentPillar3Title')}
            body={t('home.ascentPillar3Body')}
            href="/ai-tutor"
            cta={t('home.ascentPillar3Cta')}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-10" aria-labelledby="home-gallery-heading">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="home-gallery-heading"
            kicker={t('home.ascentGalleryKicker')}
            title={t('home.ascentGalleryTitle')}
            description={t('home.ascentGalleryBody')}
          />
          <Link
            to="/books"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl border-2 border-teal-700/35 bg-teal-50 px-6 text-sm font-bold text-teal-900 hover:bg-teal-100"
          >
            {t('home.ascentGalleryCta')}
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          {['/safety-card.png', '/homework-card.png', '/globalposter.png', '/sparkiaicodingcardhomepage.png'].map((src) => (
            <Link
              key={src}
              to="/books"
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
            >
              <img src={src} alt="" className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.03]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-6 md:p-10" aria-labelledby="home-faq-heading">
        <SectionHeading id="home-faq-heading" kicker={t('home.ascentFaqKicker')} title={t('home.ascentFaqTitle')} align="center" className="max-w-2xl" />
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {(
            [
              { q: 'home.ascentFaq1Q', a: 'home.ascentFaq1A' },
              { q: 'home.ascentFaq2Q', a: 'home.ascentFaq2A' },
              { q: 'home.ascentFaq3Q', a: 'home.ascentFaq3A' },
            ] as const
          ).map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-heading text-base font-bold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span>{t(q)}</span>
                <span className="text-teal-700 motion-safe:transition-transform group-open:rotate-180" aria-hidden>
                  ▼
                </span>
              </summary>
              <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">{t(a)}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
