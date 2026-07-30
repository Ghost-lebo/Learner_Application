import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const API_URL = import.meta.env.VITE_API_URL;
const SCHOOL_LOCATION = [-26.5039, 28.3594] // Heidelberg, Gauteng
const COLORS = { navy: '#0A1F6D', red: '#E30613', bg: 'linear-gradient(135deg, #0A1F6D15, #E3061315)' }

function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if(coords) map.setView(coords, 14);
  }, [coords, map])
  return null
}

const galleryImages = [
  '/gallery/Heidelberg.jpeg',
  '/gallery/Heidelberg-Academy.png',
  '/gallery/sports.jpg',
  '/gallery/classroom.jpg'
]

export default function App() {
  const [spaces, setSpaces] = useState({});
  const [activeTab, setActiveTab] = useState('home');
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [grade, setGrade] = useState('1');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [distanceMsg, setDistanceMsg] = useState('');
  const [files, setFiles] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    setSpaces({
      '1': 13, '2': 7, '3': 4, '4': 0, '5': 1, '6': 3,
      '7': 0, '8': 20, '9': 5, '10': 0, '11': 0, '12': 0
    })
  }, []);

  const gradeNum = parseInt(grade);
  const isFull = spaces[grade] <= 0;

  // Geocode address when user types
  const handleAddressChange = async (val) => {
    setAddress(val);
    if(val.length < 5) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val + ', Gauteng, South Africa')}`);
      const data = await res.json();
      if(data[0]){
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoords([lat, lon]);

        // Check distance to school
        const R = 6371; // km
        const dLat = (lat - SCHOOL_LOCATION[0]) * Math.PI / 180;
        const dLon = (lon - SCHOOL_LOCATION[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(SCHOOL_LOCATION[0]*Math.PI/180) * Math.cos(lat*Math.PI/180) * Math.sin(dLon/2)**2;
        const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        setDistanceMsg(dist <= 10? `✅ Within 10km - ${dist.toFixed(2)}km` : `❌ Outside 10km - ${dist.toFixed(2)}km`);
      }
    } catch(e) { console.log(e) }
  }

  // Required docs logic
  const learnerDocs = [
    { key: 'birth_certificate', label: 'Copy of Birth Certificate' },
    { key: 'report_card', label: 'Report Card - Current Grade' },
  ...(gradeNum >= 1 && gradeNum <= 8? [{ key: 'clinic_card', label: 'Clinic Card G1-G8' }] : [])
  ]
  const parentDocs = [
    { key: 'parent_id', label: 'Parent ID Copy' },
    { key: 'proof_address', label: 'Proof of Address / Work Address' },
    { key: 'proof_employment', label: 'Proof of Employment' },
  ...(gradeNum >= 9 && gradeNum <= 12? [{ key: 'medical_aid', label: 'Medical Aid Card G9-G12' }] : [])
  ]
  const allRequired = [...learnerDocs,...parentDocs]
  const canSubmit = childName && parentName && address && coords && distanceMsg.includes('✅') &&!isFull && allRequired.every(f => files[f.key])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!canSubmit) return alert("Please fill all fields, upload all documents, and ensure address is within 10km");
    const formData = new FormData();
    formData.append('child_name', childName);
    formData.append('parent_name', parentName);
    formData.append('grade', grade);
    formData.append('address', address);
    formData.append('coords', JSON.stringify(coords));
    Object.keys(files).forEach(k => formData.append(k, files[k]));
    const res = await fetch(`${API_URL}/apply`, { method: 'POST', body: formData });
    setMessage((await res.json()).message);
  }

  const TabButton = ({id, label}) => (
    <button onClick={() => setActiveTab(id)}
      style={{padding: '15px 25px', background: activeTab === id? COLORS.red : COLORS.navy,
      color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1em'}}>
      {label}
    </button>
  )

  const HomeButton = () => (
    <button onClick={() => setActiveTab('home')} style={{
      position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
      background: COLORS.red, color: 'white', border: '2px solid white',
      borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer'
    }}>🏠</button>
  )

  const PageWrapper = ({children}) => (
    <div style={{background: COLORS.bg, minHeight: '100vh', paddingBottom: '40px'}}>{children}</div>
  )

  return (
    <div style={{fontFamily: 'Arial, sans-serif'}}>
      {activeTab!== 'home' && <HomeButton />}

      {activeTab === 'home' && (
        <div style={{background: `linear-gradient(rgba(10,31,109,0.75), rgba(227,6,19,0.65)), url(/gallery/Heidelberg.jpeg)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', color: 'white', padding: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px', position: 'absolute', top: '20px', left: '30px'}}>
            <img src="/gallery/logo.png" alt="Heidelberg Logo" style={{width: '250px'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '90vh'}}>
            <h1 style={{fontSize: '4.5em', margin: 0, textShadow: '4px 4px 8px #000'}}>Heidelberg Academy</h1>
            <p style={{fontSize: '2em', fontWeight: 'bold', textShadow: '3px 3px 6px #000'}}>"A FAMILY OF LEARNING"</p>
            <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '40px'}}>
              <TabButton id="about" label="About Us" />
              <TabButton id="gallery" label="Gallery" />
              <TabButton id="activities" label="Activities" />
              <TabButton id="apply" label="Apply Now" />
            </div>
          </div>
        </div>
      )}

      {activeTab!== 'home' && (
        <PageWrapper>
          <header style={{background: COLORS.navy, color: 'white', padding: '20px 30px', display: 'flex', alignItems: 'center', gap: '25px'}}>
            <img src="/gallery/logo.png" alt="Heidelberg Logo" style={{height: '100px'}} />
            <h1 style={{margin: 0, fontSize: '2.2em'}}>Heidelberg Academy</h1>
          </header>

          <div style={{maxWidth: '1100px', margin: 'auto', padding: '20px'}}>
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px'}}>
              <TabButton id="about" label="About Us" />
              <TabButton id="gallery" label="Gallery" />
              <TabButton id="activities" label="Activities" />
              <TabButton id="apply" label="Application Form" />
            </div>

            <div style={{background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'}}>

              {activeTab === 'about' && (
                <div>
                  <h2 style={{color: COLORS.navy, borderBottom: `4px solid ${COLORS.red}`, paddingBottom: '10px'}}>About Heidelberg Academy</h2>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
                    <div><h3 style={{color: COLORS.red}}>Vision</h3><p>To be a center of academic excellence that nurtures responsible, innovative and compassionate leaders for our community.</p></div>
                    <div><h3 style={{color: COLORS.red}}>Mission</h3><p>To provide quality education through dedicated educators, modern facilities and values-based learning in a safe environment.</p></div>
                    <div><h3 style={{color: COLORS.red}}>Objectives</h3>
                      <ul><li>Academic excellence in Grades 1-12</li><li>Holistic development of learners</li><li>Community and parent involvement</li><li>Discipline and respect</li></ul>
                    </div>
                  </div>
                  <h3 style={{color: COLORS.navy, marginTop: '30px'}}>Learner Rules</h3>
                  <ul style={{lineHeight: '1.8'}}>
                    <li>Respect teachers, peers and school property</li>
                    <li>Wear full school uniform at all times</li>
                    <li>Attend classes punctually</li>
                    <li>No bullying, drugs or dangerous items</li>
                    <li>Participate in school activities</li>
                  </ul>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div>
                  <h2 style={{color: COLORS.navy, borderBottom: `4px solid ${COLORS.red}`, paddingBottom: '10px'}}>School Gallery</h2>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px'}}>
                    {galleryImages.map((img, i) => <img key={i} src={img} alt={`Heidelberg ${i+1}`} style={{width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px'}} />)}
                  </div>
                </div>
              )}

              {activeTab === 'activities' && (
                <div>
                  <h2 style={{color: COLORS.navy, borderBottom: `4px solid ${COLORS.red}`, paddingBottom: '10px'}}>School Activities</h2>
                  <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                    {['Sports', 'Debate', 'Science Club', 'Arts & Culture', 'Music', 'Leadership', 'Community Outreach'].map(a =>
                      <div key={a} style={{background: COLORS.navy, color: 'white', padding: '12px 20px', borderRadius: '25px', fontWeight: 'bold'}}>{a}</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'apply' && (
                <div>
                  <h2 style={{color: COLORS.navy}}>Spaces Available</h2>
                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px'}}>
                    {Object.entries(spaces).map(([g, s]) => (
                      <div key={g} style={{border: `2px solid ${COLORS.red}`, padding: '10px', borderRadius: '8px', background: s>0?'#fff':'#ffdddd', minWidth: '140px', textAlign: 'center'}}>
                        Grade {g}: <b style={{color: s>0?COLORS.navy:COLORS.red}}>{s > 0? `${s} Spaces` : 'FULL'}</b>
                      </div>
                    ))}
                  </div>

                  <h2 style={{color: COLORS.navy}}>Application Form</h2>
                  <form onSubmit={handleSubmit} style={{display: 'grid', gap: '15px'}}>
                    <input placeholder="Child Full Name" value={childName} onChange={e=>setChildName(e.target.value)} required style={inputStyle}/>
                    <input placeholder="Parent/Guardian Name" value={parentName} onChange={e=>setParentName(e.target.value)} required style={inputStyle}/>
                    <select value={grade} onChange={e=>setGrade(e.target.value)} style={inputStyle}>{[...Array(12)].map((_,i) => <option key={i+1} value={i+1}>Grade {i+1}</option>)}</select>
                    {isFull && <p style={{color: COLORS.red}}>Sorry, Grade {grade} is FULL</p>}

                    <h3 style={{color: COLORS.navy}}>Home Address - Must be within 10km of Heidelberg</h3>
                    <input placeholder="Type your home address here..." value={address} onChange={e=>handleAddressChange(e.target.value)} required style={inputStyle}/>
                    {distanceMsg && <p style={{color: distanceMsg.includes('✅')?'green':'red', fontWeight: 'bold'}}>{distanceMsg}</p>}

                    <MapContainer center={SCHOOL_LOCATION} zoom={12} style={{height: '300px', width: '100%', borderRadius: '8px'}}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Circle center={SCHOOL_LOCATION} radius={10000} pathOptions={{color: COLORS.red, fillOpacity: 0.2}} />
                      {coords && <Marker position={coords} />}
                      <RecenterMap coords={coords} />
                    </MapContainer>

                    <h4 style={{color: COLORS.navy}}>Learner Requirements</h4>
                    {learnerDocs.map(f => <label key={f.key}>{f.label}: <input type="file" onChange={e=>setFiles({...files, [f.key]: e.target.files[0]})} required /></label>)}

                    <h4 style={{color: COLORS.navy}}>Parent Requirements</h4>
                    {parentDocs.map(f => <label key={f.key}>{f.label}: <input type="file" onChange={e=>setFiles({...files, [f.key]: e.target.files[0]})} required /></label>)}

                    <button type="submit" disabled={!canSubmit} style={{background: canSubmit? COLORS.red : '#ccc', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontSize: '1.1em', fontWeight: 'bold', cursor: canSubmit?'pointer':'not-allowed'}}>
                      {canSubmit? 'Submit Application' : 'Complete all fields + Address within 10km'}
                    </button>
                  </form>
                  <p style={{color: 'green'}}>{message}</p>
                </div>
              )}
            </div>
          </div>
          <footer style={{background: COLORS.navy, color: 'white', textAlign: 'center', padding: '20px', marginTop: '40px'}}>Heidelberg Academy - "A FAMILY OF LEARNING" © 2027</footer>
        </PageWrapper>
      )}
    </div>
  )
}
const inputStyle = {padding: '12px', border: `1px solid ${COLORS.navy}`, borderRadius: '5px', fontSize: '1em'}
