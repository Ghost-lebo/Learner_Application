import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const API_URL = import.meta.env.VITE_API_URL;
const SCHOOL_LOCATION = [-26.5050, 28.0820]

function LocationPicker({ setAddress }) {
  useMapEvents({ click(e) { setAddress(`${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`) } })
  return null
}

const galleryImages = [
  '/gallery/Heidelberg.jpeg',
  '/gallery/Heidelberg-Academy.png'
]

export default function App() {
  const [spaces, setSpaces] = useState({});
  const [activeTab, setActiveTab] = useState('home');
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [grade, setGrade] = useState('1');
  const [address, setAddress] = useState('');
  const [parentId, setParentId] = useState(null);
  const [proofAddress, setProofAddress] = useState(null);
  const [clinicCard, setClinicCard] = useState(null);
  const [medicalAid, setMedicalAid] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setSpaces({
      '1': 13, '2': 7, '3': 4, '4': 0, '5': 1, '6': 3,
      '7': 0, '8': 20, '9': 5, '10': 0, '11': 0, '12': 0
    })
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('child_name', childName);
    formData.append('parent_name', parentName);
    formData.append('grade', grade);
    formData.append('address', address);
    formData.append('parent_id', parentId);
    formData.append('proof_address', proofAddress);
    if(grade <= 9) formData.append('clinic_card', clinicCard);
    if(grade >= 10) formData.append('medical_aid', medicalAid);
    const res = await fetch(`${API_URL}/apply`, { method: 'POST', body: formData });
    setMessage((await res.json()).message);
  }

  const gradeNum = parseInt(grade);
  const isFull = spaces[grade] <= 0;

  const TabButton = ({id, label}) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{
        padding: '15px 25px', background: activeTab === id? 'red' : 'navy', 
        color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', 
        cursor: 'pointer', fontSize: '1.1em'
      }}
    >
      {label}
    </button>
  )

  const HomeButton = () => (
    <button onClick={() => setActiveTab('home')} style={{
      position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
      background: 'red', color: 'white', border: '2px solid white', 
      borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px',
      cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    }}>
      🏠
    </button>
  )

  return (
    <div style={{fontFamily: 'Arial, sans-serif'}}>
      {activeTab!== 'home' && <HomeButton />}

      {/* HOME PAGE - LOGO TOP LEFT */}
      {activeTab === 'home' && (
        <div style={{
          background: `linear-gradient(rgba(0,0,128,0.70), rgba(200,0,0,0.60)), url(/gallery/Heidelberg.jpeg)`, 
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
          minHeight: '100vh', color: 'white', padding: '20px'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px', position: 'absolute', top: '20px', left: '30px'}}>
            <img src="/gallery/logo.png" alt="Heidelberg Logo" style={{width: '250px', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.7))'}} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '90vh'}}>
            <h1 style={{fontSize: '4.5em', margin: 0, textShadow: '4px 4px 8px #000'}}>Heidelberg Academy</h1>
            <p style={{fontSize: '2em', fontWeight: 'bold', textShadow: '3px 3px 6px #000'}}>"A FAMILY OF LEARNING"</p>
            <p style={{fontSize: '1.3em', maxWidth: '700px', textShadow: '2px 2px 4px #000'}}>Excellence in Education | Discipline | Respect | Achievement</p>
            
            <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '40px'}}>
              <TabButton id="about" label="About Us" />
              <TabButton id="gallery" label="Gallery" />
              <TabButton id="activities" label="Activities" />
              <TabButton id="apply" label="Apply Now" />
            </div>
          </div>
        </div>
      )}

      {/* OTHER PAGES - LOGO TOP LEFT */}
      {activeTab!== 'home' && (
        <div style={{background: '#f5f5f5'}}>
          <header style={{background: 'navy', color: 'white', padding: '20px 30px', display: 'flex', alignItems: 'center', gap: '25px'}}>
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

            <div style={{background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
              {activeTab === 'about' && (
                <div>
                  <h2 style={{color: 'navy', borderBottom: '4px solid red', paddingBottom: '10px'}}>About Heidelberg Academy</h2>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
                    <div><h3 style={{color: 'red'}}>Vision</h3><p>To be a center of academic excellence that nurtures responsible, innovative and compassionate leaders.</p></div>
                    <div><h3 style={{color: 'red'}}>Mission</h3><p>To provide quality education through dedicated educators, modern facilities and values-based learning.</p></div>
                    <div><h3 style={{color: 'red'}}>Objectives</h3><ul><li>Academic excellence in Grades 1-12</li><li>Holistic development of learners</li><li>Community and parent involvement</li></ul></div>
                  </div>
                  <h3 style={{color: 'navy', marginTop: '30px'}}>Learner Rules</h3>
                  <ul style={{lineHeight: '1.8'}}><li>Respect teachers, peers and school property</li><li>Wear full school uniform at all times</li><li>Attend classes punctually</li><li>No bullying, drugs or dangerous items</li></ul>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div>
                  <h2 style={{color: 'navy', borderBottom: '4px solid red', paddingBottom: '10px'}}>School Gallery</h2>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px'}}>
                    {galleryImages.map((img, i) => <img key={i} src={img} alt={`Heidelberg ${i+1}`} style={{width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}} />)}
                  </div>
                </div>
              )}

              {activeTab === 'activities' && (
                <div>
                  <h2 style={{color: 'navy', borderBottom: '4px solid red', paddingBottom: '10px'}}>School Activities</h2>
                  <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                    {['Sports', 'Debate', 'Science Club', 'Arts & Culture', 'Music', 'Leadership', 'Community Outreach'].map(a => 
                      <div key={a} style={{background: 'navy', color: 'white', padding: '12px 20px', borderRadius: '25px', fontWeight: 'bold'}}>{a}</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'apply' && (
                <div>
                  <h2 style={{color: 'navy'}}>Spaces Available</h2>
                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px'}}>
                    {Object.entries(spaces).map(([g, s]) => (
                      <div key={g} style={{border: '2px solid red', padding: '10px', borderRadius: '8px', background: s>0?'#fff':'#ffdddd', minWidth: '140px', textAlign: 'center'}}>
                        Grade {g}: <b style={{color: s>0?'navy':'red'}}>{s > 0? `${s} Spaces` : 'FULL'}</b>
                      </div>
                    ))}
                  </div>
                  <h2 style={{color: 'navy'}}>Application Form</h2>
                  <form onSubmit={handleSubmit} style={{display: 'grid', gap: '15px'}}>
                    <input placeholder="Child Full Name" value={childName} onChange={e=>setChildName(e.target.value)} required style={inputStyle}/>
                    <input placeholder="Parent/Guardian Name" value={parentName} onChange={e=>setParentName(e.target.value)} required style={inputStyle}/>
                    <select value={grade} onChange={e=>setGrade(e.target.value)} style={inputStyle}>{[...Array(12)].map((_,i) => <option key={i+1} value={i+1}>Grade {i+1}</option>)}</select>
                    {isFull && <p style={{color: 'red'}}>Sorry, Grade {grade} is FULL</p>}
                    <h3 style={{color: 'navy'}}>Click map to select address within 10km</h3>
                    <MapContainer center={SCHOOL_LOCATION} zoom={12} style={{height: '300px', width: '100%', borderRadius: '8px'}}><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><Circle center={SCHOOL_LOCATION} radius={10000} pathOptions={{color: 'red', fillOpacity: 0.2}} /><Marker position={SCHOOL_LOCATION} /><LocationPicker setAddress={setAddress} /></MapContainer>
                    <input placeholder="Selected Address Coords" value={address} readOnly required style={inputStyle}/>
                    <h4>Required Documents</h4>
                    <label>Parent ID: <input type="file" onChange={e=>setParentId(e.target.files[0])} required /></label>
                    <label>Proof of Address: <input type="file" onChange={e=>setProofAddress(e.target.files[0])} required /></label>
                    {gradeNum <= 9 && <label>Clinic Card: <input type="file" onChange={e=>setClinicCard(e.target.files[0])} required /></label>}
                    {gradeNum >= 10 && <label>Medical Aid: <input type="file" onChange={e=>setMedicalAid(e.target.files[0])} required /></label>}
                    <button type="submit" disabled={isFull} style={{background: 'red', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontSize: '1.1em', fontWeight: 'bold'}}>Submit Application</button>
                  </form>
                  <p style={{color: 'green'}}>{message}</p>
                </div>
              )}
            </div>
          </div>
          <footer style={{background: 'navy', color: 'white', textAlign: 'center', padding: '20px', marginTop: '40px'}}>Heidelberg Academy - "A FAMILY OF LEARNING" © 2025</footer>
        </div>
      )}
    </div>
  )
}
const inputStyle = {padding: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1em'}
