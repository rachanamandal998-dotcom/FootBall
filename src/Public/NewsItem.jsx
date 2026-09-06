import { useData } from '../context/DataContext.jsx'
import { fmtDate } from '../utils/helpers.js'
export default function NewsItem() {
    const { DB, route, go } = useData()
    const n = DB.news.find(x => x.id === route.id)
    if (!n) return null
    return (
        <section className="section"><div className="wrap" style={{ maxWidth: 760 }}>
            <a href="#" className="section-link" onClick={e => { e.preventDefault(); go('news') }}>← Back to News</a>
            <div className="news-cat" style={{ marginTop: 16 }}>{n.category.toUpperCase()}</div>
            <h1 style={{ fontSize: 36, margin: '8px 0' }}>{n.title}</h1>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20 }}>{fmtDate(n.date)} · {n.author}</div>
            <div className="news-img" style={{ height: 220, marginBottom: 20 }}>{n.category.toUpperCase()}</div>
            <p style={{ fontSize: 15.5, lineHeight: 1.7 }}>{n.content}</p>
        </div></section>
    )
}