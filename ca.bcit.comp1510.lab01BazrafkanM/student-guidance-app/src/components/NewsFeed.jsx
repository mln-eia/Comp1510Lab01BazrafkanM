import { formatDistanceToNow } from '../utils/date.js';

export default function NewsFeed({ news }) {
  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <h2>Career News</h2>
          <p className="description">Stay up to date with opportunities, scholarships, and insights curated for students.</p>
        </div>
      </div>
      <ul className="news-list">
        {news.map((item) => {
          const publishedDate = item.publishedAt?.toDate?.() ?? (item.publishedAt ? new Date(item.publishedAt) : null);
          return (
            <li key={item.id} className="news-item">
              <a href={item.link} target="_blank" rel="noreferrer">
                <h3>{item.title}</h3>
              </a>
              <p>{item.summary}</p>
              <div className="meta">
                <span>{item.source}</span>
                {publishedDate ? <span>{formatDistanceToNow(publishedDate)}</span> : null}
              </div>
            </li>
          );
        })}
        {!news.length ? <li className="empty">Add articles to the news collection to see them here.</li> : null}
      </ul>
    </section>
  );
}
