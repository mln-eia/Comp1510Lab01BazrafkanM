import { useMemo, useState } from 'react';

const FIELD_OPTIONS = ['Technology', 'Business', 'Health', 'Creative Arts', 'Education', 'Trades'];
const REGION_OPTIONS = ['Canada', 'United States', 'Europe', 'Remote', 'Asia-Pacific'];

export default function ProgramsList({ programs }) {
  const [fieldFilter, setFieldFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesField = fieldFilter === 'All' || program.field === fieldFilter;
      const matchesRegion = regionFilter === 'All' || program.region === regionFilter;
      return matchesField && matchesRegion;
    });
  }, [programs, fieldFilter, regionFilter]);

  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <h2>Program Explorer</h2>
          <p className="description">Browse programs curated for you and updated live from your advisors.</p>
        </div>
        <span>{filteredPrograms.length} programs</span>
      </div>
      <div className="filters">
        <label>
          Field
          <select value={fieldFilter} onChange={(event) => setFieldFilter(event.target.value)}>
            <option value="All">All fields</option>
            {FIELD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Region
          <select value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)}>
            <option value="All">All regions</option>
            {REGION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ul className="programs">
        {filteredPrograms.map((program) => (
          <li key={program.id} className="program">
            <div className="program-header">
              <div>
                <h3>{program.name}</h3>
                <p className="meta">{program.provider ?? 'Independent study'}</p>
              </div>
              <ul className="tag-list">
                <li className="tag">{program.field ?? 'General'}</li>
                <li className="tag">{program.region ?? 'Global'}</li>
              </ul>
            </div>
            <p>{program.summary ?? 'Details coming soon from your advisor.'}</p>
            {program.link ? (
              <a className="ghost" href={program.link} target="_blank" rel="noreferrer">
                View details
              </a>
            ) : null}
          </li>
        ))}
        {!filteredPrograms.length ? <li className="empty">No programs match your filters yet.</li> : null}
      </ul>
    </section>
  );
}
