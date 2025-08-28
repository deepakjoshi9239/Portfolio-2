import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../Portfolio.css';

const CORE_SKILLS = [
  { name: 'HTML', level: 90, color: '#e34f26' },
  { name: 'CSS', level: 85, color: '#1572B6' },
  { name: 'JavaScript', level: 88, color: '#f7df1e', text: '#000' },
  { name: 'React', level: 82, color: '#61dafb', text: '#000' },
  { name: 'Node.js', level: 70, color: '#68a063' },
  { name: 'Git', level: 78, color: '#f34f29' },
];

const TOOLS_SKILLS = [
  { name: 'GitHub', level: 80, color: '#6b7280' },
  { name: 'Vite', level: 75, color: '#646cff' },
  { name: 'VS Code', level: 85, color: '#0ea5e9' },
  { name: 'Figma', level: 65, color: '#a259ff' },
  { name: 'Postman', level: 70, color: '#ef5b25' },
  { name: 'NPM', level: 78, color: '#cb0000' },
];

const LEARNING_SKILLS = [
  { name: 'TypeScript', level: 55, color: '#3178c6' },
  { name: 'Next.js', level: 45, color: '#0ea5e9' },
  { name: 'Express', level: 50, color: '#22c55e' },
  { name: 'MongoDB', level: 40, color: '#10b981' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const Skills = () => {
  const [tab, setTab] = useState('Core');
  const dataByTab = {
    Core: CORE_SKILLS,
    Tools: TOOLS_SKILLS,
    Learning: LEARNING_SKILLS,
  };

  const TABS = Object.keys(dataByTab);

  const proficiency = (lvl) => {
    if (lvl >= 80) return { label: 'Advanced', cls: 'badge-advanced' };
    if (lvl >= 60) return { label: 'Intermediate', cls: 'badge-intermediate' };
    if (lvl >= 40) return { label: 'Beginner', cls: 'badge-beginner' };
    return { label: 'Learning', cls: 'badge-learning' };
  };

  return (
    <section id="skills" className="section">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4 }}
      >
        Skills
      </motion.h2>

      <div className="skills-toolbar">
        <div>{dataByTab[tab].length} items</div>
        <div className="about-tabs" role="tablist" aria-label="Skills tabs" style={{ marginBottom: 0 }}>
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
            {tab === t && <motion.span layoutId="tab-ink-skills" className="tab-ink" />}
          </button>
        ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          className="skills-grid"
          variants={containerVariants}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {dataByTab[tab].map((s) => (
            <motion.div
              key={s.name}
              className="skill-card"
              variants={cardVariants}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="skill-header">
                <span className="skill-name">
                  <span className="skill-dot" style={{ background: s.color }} />
                  {s.name}
                  <span className={`skill-badge ${proficiency(s.level).cls}`}>{proficiency(s.level).label}</span>
                </span>
                <span className="skill-level">{s.level}%</span>
              </div>
              <div className="skill-bar">
                <motion.span
                  className="skill-progress"
                  style={{ background: s.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Skills;
