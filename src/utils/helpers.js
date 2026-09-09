export const STORAGE_KEY = 'sindhuli_fc_data_v2'
export const ADMIN_PASS = 'admin123'

export const uid = () => Math.random().toString(36).slice(2,9)

export const nextId = (prefix = "") => `${prefix}${Date.now()}`

export const colorFor = (str='?') => {
  let hash=0; for(let i=0;i<str.length;i++) hash=str.charCodeAt(i)+((hash<<5)-hash)
  const colors=['#0E3B2E','#134A38','#1E7245','#C7A344','#A6372B','#2A5D8A','#5B3E31']
  return colors[Math.abs(hash)%colors.length]
}

export const initials = (name='?') => {
  return name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase()
}

export const fmtDate = (iso='') => {
  if(!iso) return '—'
  try{ return new Date(iso).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) }catch{ return iso }
}

export const ageFromDOB = (iso='') => {
  if(!iso) return '—'
  const dob=new Date(iso), now=new Date()
  let age=now.getFullYear()-dob.getFullYear()
  const m=now.getMonth()-dob.getMonth()
  if(m<0 || (m===0 && now.getDate()<dob.getDate())) age--
  return age
}