import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const API_URL = import.meta.env.VITE_API_URL;

// Heidelberg Academy coords - update these to your actual coords
const SCHOOL_LOCATION = [-26.5050, 28.0820] 

function LocationPicker({ setAddress }) {
  useMapEvents({
    click(e) {
      setAddress(`${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`)
    },
  })
  return null
}

function App() {
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

  useEffect(() => {
    fetch(`${API_URL}/spaces`)
    .then(res => res.json())
    .then(data => setSpaces(data))
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
    const data = await res.json();
    setMessage(data.message);
  }

  const gradeNum = parseInt(grade);
  const isFull = spaces[grade] <= 0;

  return (
    <div style={{fontFamily: 'Arial', background: '#fff'}}>
      <header style={{background: 'navy', color: 'white', padding: '20px', textAlign: 'center'}}>
        <h1 style={{color: 'red'}}>Heidelberg Academy</h1>
        <p>Learner Admissions 2025</p>
      </header>

      <div style={{padding: '20px', maxWidth: '900px', margin: 'auto'}}>
        
        <h2 style={{color: 'navy'}}>Spaces Available</h2>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          {Object.entries(spaces).map(([g, s]) => (
            <div key={g} style={{border: '2px solid red', padding: '10px', borderRadius: '8px'}}>
              Grade {g}: <b>{s > 0? `${s} Spaces` : 'FULL'}</b>
            </div>
          ))}
        </div>

        <h2 style={{color: 'navy', marginTop: '30px'}}>Application Form</h2>
        <form onSubmit={handleSubmit} style={{display: 'grid', gap: '15px'}}>
          <input placeholder="Child Full Name" value={childName} onChange={e=>setChildName(e.target.value)} required />
          <input placeholder="Parent/Guardian Name" value={parentName} onChange={e=>setParentName(e.target.value)} required />
          
          <select value={grade} onChange={e=>setGrade(e.target.value)}>
            {[...Array(12)].map((_,i) => <option key={i+1} value={i+1}>Grade {i+1}</option>)}
          </select>
          {isFull && <p style={{color: 'red'}}>Sorry, Grade {grade} is FULL</p>}

          <h3 style={{color: 'navy'}}>Click on map to select address within 10km</h3>
          <MapContainer center={SCHOOL_LOCATION} zoom={12} style={{height: '300px', width: '100%'}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Circle center={SCHOOL_LOCATION} radius={10000} pathOptions={{color: 'red'}} />
            <Marker position={SCHOOL_LOCATION} />
            <LocationPicker setAddress={setAddress} />
          </MapContainer>
          <input placeholder="Selected Address Coords" value={address} readOnly required />

          <h4>Required Documents</h4>
          <label>Parent ID: <input type="file" onChange={e=>setParentId(e.target.files[0])} required /></label>
          <label>Proof of Address: <input type="file" onChange={e=>setProofAddress(e.target.files[0])} required /></label>
          
          {gradeNum <= 9 && <label>Clinic Card: <input type="file" onChange={e=>setClinicCard(e.target.files[0])} required /></label>}
          {gradeNum >= 10 && <label>Medical Aid: <input type="file" onChange={e=>setMedicalAid(e.target.files[0])} required /></label>}

          <button type="submit" disabled={isFull} style={{background: 'red', color: 'white', padding: '10px', border: 'none'}}>
            Submit Application
          </button>
        </form>
        <p style={{color: 'green'}}>{message}</p>
      </div>
    </div>
  )
}

export default App
