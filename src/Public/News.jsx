import { useData } from '../context/DataContext.jsx'
import NewsCard from '../components/NewsCard.jsx'
export default function News(){
  const { DB, go } = useData()
  const list = DB.news.filter(n=>n.status==='Published').sort((a,b)=>b.date.localeCompare(a.date))
  return <section className="section"><div className="wrap"><div className="section-head"><div><h2>News</h2><div className="sub">Stories from across the district</div></div></div><div className="grid cols-3">{list.map(n=><NewsCard key={n.id} n={n} onNavigate={go} />)}</div></div></section>
}