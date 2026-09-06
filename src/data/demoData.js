export function demoData(){
  const teams = [
    { id:'t1', name:'Sindhuli FC', shortName:'SFC', location:'Sindhulibazar', stadium:'Sindhuli Stadium', coach:'Bikash Thapa', founded:2012 },
    { id:'t2', name:'Kamalamai United', shortName:'KMU', location:'Kamalamai', stadium:'Kamalamai Ground', coach:'Raju Karki', founded:2015 },
    { id:'t3', name:'Dudhauli Warriors', shortName:'DWA', location:'Dudhauli', stadium:'Dudhauli Arena', coach:'Suman Lama', founded:2016 },
    { id:'t4', name:'Marin FC', shortName:'MFC', location:'Marin', stadium:'Marin Field', coach:'Anil Bista', founded:2014 },
    { id:'t5', name:'Sunkoshi FC', shortName:'SKC', location:'Sunkoshi', stadium:'Sunkoshi Park', coach:'Prakash Rai', founded:2018 },
    { id:'t6', name:'Hariharpurgadhi FC', shortName:'HFC', location:'Hariharpur', stadium:'Gadhi Ground', coach:'Dipak Dahal', founded:2017 },
  ]

  const players = [
    { id:'p1', firstName:'Aarav', lastName:'Shrestha', displayName:'Aarav Shrestha', dob:'2001-04-12', nationality:'Nepal', height:178, weight:72, position:'Forward', teamId:'t1', jersey:9, status:'Fit', contractEnd:'2026-06-30' },
    { id:'p2', firstName:'Bishal', lastName:'Rai', displayName:'Bishal Rai', dob:'1999-11-03', nationality:'Nepal', height:182, weight:78, position:'Defender', teamId:'t1', jersey:4, status:'Fit', contractEnd:'2026-06-30' },
    { id:'p3', firstName:'Sujan', lastName:'Magar', displayName:'Sujan Magar', dob:'2002-07-19', nationality:'Nepal', height:175, weight:70, position:'Midfielder', teamId:'t1', jersey:8, status:'Fit', contractEnd:'2025-12-31' },
    { id:'p4', firstName:'Niraj', lastName:'Karki', displayName:'Niraj Karki', dob:'2000-01-25', nationality:'Nepal', height:185, weight:80, position:'Goalkeeper', teamId:'t1', jersey:1, status:'Fit', contractEnd:'2026-06-30' },
    { id:'p5', firstName:'Rohan', lastName:'Thapa', displayName:'Rohan Thapa', dob:'2001-09-14', nationality:'Nepal', height:180, weight:75, position:'Forward', teamId:'t2', jersey:10, status:'Fit', contractEnd:'2026-06-30' },
    { id:'p6', firstName:'Sanjay', lastName:'Lama', displayName:'Sanjay Lama', dob:'1998-03-08', nationality:'Nepal', height:179, weight:74, position:'Midfielder', teamId:'t2', jersey:7, status:'Fit', contractEnd:'2025-12-31' },
    { id:'p7', firstName:'Kiran', lastName:'Bista', displayName:'Kiran Bista', dob:'2003-05-22', nationality:'Nepal', height:176, weight:71, position:'Forward', teamId:'t3', jersey:11, status:'Fit', contractEnd:'2026-06-30' },
    { id:'p8', firstName:'Deepak', lastName:'Gurung', displayName:'Deepak Gurung', dob:'1997-12-11', nationality:'Nepal', height:184, weight:82, position:'Defender', teamId:'t4', jersey:5, status:'Injured', contractEnd:'2026-06-30' },
    { id:'p9', firstName:'Manoj', lastName:'Dahal', displayName:'Manoj Dahal', dob:'2002-02-18', nationality:'Nepal', height:177, weight:73, position:'Midfielder', teamId:'t5', jersey:6, status:'Fit', contractEnd:'2026-06-30' },
    { id:'p10', firstName:'Umesh', lastName:'Yadav', displayName:'Umesh Yadav', dob:'1999-08-30', nationality:'Nepal', height:183, weight:79, position:'Goalkeeper', teamId:'t6', jersey:1, status:'Fit', contractEnd:'2026-06-30' },
  ]

  const competitions = [
    { id:'c1', name:'Sindhuli District League', season:'2024/25', teamIds: teams.map(t=>t.id), pointsWin:3, pointsDraw:1, pointsLoss:0, description:'Top tier district league featuring 6 clubs from Sindhuli.' }
  ]

  const matches = [
    { id:'m1', compId:'c1', season:'2024/25', homeTeamId:'t1', awayTeamId:'t2', date:'2025-03-10', time:'15:00', stadium:'Sindhuli Stadium', status:'Finished', homeScore:2, awayScore:1, referee:'Ramesh KC', events:[{id:'e1', minute:23, type:'goal', scorerId:'p1', assistId:'p3'}, {id:'e2', minute:67, type:'goal', scorerId:'p5'}, {id:'e3', minute:81, type:'goal', scorerId:'p1'}], lineups:{ home:{formation:'4-3-3', startingXI:['p4','p2','p1','p3']}, away:{formation:'4-4-2', startingXI:['p5','p6']} }, stats:{possessionHome:54, possessionAway:46, shotsHome:14, shotsAway:9, shotsOnTargetHome:6, shotsOnTargetAway:4, cornersHome:5, cornersAway:3, foulsHome:12, foulsAway:14} },
    { id:'m2', compId:'c1', season:'2024/25', homeTeamId:'t3', awayTeamId:'t4', date:'2025-03-12', time:'15:00', stadium:'Dudhauli Arena', status:'Finished', homeScore:0, awayScore:0, referee:'Suresh Lama', events:[], lineups:{ home:null, away:null }, stats:{possessionHome:50, possessionAway:50, shotsHome:8, shotsAway:8, shotsOnTargetHome:2, shotsOnTargetAway:3, cornersHome:4, cornersAway:4, foulsHome:10, foulsAway:11} },
    { id:'m3', compId:'c1', season:'2024/25', homeTeamId:'t1', awayTeamId:'t3', date:'2025-12-15', time:'14:00', stadium:'Sindhuli Stadium', status:'Scheduled', homeScore:0, awayScore:0, referee:'TBD', events:[], lineups:{ home:null, away:null }, stats:{possessionHome:0, possessionAway:0, shotsHome:0, shotsAway:0, shotsOnTargetHome:0, shotsOnTargetAway:0, cornersHome:0, cornersAway:0, foulsHome:0, foulsAway:0} },
    { id:'m4', compId:'c1', season:'2024/25', homeTeamId:'t2', awayTeamId:'t5', date:'2025-12-18', time:'14:30', stadium:'Kamalamai Ground', status:'Scheduled', homeScore:0, awayScore:0, referee:'TBD', events:[], lineups:{ home:null, away:null }, stats:{possessionHome:0, possessionAway:0, shotsHome:0, shotsAway:0, shotsOnTargetHome:0, shotsOnTargetAway:0, cornersHome:0, cornersAway:0, foulsHome:0, foulsAway:0} },
  ]

  const news = [
    { id:'n1', title:'Sindhuli FC clinches top spot after thrilling win', category:'Match Report', content:'Sindhuli FC secured a crucial 2-1 victory over Kamalamai United with Aarav Shrestha scoring a brace. The atmosphere at Sindhuli Stadium was electric...', date:'2025-03-11', author:'Sports Desk', status:'Published' },
    { id:'n2', title:'New talents emerge in district league', category:'Feature', content:'Young players from Marin and Sunkoshi are showing great promise this season with standout performances...', date:'2025-03-09', author:'Anita Rai', status:'Published' },
    { id:'n3', title:'Dudhauli Warriors hold Marin FC to draw', category:'Match Report', content:'A defensive masterclass from both sides ended in a goalless draw at Dudhauli Arena...', date:'2025-03-13', author:'Sports Desk', status:'Published' },
  ]

  const injuries = [
    { id:'inj1', playerId:'p8', type:'Ankle Sprain', date:'2025-03-01', expectedReturn:'2025-04-01', status:'Recovering' }
  ]

  return { teams, players, matches, competitions, news, injuries, staff:[], training:[], transfers:[], contracts:[], meta:{lastUpdated: Date.now()} }
}