import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const API_URL = import.meta.env.VITE_API_URL;
const SCHOOL_LOCATION = [-26.5050, 28.0820] // Update to Heidelberg Academy coords

function LocationPicker({ setAddress }) {
  useMapEvents({ click(e) { setAddress(`${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`) } })
  return null
}

const galleryImages = [
  '/gallery/hero-learners.jpg'
]

export default function App() {
  const [spaces, setSpaces] = useState({});
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [grade, setGrade] = useState('1');
  const [address, setAddress] = useState('');
  const [parentId, setParentId] = useState(null);
  const [proofAddress, setProofAddress] = useState(null);
  const [clinicCard, setClinicCard] = useState(null);
  const [medicalAid, setMedicalAid] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { fetch(`${API_URL}/spaces`).then(res => res.json()).then(setSpaces) }, []);

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

  return (
    <div style={{fontFamily: 'Arial, sans-serif', background: '#f5f5f5'}}>
      
      {/* HERO WITH YOUR PHOTO AS BACKGROUND */}
      <header style={{
        background: `linear-gradient(rgba(0,0,128,0.75), rgba(200,0,0,0.65)), url(/gallery/hero-learners.jpg)`, 
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        color: 'white', textAlign: 'center', padding: '120px 20px', minHeight: '500px'
      }}>
        <h1 style={{fontSize: '4em', margin: 0, textShadow: '3px 3px 6px #000'}}>Heidelberg Academy</h1>
        <p style={{fontSize: '1.8em', fontWeight: 'bold', textShadow: '2px 2px 4px #000'}}>"A FAMILY OF LEARNING"</p>
        <a href="#apply" style={{background: 'red', color: 'white', padding: '16px 35px', textDecoration: 'none', borderRadius: '8px', marginTop: '25px', display: 'inline-block', fontWeight: 'bold', fontSize: '1.1em', border: '2px solid white'}}>
          Apply Now for 2025
        </a>
      </header>

      {/* QUICK STATS */}
      <div style={{background: 'white', padding: '40px 20px', marginTop: '-60px', position: 'relative', zIndex: 10, borderRadius: '15px', maxWidth: '1000px', margin: '-60px auto 30px auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}>
        <div style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', textAlign: 'center'}}>
          <div><h2 style={{color: 'red', fontSize: '2.5em', margin: 0}}>Grades 1-12</h2><p>Full Primary & High School</p></div>
          <div><h2 style={{color: 'red', fontSize: '2.5em', margin: 0}}>30+</h2><p>Spaces Per Grade</p></div>
          <div><h2 style={{color: 'red', fontSize: '2.5em', margin: 0}}>10km</h2><p>Admission Radius</p></div>
        </div>
      </div>

      <div style={{maxWidth: '1100px', margin: 'auto', padding: '20px'}}>

        {/* VISION MISSION OBJECTIVES */}
        <section style={{background: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h2 style={{color: 'navy', borderBottom: '4px solid red', paddingBottom: '10px'}}>About Heidelberg Academy</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
            <div><h3 style={{color: 'red'}}>Vision</h3><p>To be a center of academic excellence that nurtures responsible, innovative and compassionate leaders.</p></div>
            <div><h3 style={{color: 'red'}}>Mission</h3><p>To provide quality education through dedicated educators, modern facilities and values-based learning.</p></div>
            <div><h3 style={{color: 'red'}}>Objectives</h3><ul><li>Academic excellence in Grades 1-12</li><li>Holistic development of learners</li><li>Community and parent involvement</li></ul></div>
          </div>
        </section>

        {/* ACTIVITIES */}
        <section style={{background: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h2 style={{color: 'navy', borderBottom: '4px solid red', paddingBottom: '10px'}}>School Activities</h2>
          <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
            {['Sports', 'Debate', 'Science Club', 'Arts & Culture', 'Music', 'Leadership', 'Community Outreach'].map(a => 
              <div key={a} style={{background: 'navy', color: 'white', padding: '12px 20px', borderRadius: '25px', fontWeight: 'bold'}}>{a}</div>
            )}
          </div>
        </section>

        {/* RULES */}
        <section style={{background: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h2 style={{color: 'navy', borderBottom: '4px solid red', paddingBottom: '10px'}}>Learner Rules</h2>
          <ul style={{lineHeight: '1.8'}}><li>Respect teachers, peers and school property</li><li>Wear full school uniform at all times</li><li>Attend classes punctually</li><li>No bullying, drugs or dangerous items</li></ul>
        </section>

        {/* GALLERY */}
        <section style={{background: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h2 style={{color: 'navy', borderBottom: '4px solid red', paddingBottom: '10px'}}>School Gallery</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px'}}>
            {galleryImages.map((img, i) => <img key={i} src={img} alt={`Heidelberg ${i+1}`} style={{width: '100%', borderRadius: '8px'}} />)}
          </div>
          <p>Send more photos and I'll add them here</p>
        </section>

        {/* APPLICATION */}
        <section id="apply" style={{background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
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
        </section>
      </div>
      <footer style={{background: 'navy', color: 'white', textAlign: 'center', padding: '20px', marginTop: '40px'}}>Heidelberg Academy - "A FAMILY OF LEARNING" © 2025</footer>
    </div>
  )
}
const inputStyle = {padding: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1em'}
