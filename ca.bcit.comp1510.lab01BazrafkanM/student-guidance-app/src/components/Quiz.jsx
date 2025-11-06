import { useMemo, useState } from 'react';

const QUESTIONS = [
  {
    id: 'q1',
    text: 'When solving a new problem, what excites you the most?',
    options: [
      { value: 'investigative', label: 'Digging into the research and understanding why things work.' },
      { value: 'artistic', label: 'Brainstorming creative approaches and designs.' },
      { value: 'social', label: 'Collaborating with others to see how it impacts people.' }
    ]
  },
  {
    id: 'q2',
    text: 'What type of school project do you enjoy?',
    options: [
      { value: 'realistic', label: 'Building or prototyping something tangible.' },
      { value: 'enterprising', label: 'Pitching ideas and leading a team.' },
      { value: 'conventional', label: 'Organizing info, making timelines, keeping everything on track.' }
    ]
  },
  {
    id: 'q3',
    text: 'Pick the Saturday activity you would most likely choose.',
    options: [
      { value: 'social', label: 'Volunteering with a community organization.' },
      { value: 'investigative', label: 'Visiting a science centre or tech meetup.' },
      { value: 'artistic', label: 'Working on a creative hobby or portfolio.' }
    ]
  }
];

const CAREER_THEMES = {
  realistic: {
    name: 'Hands-on Builder',
    summary: 'You thrive when you can see immediate, practical results. Applied technology, engineering, or trades-based programs may be a fit.'
  },
  investigative: {
    name: 'Curious Analyst',
    summary: 'You enjoy research, digging into data, and figuring out complex puzzles. STEM and research-driven pathways will keep you energized.'
  },
  artistic: {
    name: 'Creative Storyteller',
    summary: 'You are drawn to design, content, and expression. Consider visual design, marketing, or digital media programs.'
  },
  social: {
    name: 'Community Guide',
    summary: 'Supporting people is your strength. Education, counselling, or human services could be strong matches.'
  },
  enterprising: {
    name: 'Visionary Leader',
    summary: 'You enjoy leading teams and taking initiative. Business, entrepreneurship, and management programs align well.'
  },
  conventional: {
    name: 'Systems Organizer',
    summary: 'You keep projects running smoothly. Roles in operations, administration, or finance will value your skills.'
  }
};

export default function Quiz({ onComplete, latestRecommendation }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const progress = useMemo(() => Math.round((Object.keys(answers).length / QUESTIONS.length) * 100), [answers]);

  const hasCompleted = useMemo(() => Object.keys(answers).length === QUESTIONS.length, [answers]);

  const dominantTheme = useMemo(() => {
    const tally = Object.values(answers).reduce((acc, value) => {
      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    }, {});

    const [topTheme] = Object.entries(tally)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([theme]) => theme);

    return topTheme ?? null;
  }, [answers]);

  const primaryTheme = useMemo(() => {
    if (!dominantTheme) {
      return null;
    }
    return {
      key: dominantTheme,
      ...CAREER_THEMES[dominantTheme]
    };
  }, [dominantTheme]);

  const recommendations = useMemo(() => {
    if (!dominantTheme) {
      return [];
    }
    const primary = CAREER_THEMES[dominantTheme];
    const secondary = Object.entries(CAREER_THEMES)
      .filter(([theme]) => theme !== dominantTheme)
      .slice(0, 2)
      .map(([, info]) => info.name);

    return [
      `${primary.name} — ${primary.summary}`,
      ...secondary.map((themeName) => `Consider also: ${themeName}`)
    ];
  }, [dominantTheme]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!dominantTheme) {
      return;
    }
    try {
      setSubmitting(true);
      await onComplete({
        dominantTheme: CAREER_THEMES[dominantTheme].name,
        dominantThemeKey: dominantTheme,
        recommendations
      });
      setAnswers({});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <h2>Career Compass Quiz</h2>
          <p className="description">Answer a few quick prompts to tailor your guidance and save it to your dashboard.</p>
        </div>
        <span>{progress}% complete</span>
      </div>
      <form className="quiz" onSubmit={handleSubmit}>
        {QUESTIONS.map((question) => (
          <fieldset key={question.id}>
            <legend>{question.text}</legend>
            <div className="options">
              {question.options.map((option) => (
                <label key={option.value} className={answers[question.id] === option.value ? 'selected' : ''}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={(event) => handleChange(question.id, event.target.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <div className="quiz-actions">
          <button type="submit" className="primary" disabled={!hasCompleted || submitting}>
            {submitting ? 'Saving...' : 'Save my recommendations'}
          </button>
          {latestRecommendation ? (
            <p className="last-result">Latest: {latestRecommendation.dominantTheme}</p>
          ) : null}
        </div>
        {hasCompleted && primaryTheme ? (
          <aside className="quiz-insight">
            <h3>{primaryTheme.name}</h3>
            <p>{primaryTheme.summary}</p>
            <ul>
              {recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </aside>
        ) : null}
      </form>
    </section>
  );
}
