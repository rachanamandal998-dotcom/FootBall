import { useData } from '../context/DataContext.jsx'
import NewsCard from '../components/NewsCard.jsx'

export default function News(){
  const { DB } = useData()
  const list = DB.news.filter(n=>n.status==='Published').sort((a,b)=>b.date.localeCompare(a.date))
  return (
    <section className="py-14"><div className="max-w- mx-auto px-6">
      <div className="mb-6"><h2 className="font-barlow text-">News</h2><p className="text-sm text-[#2A3532]">Stories from across the district</p></div>
      <div className="grid md:grid-cols-3 gap-">{list.map(n=><NewsCard key={n.id} n={n} />)}</div>
    </div></section>
  )
}