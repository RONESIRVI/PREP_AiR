import React from "react";
import "./arch.css";

export default function ArchUI() {
  return (
    <div className="arch-body">
      {/* ═══ HERO / LOGO ═══ */}
      <div className="hero">
        <div className="logo-wrap">
          {/* SVG LOGO */}
          <svg className="logo-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="37" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
            <circle cx="40" cy="40" r="37" stroke="#22C55E" strokeWidth="2.5" strokeDasharray="175 57" strokeLinecap="round" transform="rotate(-90 40 40)" />
            <path d="M40 16 L57 23 L57 42 C57 52 40 63 40 63 C40 63 23 52 23 42 L23 23 Z" fill="#0D5C3A" stroke="#22C55E" strokeWidth="1.5" />
            <circle cx="40" cy="39" r="10" fill="rgba(255,255,255,.08)" stroke="#22C55E" strokeWidth="1.5" />
            <line x1="33" y1="32" x2="47" y2="46" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="40" cy="8" r="3" fill="#22C55E" />
          </svg>

          <div className="logo-text">
            <div className="prep">PREP_<span className="air">AiR</span></div>
            <div className="tagline">Focus · Block · Study</div>
          </div>
        </div>
        <p className="hero-sub">
          Personal Android study discipline app — Focus Timer, App Blocker, Daily Planner & Usage Analytics for serious students.
        </p>
        <div className="stats-row">
          <div className="stat-pill"><span>4</span> Main Tabs</div>
          <div className="stat-pill"><span>25+</span> Screens</div>
          <div className="stat-pill"><span>12</span> Permissions</div>
          <div className="stat-pill"><span>PRO</span> Tier</div>
        </div>
      </div>

      {/* ═══ ARCHITECTURE LAYERS ═══ */}
      <div className="section">
        <div className="section-label">System Design</div>
        <div className="section-title">App Architecture — Layered Overview</div>

        <div className="arch-layers">
          <div className="layer layer-ui">
            <div className="layer-icon">🖥️</div>
            <div className="layer-body">
              <h3>UI Layer — Jetpack Compose / XML Views</h3>
              <p>4 bottom-nav tabs + 25+ screens. Navigation handled via Jetpack Navigation Component.</p>
              <div className="layer-chips">
                <span className="chip">Focus Tab</span><span className="chip">Planner Tab</span>
                <span className="chip">Blocks Tab</span><span className="chip">Stats Tab</span>
                <span className="chip">Circular Ring Timer</span><span className="chip">Deep Focus Overlay</span>
                <span className="chip">Home Screen Widget (AppWidget)</span>
              </div>
            </div>
          </div>
          <div className="arrow-down">↓</div>

          <div className="layer layer-logic">
            <div className="layer-icon">⚙️</div>
            <div className="layer-body">
              <h3>Business Logic Layer — ViewModel + UseCases (MVVM)</h3>
              <p>Session management, Pomodoro engine, app-limit enforcement, streak calculation, PRO gating logic.</p>
              <div className="layer-chips">
                <span className="chip">FocusViewModel</span><span className="chip">PlannerViewModel</span>
                <span className="chip">BlockViewModel</span><span className="chip">StatsViewModel</span>
                <span className="chip">PRO Manager</span><span className="chip">Streak Engine</span>
              </div>
            </div>
          </div>
          <div className="arrow-down">↓</div>

          <div className="layer layer-data">
            <div className="layer-icon">🗄️</div>
            <div className="layer-body">
              <h3>Data Layer — Room / SQLite + SharedPreferences</h3>
              <p>Local-first storage. focus_sessions, app_limits, tags, schedules. No cloud dependency for core features.</p>
              <div className="layer-chips">
                <span className="chip">FocusSessionDao</span><span className="chip">AppLimitDao</span>
                <span className="chip">TagDao</span><span className="chip">ScheduleDao</span>
                <span className="chip">SharedPrefs (settings)</span>
              </div>
            </div>
          </div>
          <div className="arrow-down">↓</div>

          <div className="layer layer-system">
            <div className="layer-icon">🔒</div>
            <div className="layer-body">
              <h3>Android System Services — Blocking Engine</h3>
              <p>Deep OS integration for app blocking, website filtering, and uninstall protection. Requires special permissions.</p>
              <div className="layer-chips">
                <span className="chip">AccessibilityService</span><span className="chip">UsageStatsManager</span>
                <span className="chip">VpnService (WebBlock)</span><span className="chip">DevicePolicyManager</span>
                <span className="chip">ForegroundService (Timer)</span><span className="chip">NotificationManager</span>
                <span className="chip">AppWidgetProvider</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* ═══ SCREEN NAV MAP ═══ */}
      <div className="section">
        <div className="section-label">Navigation</div>
        <div className="section-title">4 Main Tabs — Screen Map</div>

        <div className="tabs-grid">
          <div className="tab-card tab-focus">
            <div className="tab-icon">🎯</div>
            <h4>Focus Tab</h4>
            <ul>
              <li>Circular ring timer</li>
              <li>Timer / Stopwatch / Pomodoro</li>
              <li>Screen time bar</li>
              <li>Upcoming schedule card</li>
              <li>Start Focus button</li>
              <li>Break duration picker</li>
              <li>Session duration picker</li>
              <li>Deep Focus overlay</li>
            </ul>
          </div>

          <div className="tab-card tab-plan">
            <div className="tab-icon">📅</div>
            <h4>Planner Tab</h4>
            <ul>
              <li>Weekly calendar strip</li>
              <li>Today's sessions list</li>
              <li>Add Schedule form</li>
              <li>Edit Schedule form</li>
              <li>Time range picker</li>
              <li>Tag selector</li>
              <li>App block picker</li>
            </ul>
          </div>

          <div className="tab-card tab-block">
            <div className="tab-icon">🚫</div>
            <h4>Blocks Tab</h4>
            <ul>
              <li>App Limits list</li>
              <li>Add app limit</li>
              <li>Block Shorts / Reels</li>
              <li>Block Websites</li>
              <li>Strict Mode settings</li>
              <li>Block split screen</li>
              <li>Uninstall protection</li>
            </ul>
          </div>

          <div className="tab-card tab-stats">
            <div className="tab-icon">📊</div>
            <h4>Stats Tab</h4>
            <ul>
              <li>Daily goal ring</li>
              <li>Weekly streak dots</li>
              <li>Today's summary timeline</li>
              <li>Tags breakdown</li>
              <li>Sessions log</li>
              <li>Per-app time chart</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* ═══ FEATURES ═══ */}
      <div className="section">
        <div className="section-label">Feature Set</div>
        <div className="section-title">Core & PRO Features</div>

        <div className="features-grid">
          <div className="feat-card">
            <div className="feat-icon">⏱️</div>
            <h4>Focus Timer</h4>
            <p>Timer, Stopwatch, and Pomodoro modes. Foreground service keeps timer alive while phone screen is off.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">📊</div>
            <h4>Usage Stats</h4>
            <p>Daily & weekly bar charts. Apps auto-categorized as Distracting / Productive / Others.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">🚫</div>
            <h4>Block Shorts & Reels <span className="pro-badge">PRO</span></h4>
            <p>Block Facebook Reels, YouTube Shorts, Instagram Reels, Snapchat Spotlight. First-reel-then-block option.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">🌐</div>
            <h4>Website Blocker <span className="pro-badge">PRO</span></h4>
            <p>Block specific sites in Chrome & other browsers via VPN. Adult content block. Custom block list.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">🛡️</div>
            <h4>Uninstall Protection <span className="pro-badge">PRO</span></h4>
            <p>Cannot uninstall or log out while Strict Mode is active. Prevents bypassing study discipline.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">🏠</div>
            <h4>Home Screen Widget</h4>
            <p>Small widget showing today's focus time + Start Focus button. Android AppWidget support.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">🔥</div>
            <h4>Progress & Streaks</h4>
            <p>Daily goal ring. Weekly streak dots (S M T W T F S). Tags breakdown. Sessions log.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">🔔</div>
            <h4>Notifications & Alarms</h4>
            <p>Block notifications from distracting apps during focus. Schedule reminders for study sessions.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon">🎵</div>
            <h4>Focus Music Player</h4>
            <p>Built-in lo-fi / ambient music for deep work sessions. Plays alongside the focus timer.</p>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* ═══ DB SCHEMA ═══ */}
      <div className="section">
        <div className="section-label">Database</div>
        <div className="section-title">Room / SQLite Schema</div>

        <div className="db-grid">
          {/* focus_sessions */}
          <div className="db-table">
            <div className="db-head">🎯 focus_sessions</div>
            <div className="db-row"><span className="db-col">id</span><span className="db-type">INT PK</span><span className="db-desc">Auto-increment</span></div>
            <div className="db-row"><span className="db-col">start_time</span><span className="db-type">LONG</span><span className="db-desc">Unix ms</span></div>
            <div className="db-row"><span className="db-col">end_time</span><span className="db-type">LONG</span><span className="db-desc">Unix ms</span></div>
            <div className="db-row"><span className="db-col">duration_min</span><span className="db-type">INT</span><span className="db-desc">Total minutes</span></div>
            <div className="db-row"><span className="db-col">mode</span><span className="db-type">TEXT</span><span className="db-desc">TIMER/POMODORO</span></div>
            <div className="db-row"><span className="db-col">tag_id</span><span className="db-type">INT FK</span><span className="db-desc">→ tags.id</span></div>
            <div className="db-row"><span className="db-col">completed</span><span className="db-type">BOOL</span><span className="db-desc">Goal reached?</span></div>
          </div>

          {/* app_limits */}
          <div className="db-table">
            <div className="db-head">🚫 app_limits</div>
            <div className="db-row"><span className="db-col">id</span><span className="db-type">INT PK</span><span className="db-desc">Auto-increment</span></div>
            <div className="db-row"><span className="db-col">package_name</span><span className="db-type">TEXT</span><span className="db-desc">com.facebook…</span></div>
            <div className="db-row"><span className="db-col">app_name</span><span className="db-type">TEXT</span><span className="db-desc">"Facebook"</span></div>
            <div className="db-row"><span className="db-col">daily_limit_min</span><span className="db-type">INT</span><span className="db-desc">Limit in minutes</span></div>
            <div className="db-row"><span className="db-col">strict_until</span><span className="db-type">LONG</span><span className="db-desc">Strict end time</span></div>
            <div className="db-row"><span className="db-col">is_blocked_shorts</span><span className="db-type">BOOL</span><span className="db-desc">Block reels</span></div>
          </div>

          {/* tags */}
          <div className="db-table">
            <div className="db-head">🏷️ tags</div>
            <div className="db-row"><span className="db-col">id</span><span className="db-type">INT PK</span><span className="db-desc">Auto-increment</span></div>
            <div className="db-row"><span className="db-col">name</span><span className="db-type">TEXT</span><span className="db-desc">"Physics", "Maths"</span></div>
            <div className="db-row"><span className="db-col">color_hex</span><span className="db-type">TEXT</span><span className="db-desc">#22C55E</span></div>
            <div className="db-row"><span className="db-col">goal_min</span><span className="db-type">INT</span><span className="db-desc">Daily target min</span></div>
            <div className="db-row"><span className="db-col">icon</span><span className="db-type">TEXT</span><span className="db-desc">Emoji / drawable</span></div>
            <br />
            <div className="db-head" style={{ background: "#1a7a4a" }}>📅 schedules</div>
            <div className="db-row"><span className="db-col">id</span><span className="db-type">INT PK</span><span className="db-desc">Auto-increment</span></div>
            <div className="db-row"><span className="db-col">tag_id</span><span className="db-type">INT FK</span><span className="db-desc">→ tags.id</span></div>
            <div className="db-row"><span className="db-col">start_epoch</span><span className="db-type">LONG</span><span className="db-desc">Start timestamp</span></div>
            <div className="db-row"><span className="db-col">end_epoch</span><span className="db-type">LONG</span><span className="db-desc">End timestamp</span></div>
            <div className="db-row"><span className="db-col">block_apps</span><span className="db-type">TEXT</span><span className="db-desc">JSON pkg list</span></div>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <div className="footer">
        <strong>PREP_AiR</strong> · Android Focus & Study Discipline App · Architecture v1.0 · Sept 2026
      </div>
    </div>
  );
}
