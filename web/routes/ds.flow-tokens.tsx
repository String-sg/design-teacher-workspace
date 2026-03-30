import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

import { useSetBreadcrumbs } from '~/platform/hooks/use-breadcrumbs';
import { Button } from '~/shared/components/ui/button';
import { ScrollArea } from '~/shared/components/ui/scroll-area';
import { cn } from '~/shared/lib/utils';

export const Route = createFileRoute('/ds/flow-tokens')({
  component: FlowDesignSystemPage,
});

// --- Nav ---

const NAV_SECTIONS = [
  {
    title: 'Primitives',
    items: [
      { id: 'font', label: 'Font' },
      { id: 'spacing', label: 'Spacing' },
      { id: 'radius', label: 'Border Radius' },
      { id: 'border-width', label: 'Border Width' },
      { id: 'shadows', label: 'Shadows' },
    ],
  },
  {
    title: 'Color Scales',
    items: [
      { id: 'scale-neutral', label: 'Neutral (Slate)' },
      { id: 'scale-brand', label: 'Brand' },
      { id: 'scale-accent', label: 'Accent (Mint)' },
      { id: 'scale-success', label: 'Success (Green)' },
      { id: 'scale-caution', label: 'Caution (Orange)' },
      { id: 'scale-info', label: 'Info (Blue)' },
      { id: 'scale-critical', label: 'Critical (Ruby)' },
    ],
  },
  {
    title: 'Semantic Colors',
    items: [
      { id: 'sem-background', label: 'Background' },
      { id: 'sem-foreground', label: 'Foreground' },
      { id: 'sem-border', label: 'Border' },
      { id: 'sem-fill', label: 'Fill' },
      { id: 'sem-shadow', label: 'Shadow Colors' },
    ],
  },
  {
    title: 'Typography',
    items: [
      { id: 'text-display', label: 'Display' },
      { id: 'text-headline', label: 'Headline' },
      { id: 'text-title', label: 'Title' },
      { id: 'text-body', label: 'Body' },
      { id: 'text-label', label: 'Label' },
    ],
  },
  {
    title: 'Component Tokens',
    items: [
      { id: 'btn-tokens', label: 'Button' },
      { id: 'input-tokens', label: 'Input' },
    ],
  },
  {
    title: 'Bridge',
    items: [{ id: 'bridge', label: 'Token Bridge' }],
  },
];

// --- Helpers ---

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="mb-1 text-xl font-semibold">{title}</h2>
      {description && <p className="mb-4 text-sm text-muted-foreground">{description}</p>}
      {!description && <div className="mb-4" />}
      {children}
    </section>
  );
}

function Swatch({ cssVar, label }: { cssVar: string; label: string }) {
  return (
    <div className="flex w-12 flex-col items-center gap-1.5">
      <div
        className="size-12 shrink-0 rounded-lg border border-border"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <span className="w-full text-center text-xs leading-tight break-words text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function ColorScale({
  name,
  prefix,
  steps = STEPS_12,
}: {
  name: string;
  prefix: string;
  steps?: number[];
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{name}</h4>
      <div className="flex flex-wrap gap-2">
        {steps.map((s) => (
          <Swatch key={s} cssVar={`--${prefix}-${s}`} label={`${s}`} />
        ))}
      </div>
    </div>
  );
}

function TokenRow({ token, preview }: { token: string; preview?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-border py-2 last:border-0">
      <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs">{token}</code>
      <div className="flex-1" />
      {preview}
    </div>
  );
}

function ColorTokenRow({ token }: { token: string }) {
  return (
    <TokenRow
      token={token}
      preview={
        <div
          className="size-8 shrink-0 rounded border border-border"
          style={{ backgroundColor: `var(${token})` }}
        />
      }
    />
  );
}

const STEPS_12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// --- Page ---

function FlowDesignSystemPage() {
  useSetBreadcrumbs([
    { label: 'Design System', href: '/ds' },
    { label: 'Flow DS Tokens', href: '/ds/flow-tokens' },
  ]);

  const [activeSection, setActiveSection] = useState('font');

  return (
    <div className="flex h-full">
      {/* Left Nav */}
      <nav className="sticky top-0 h-[calc(100vh-3.5rem)] w-52 shrink-0 border-r border-border">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                          'block rounded-md px-2 py-1.5 text-sm transition-colors',
                          activeSection === item.id
                            ? 'bg-muted font-medium text-foreground'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                        )}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </nav>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-4xl space-y-16 p-8">
          <div>
            <h1 className="text-2xl font-bold">Flow DS Tokens</h1>
            <p className="mt-1 text-muted-foreground">
              All CSS custom properties from{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">@flow/design-tokens</code>,
              rendered live.
            </p>
          </div>

          {/* ===== PRIMITIVES ===== */}

          <FontSection />
          <SpacingSection />
          <RadiusSection />
          <BorderWidthSection />
          <ShadowsSection />

          {/* ===== COLOR SCALES ===== */}

          <Section
            id="scale-neutral"
            title="Neutral (Slate)"
            description="--color-neutral-* → mapped from --color-slate-*"
          >
            <ColorScale name="Neutral" prefix="color-neutral" />
          </Section>

          <Section
            id="scale-brand"
            title="Brand"
            description="--color-brand-* (overridden with --twblue-* via bridge)"
          >
            <ColorScale name="Brand" prefix="color-brand" />
          </Section>

          <Section
            id="scale-accent"
            title="Accent (Mint)"
            description="--color-accent-* → mapped from --color-mint-*"
          >
            <ColorScale name="Accent" prefix="color-accent" />
          </Section>

          <Section
            id="scale-success"
            title="Success (Green)"
            description="--color-success-* → mapped from --color-green-*"
          >
            <ColorScale name="Success" prefix="color-success" />
          </Section>

          <Section
            id="scale-caution"
            title="Caution (Orange)"
            description="--color-caution-* → mapped from --color-orange-*"
          >
            <ColorScale name="Caution" prefix="color-caution" />
          </Section>

          <Section
            id="scale-info"
            title="Info (Blue)"
            description="--color-info-* → mapped from --color-blue-*"
          >
            <ColorScale name="Info" prefix="color-info" />
          </Section>

          <Section
            id="scale-critical"
            title="Critical (Ruby)"
            description="--color-critical-* (overridden with --crimson-* via bridge)"
          >
            <ColorScale name="Critical" prefix="color-critical" />
          </Section>

          {/* ===== SEMANTIC COLORS ===== */}

          <Section id="sem-background" title="Background">
            <div className="space-y-0">
              {[
                '--color-background-page',
                '--color-background-section',
                '--color-background-section-inverse',
                '--color-background-popover',
                '--color-background-skeleton',
                '--color-background-critical',
                '--color-background-success',
                '--color-background-caution',
                '--color-background-info',
                '--color-background-overlay',
              ].map((t) => (
                <ColorTokenRow key={t} token={t} />
              ))}
            </div>
          </Section>

          <Section id="sem-foreground" title="Foreground">
            <div className="space-y-0">
              {[
                '--color-foreground-default',
                '--color-foreground-subtle',
                '--color-foreground-section',
                '--color-foreground-section-inverse',
                '--color-foreground-page',
                '--color-foreground-disabled',
                '--color-foreground-placeholder',
                '--color-foreground-contrast',
                '--color-foreground-selected-strong',
                '--color-foreground-link',
                '--color-foreground-link-hover',
                '--color-foreground-link-visited',
                '--color-foreground-critical',
                '--color-foreground-critical-strong',
                '--color-foreground-success',
                '--color-foreground-success-strong',
                '--color-foreground-caution',
                '--color-foreground-info',
              ].map((t) => (
                <ColorTokenRow key={t} token={t} />
              ))}
            </div>
          </Section>

          <Section id="sem-border" title="Border">
            <div className="space-y-0">
              {[
                '--color-border-default',
                '--color-border-focus',
                '--color-border-brand',
                '--color-border-critical',
                '--color-border-critical-strong',
                '--color-border-success',
                '--color-border-caution',
                '--color-border-info',
                '--color-border-accent',
              ].map((t) => (
                <ColorTokenRow key={t} token={t} />
              ))}
            </div>
          </Section>

          <Section id="sem-fill" title="Fill">
            <div className="space-y-0">
              {[
                '--color-fill-contrast',
                '--color-fill-inactive',
                '--color-fill-selected-subtle',
                '--color-fill-selected-strong',
                '--color-fill-critical',
                '--color-fill-critical-hover',
                '--color-fill-success',
                '--color-fill-success-hover',
                '--color-fill-caution',
                '--color-fill-caution-hover',
                '--color-lightest',
                '--color-darkest',
              ].map((t) => (
                <ColorTokenRow key={t} token={t} />
              ))}
            </div>
          </Section>

          <Section id="sem-shadow" title="Shadow Colors">
            <div className="space-y-0">
              {[
                '--color-shadow-2xs',
                '--color-shadow-xs',
                '--color-shadow-sm',
                '--color-shadow-md',
                '--color-shadow-lg',
                '--color-shadow-xl',
                '--color-shadow-2xl',
              ].map((t) => (
                <ColorTokenRow key={t} token={t} />
              ))}
            </div>
          </Section>

          {/* ===== TYPOGRAPHY ===== */}

          <TextStylesSection
            id="text-display"
            title="Display"
            styles={[
              {
                name: 'display-sm',
                size: '2.875rem',
                lineHeight: '56px',
                weight: 'bold',
              },
              {
                name: 'display-md',
                size: '3.25rem',
                lineHeight: '64px',
                weight: 'bold',
              },
              {
                name: 'display-lg',
                size: '4.125rem',
                lineHeight: '80px',
                weight: 'bold',
              },
            ]}
          />

          <TextStylesSection
            id="text-headline"
            title="Headline"
            styles={[
              {
                name: 'headline-sm',
                size: '2rem',
                lineHeight: '40px',
                weight: 'semibold',
              },
              {
                name: 'headline-sm-strong',
                size: '2rem',
                lineHeight: '40px',
                weight: 'bold',
              },
              {
                name: 'headline-md',
                size: '2.25rem',
                lineHeight: '44px',
                weight: 'semibold',
              },
              {
                name: 'headline-md-strong',
                size: '2.25rem',
                lineHeight: '44px',
                weight: 'bold',
              },
              {
                name: 'headline-lg',
                size: '2.5625rem',
                lineHeight: '48px',
                weight: 'semibold',
              },
              {
                name: 'headline-lg-strong',
                size: '2.5625rem',
                lineHeight: '48px',
                weight: 'bold',
              },
            ]}
          />

          <TextStylesSection
            id="text-title"
            title="Title"
            styles={[
              {
                name: 'title-sm',
                size: '1.25rem',
                lineHeight: '24px',
                weight: 'semibold',
              },
              {
                name: 'title-sm-strong',
                size: '1.25rem',
                lineHeight: '24px',
                weight: 'bold',
              },
              {
                name: 'title-md',
                size: '1.4375rem',
                lineHeight: '28px',
                weight: 'semibold',
              },
              {
                name: 'title-md-strong',
                size: '1.4375rem',
                lineHeight: '28px',
                weight: 'bold',
              },
              {
                name: 'title-lg',
                size: '1.625rem',
                lineHeight: '32px',
                weight: 'semibold',
              },
              {
                name: 'title-lg-strong',
                size: '1.625rem',
                lineHeight: '32px',
                weight: 'bold',
              },
            ]}
          />

          <TextStylesSection
            id="text-body"
            title="Body"
            styles={[
              {
                name: 'body-sm',
                size: '0.875rem',
                lineHeight: '20px',
                weight: 'regular',
              },
              {
                name: 'body-sm-strong',
                size: '0.875rem',
                lineHeight: '20px',
                weight: 'semibold',
              },
              {
                name: 'body-md',
                size: '1rem',
                lineHeight: '24px',
                weight: 'regular',
              },
              {
                name: 'body-md-strong',
                size: '1rem',
                lineHeight: '24px',
                weight: 'semibold',
              },
              {
                name: 'body-lg',
                size: '1.125rem',
                lineHeight: '28px',
                weight: 'regular',
              },
              {
                name: 'body-lg-strong',
                size: '1.125rem',
                lineHeight: '28px',
                weight: 'semibold',
              },
              {
                name: 'body-xl',
                size: '1.25rem',
                lineHeight: '32px',
                weight: 'regular',
              },
              {
                name: 'body-xl-strong',
                size: '1.25rem',
                lineHeight: '32px',
                weight: 'semibold',
              },
              {
                name: 'body-2xl',
                size: '1.625rem',
                lineHeight: '40px',
                weight: 'regular',
              },
              {
                name: 'body-2xl-strong',
                size: '1.625rem',
                lineHeight: '40px',
                weight: 'semibold',
              },
            ]}
          />

          <TextStylesSection
            id="text-label"
            title="Label"
            styles={[
              {
                name: 'label-xs',
                size: '0.6875rem',
                lineHeight: '11px',
                weight: 'regular',
              },
              {
                name: 'label-sm',
                size: '0.875rem',
                lineHeight: '14px',
                weight: 'regular',
              },
              {
                name: 'label-sm-strong',
                size: '0.875rem',
                lineHeight: '14px',
                weight: 'semibold',
              },
              {
                name: 'label-md',
                size: '1rem',
                lineHeight: '16px',
                weight: 'regular',
              },
              {
                name: 'label-md-strong',
                size: '1rem',
                lineHeight: '16px',
                weight: 'semibold',
              },
              {
                name: 'label-lg',
                size: '1.125rem',
                lineHeight: '18px',
                weight: 'regular',
              },
              {
                name: 'label-lg-strong',
                size: '1.125rem',
                lineHeight: '18px',
                weight: 'semibold',
              },
            ]}
          />

          {/* ===== COMPONENT TOKENS ===== */}

          <Section id="btn-tokens" title="Button Tokens">
            <div className="space-y-0">
              {[
                '--btn-color-fill-enabled',
                '--btn-color-fill-hover',
                '--btn-color-fill-ghost',
                '--btn-color-fill-ghost-hover',
                '--btn-color-fill-brand-enabled',
                '--btn-color-fill-brand-hover',
                '--btn-color-fill-accent-enabled',
                '--btn-color-fill-accent-hover',
                '--btn-color-fill-disabled',
                '--btn-color-border-brand',
                '--btn-color-border-brand-strong',
                '--btn-color-border-brand-disabled',
                '--btn-color-foreground-ghost',
                '--btn-color-foreground-outline',
                '--btn-color-foreground-outline-hover',
                '--btn-color-foreground-brand-enabled',
                '--btn-color-foreground-brand-hover',
                '--btn-color-foreground-accent-enabled',
                '--btn-color-foreground-accent-hover',
                '--btn-color-foreground-disabled',
              ].map((t) => (
                <ColorTokenRow key={t} token={t} />
              ))}
            </div>
          </Section>

          <Section id="input-tokens" title="Input Tokens">
            <div className="space-y-0">
              {[
                '--input-color-fill-default',
                '--input-color-fill-hover',
                '--input-color-fill-disabled',
              ].map((t) => (
                <ColorTokenRow key={t} token={t} />
              ))}
            </div>
          </Section>

          {/* ===== BRIDGE ===== */}

          <BridgeSection />
        </div>
      </ScrollArea>
    </div>
  );
}

// ============================================================
// SECTION COMPONENTS
// ============================================================

function FontSection() {
  const sizes = [
    { token: '--font-size-50', value: '0.6875rem' },
    { token: '--font-size-100', value: '0.8125rem' },
    { token: '--font-size-150', value: '0.875rem' },
    { token: '--font-size-200', value: '1rem' },
    { token: '--font-size-250', value: '1.125rem' },
    { token: '--font-size-300', value: '1.25rem' },
    { token: '--font-size-350', value: '1.4375rem' },
    { token: '--font-size-400', value: '1.625rem' },
    { token: '--font-size-450', value: '1.8125rem' },
    { token: '--font-size-500', value: '2rem' },
    { token: '--font-size-550', value: '2.25rem' },
    { token: '--font-size-600', value: '2.5625rem' },
    { token: '--font-size-650', value: '2.875rem' },
    { token: '--font-size-700', value: '3.25rem' },
    { token: '--font-size-750', value: '3.625rem' },
    { token: '--font-size-800', value: '4.125rem' },
  ];

  return (
    <Section id="font" title="Font" description="Font families, sizes, weights, and line heights">
      <div className="space-y-8">
        {/* Families */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Families</h4>
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">--font-family-inter</code>
              <span style={{ fontFamily: 'var(--font-family-inter)' }}>Inter</span>
            </div>
            <div className="flex items-baseline gap-3">
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                --font-family-atkinson-hyperlegible
              </code>
              <span
                style={{
                  fontFamily: 'var(--font-family-atkinson-hyperlegible)',
                }}
              >
                Atkinson Hyperlegible
              </span>
            </div>
          </div>
        </div>

        {/* Weights */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Weights</h4>
          <div className="flex flex-wrap gap-6">
            {[
              {
                token: '--font-weight-regular',
                value: '400',
                label: 'Regular',
              },
              {
                token: '--font-weight-semibold',
                value: '600',
                label: 'Semibold',
              },
              { token: '--font-weight-bold', value: '700', label: 'Bold' },
            ].map((w) => (
              <div key={w.token} className="space-y-1">
                <p className="text-lg" style={{ fontWeight: `var(${w.token})` }}>
                  {w.label}
                </p>
                <code className="block rounded bg-muted px-1.5 py-0.5 text-xs">
                  {w.token}: {w.value}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Line Heights */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Line Heights</h4>
          <div className="flex flex-wrap gap-6">
            {[
              { token: '--font-lineheight-sm', value: '1' },
              { token: '--font-lineheight-md', value: '1.2' },
              { token: '--font-lineheight-lg', value: '1.5' },
            ].map((lh) => (
              <code key={lh.token} className="rounded bg-muted px-1.5 py-0.5 text-xs">
                {lh.token}: {lh.value}
              </code>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Sizes</h4>
          <div className="space-y-3">
            {sizes.map((s) => (
              <div key={s.token} className="flex items-baseline gap-3">
                <code className="w-40 shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs">
                  {s.token}
                </code>
                <span className="truncate" style={{ fontSize: `var(${s.token})`, lineHeight: 1.2 }}>
                  Aa
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function SpacingSection() {
  const spacings = [
    { token: '--spacing-2xs', value: '0.25rem' },
    { token: '--spacing-xs', value: '0.5rem' },
    { token: '--spacing-sm', value: '0.75rem' },
    { token: '--spacing-md', value: '1rem' },
    { token: '--spacing-lg', value: '1.5rem' },
    { token: '--spacing-xl', value: '2rem' },
    { token: '--spacing-2xl', value: '2.5rem' },
    { token: '--spacing-3xl', value: '3rem' },
    { token: '--spacing-4xl', value: '4rem' },
  ];

  return (
    <Section id="spacing" title="Spacing">
      <div className="space-y-3">
        {spacings.map((s) => (
          <div key={s.token} className="flex items-center gap-3">
            <code className="w-36 shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs">{s.token}</code>
            <div className="h-4 rounded bg-primary/60" style={{ width: `var(${s.token})` }} />
            <span className="text-xs text-muted-foreground">{s.value}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function RadiusSection() {
  const radii = [
    { token: '--radius-xs', value: '2px' },
    { token: '--radius-sm', value: '6px' },
    { token: '--radius-md', value: '8px' },
    { token: '--radius-lg', value: '10px' },
    { token: '--radius-xl', value: '14px' },
    { token: '--radius-2xl', value: '16px' },
    { token: '--radius-3xl', value: '24px' },
    { token: '--radius-4xl', value: '32px' },
    { token: '--radius-full', value: '9999px' },
  ];

  return (
    <Section
      id="radius"
      title="Border Radius"
      description="Note: our app overrides --radius-sm through --radius-4xl in the @theme block"
    >
      <div className="flex flex-wrap gap-4">
        {radii.map((r) => (
          <div key={r.token} className="flex flex-col items-center gap-1.5">
            <div
              className="size-16 border-2 border-primary bg-primary/10"
              style={{ borderRadius: `var(${r.token})` }}
            />
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              {r.token.replace('--radius-', '')}
            </code>
            <span className="text-xs text-muted-foreground">{r.value}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function BorderWidthSection() {
  const widths = [
    { token: '--border-width-xs', value: '1px' },
    { token: '--border-width-sm', value: '1.5px' },
    { token: '--border-width-md', value: '2px' },
    { token: '--border-width-lg', value: '3px' },
  ];

  return (
    <Section id="border-width" title="Border Width">
      <div className="flex flex-wrap gap-6">
        {widths.map((b) => (
          <div key={b.token} className="flex flex-col items-center gap-1.5">
            <div
              className="size-16 rounded-lg border-foreground"
              style={{ borderWidth: `var(${b.token})`, borderStyle: 'solid' }}
            />
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              {b.token.replace('--border-width-', '')}
            </code>
            <span className="text-xs text-muted-foreground">{b.value}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ShadowsSection() {
  const shadows = [
    { token: '--shadow-2xs', label: '2xs' },
    { token: '--shadow-xs', label: 'xs' },
    { token: '--shadow-sm', label: 'sm' },
    { token: '--shadow-md', label: 'md' },
    { token: '--shadow-lg', label: 'lg' },
    { token: '--shadow-xl', label: 'xl' },
    { token: '--shadow-2xl', label: '2xl' },
  ];

  return (
    <Section id="shadows" title="Shadows">
      <div className="flex flex-wrap gap-6">
        {shadows.map((s) => (
          <div key={s.token} className="flex flex-col items-center gap-2">
            <div className="size-20 rounded-lg bg-card" style={{ boxShadow: `var(${s.token})` }} />
            <code className="rounded bg-muted px-1 py-0.5 text-xs">{s.label}</code>
          </div>
        ))}
      </div>
    </Section>
  );
}

function TextStylesSection({
  id,
  title,
  styles,
}: {
  id: string;
  title: string;
  styles: {
    name: string;
    size: string;
    lineHeight: string;
    weight: string;
  }[];
}) {
  const fontWeightMap: Record<string, number> = {
    regular: 400,
    semibold: 600,
    bold: 700,
  };

  return (
    <Section id={id} title={title}>
      <div className="space-y-4">
        {styles.map((s) => (
          <div
            key={s.name}
            className="flex items-baseline gap-4 border-b border-border pb-3 last:border-0"
          >
            <code className="w-52 shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs">
              text-style-{s.name}
            </code>
            <span
              className="truncate"
              style={{
                fontSize: s.size,
                lineHeight: s.lineHeight,
                fontWeight: fontWeightMap[s.weight],
              }}
            >
              The quick brown fox
            </span>
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
              {s.size} / {s.lineHeight} / {s.weight}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function BridgeSection() {
  const mappings = [
    { ours: '--background', flow: '--color-background-page' },
    { ours: '--card / white', flow: '--color-background-section' },
    { ours: '--popover', flow: '--color-background-popover' },
    { ours: '--foreground', flow: '--color-foreground-default' },
    { ours: '--card-foreground', flow: '--color-foreground-section' },
    { ours: '--border', flow: '--color-border-default' },
    { ours: '--ring', flow: '--color-border-focus' },
    { ours: '--destructive', flow: '--color-fill-critical' },
    { ours: '--slate-*', flow: '--color-neutral-*' },
    { ours: '--twblue-*', flow: '--color-brand-*' },
    { ours: '--crimson-*', flow: '--color-critical-*' },
  ];

  return (
    <Section
      id="bridge"
      title="Token Bridge"
      description="How our existing tokens map to Flow DS semantic token names. Defined in styles.css :root and .dark."
    >
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-2 text-left font-medium">Our Token</th>
              <th className="px-4 py-2 text-left font-medium">Flow DS Token</th>
              <th className="px-4 py-2 text-left font-medium">Preview</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((m) => {
              const isScale = m.ours.endsWith('-*');
              const flowPreviewVar = isScale
                ? `--${m.flow.replace('--', '').replace('-*', '-9')}`
                : m.flow;
              return (
                <tr key={m.flow} className="border-b border-border last:border-0">
                  <td className="px-4 py-2">
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">{m.ours}</code>
                  </td>
                  <td className="px-4 py-2">
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">{m.flow}</code>
                  </td>
                  <td className="px-4 py-2">
                    <div
                      className="size-6 rounded border border-border"
                      style={{
                        backgroundColor: `var(${flowPreviewVar})`,
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
