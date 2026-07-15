import { Settings as SettingsIcon, User, Shield, Bell, Database, Cpu, Save } from 'lucide-react'
import { useState } from 'react'

const SECTIONS = [
  { id: 'profile', label: 'Archivist Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data & Archive', icon: Database },
  { id: 'system', label: 'System', icon: Cpu },
]

const TOGGLES = [
  { label: 'Critical breach alerts', key: 'breach', default: true },
  { label: 'Paradox escalation warnings', key: 'paradox', default: true },
  { label: 'Daily integrity digest', key: 'digest', default: false },
  { label: 'Thread divergence notifications', key: 'diverge', default: true },
  { label: 'Fragment restore confirmations', key: 'restore', default: false },
]

function Toggle({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/60">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${on ? 'bg-thread/40' : 'bg-white/10'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`}
          style={{ background: on ? '#E8B96A' : 'rgba(255,255,255,0.4)' }}
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
        <SettingsIcon size={16} className="text-white/40" />
        <h2 className="display text-xl text-white font-normal">Archivist Configuration</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Section nav */}
        <div className="loom-card p-2 lg:col-span-1">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeSection === id ? 'bg-thread/10 text-thread' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="loom-card p-5 lg:col-span-3">
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <h3 className="display text-base text-white font-normal">Archivist Profile</h3>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/6">
                <div className="w-14 h-14 rounded-full border-2 border-thread/30 bg-thread/10 flex items-center justify-center">
                  <User size={24} className="text-thread/60" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Senior Reality Archivist</p>
                  <p className="tele text-[10px] text-thread mt-0.5">Clearance Level ΩΩΩ · Sector 7-Gamma</p>
                  <p className="tele text-[9px] text-white/25 mt-1">ID: ARC-007 · Assigned 847 days ago</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Display Name', val: 'Sr. Archivist' },
                  { label: 'Archivist ID', val: 'ARC-007' },
                  { label: 'Primary Sector', val: 'Sector 7-Gamma' },
                  { label: 'Specialization', val: 'Paradox Resolution' },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <label className="tele text-[9px] text-white/30 uppercase tracking-widest block mb-1">{label}</label>
                    <input
                      defaultValue={val}
                      className="w-full bg-white/4 border border-white/8 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-thread/30 transition-colors tele"
                    />
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-thread/10 border border-thread/20 text-sm text-thread hover:bg-thread/20 transition-colors">
                <Save size={13} /> Save Changes
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
              <SettingsIcon size={28} className="text-white/10" />
              <p className="text-sm text-white/25">
                {SECTIONS.find((s) => s.id === activeSection)?.label} configuration coming in Step 4.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
