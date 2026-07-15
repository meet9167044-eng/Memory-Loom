import { Settings as SettingsIcon, User, Shield, Bell, Database, Cpu, Save } from 'lucide-react'
import { useState } from 'react'
import { mission } from '../data'

const SECTIONS = [
  { id: 'profile',       label: 'Archivist Profile', icon: User },
  { id: 'security',      label: 'Security',          icon: Shield },
  { id: 'notifications', label: 'Notifications',     icon: Bell },
  { id: 'data',          label: 'Data & Archive',    icon: Database },
  { id: 'system',        label: 'System Config',     icon: Cpu },
]

const TOGGLES = [
  { label: 'Critical breach alerts',            key: 'breach',  default: true },
  { label: 'Paradox escalation warnings',       key: 'paradox', default: true },
  { label: 'Daily integrity digest',            key: 'digest',  default: false },
  { label: 'Thread divergence notifications',   key: 'diverge', default: true },
  { label: 'Fragment restore confirmations',    key: 'restore', default: false },
]

function Toggle({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderBottomColor: 'rgba(212,146,58,0.05)' }}>
      <span className="ui-text text-sm" style={{ color: 'rgba(255,240,210,0.65)' }}>{label}</span>
      <button
        onClick={() => setOn(!on)}
        className="relative w-10 h-5 rounded-full transition-colors duration-200"
        style={{ background: on ? 'rgba(212,146,58,0.35)' : 'rgba(255,255,255,0.08)' }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-200"
          style={{
            transform: on ? 'translateX(20px)' : 'translateX(0)',
            background: on ? '#D4923A' : 'rgba(255,240,210,0.35)',
            boxShadow: on ? '0 0 8px rgba(212,146,58,0.6)' : 'none',
          }}
        />
      </button>
    </div>
  )
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile')

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-2">
        <SettingsIcon size={15} style={{ color: 'rgba(212,146,58,0.45)' }} />
        <h2 className="display text-xl text-white font-normal">Archivist Configuration</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Section nav */}
        <div className="loom-card p-2.5 lg:col-span-1 flex flex-col gap-1">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                background: activeSection === id ? 'rgba(212,146,58,0.1)' : 'transparent',
                color: activeSection === id ? '#D4923A' : 'rgba(240,210,160,0.42)',
                borderRight: activeSection === id ? '2px solid #D4923A' : '2px solid transparent',
              }}
            >
              <Icon size={14} style={{ color: activeSection === id ? '#D4923A' : 'rgba(212,146,58,0.3)' }} />
              <span className="ui-text font-medium text-[13px]">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="loom-card p-5 lg:col-span-3">
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <h3 className="display text-base text-white font-normal">Archivist Profile</h3>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/2 border" style={{ borderColor: 'rgba(212,146,58,0.08)' }}>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,146,58,0.18), rgba(212,146,58,0.04))',
                    border: '1px solid rgba(212,146,58,0.25)',
                  }}
                >
                  <User size={22} style={{ color: '#D4923A' }} />
                </div>
                <div>
                  <p className="ui-text text-sm font-medium text-white/90">{mission.archivist.designation}</p>
                  <p className="tele text-[10px] mt-0.5" style={{ color: '#D4923A' }}>
                    Clearance Level {mission.archivist.clearance} · {mission.archivist.sector}
                  </p>
                  <p className="tele text-[9px] text-white/25 mt-1">
                    Years Active: {mission.archivist.yearsActive} · Assigned Status: ACTIVE
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Display Name',  val: mission.archivist.name.split(' — ')[0] },
                  { label: 'Archivist ID',  val: 'ARC-007' },
                  { label: 'Primary Sector', val: mission.archivist.sector },
                  { label: 'Specialization', val: 'Paradox Seal Verification' },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <label className="tele text-[9px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(212,146,58,0.45)' }}>
                      {label}
                    </label>
                    <input
                      defaultValue={val}
                      className="w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors tele"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(212,146,58,0.08)',
                        color: 'rgba(255,240,210,0.85)',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'rgba(212,146,58,0.3)'
                        e.target.style.background = 'rgba(212,146,58,0.04)'
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(212,146,58,0.08)'
                        e.target.style.background = 'rgba(255,255,255,0.03)'
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'rgba(212,146,58,0.12)',
                  border: '1px solid rgba(212,146,58,0.25)',
                  color: '#D4923A',
                }}
              >
                <Save size={13} />
                <span className="display font-normal text-xs" style={{ letterSpacing: '0.04em' }}>Save Changes</span>
              </button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <h3 className="display text-base text-white font-normal">Notification Preferences</h3>
              <div>
                {TOGGLES.map((t) => <Toggle key={t.key} label={t.label} defaultOn={t.default} />)}
              </div>
            </div>
          )}

          {(activeSection === 'security' || activeSection === 'data' || activeSection === 'system') && (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <SettingsIcon size={24} style={{ color: 'rgba(212,146,58,0.15)' }} className="animate-spin-slow" />
              <p className="ui-text text-xs" style={{ color: 'rgba(255,240,210,0.35)' }}>
                {SECTIONS.find((s) => s.id === activeSection)?.label} modules online · Read Only Mode
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
