// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// // API base URL
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// function App() {
//   // State management
//   const [activeTab, setActiveTab] = useState('enhance');
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [currentImage, setCurrentImage] = useState(null);
//   const [selectedTone, setSelectedTone] = useState('professional');
//   const [stats, setStats] = useState({
//     images: 0,
//     content: 0,
//     banners: 0,
//     projects: 0
//   });

//   console.log(uploadedImages) ; 

//   // Enhancement controls
//   const [enhancements, setEnhancements] = useState({
//     brightness: 100,
//     contrast: 100,
//     saturation: 100,
//     sharpness: 0
//   });

//   // Content generation state
//   const [contentForm, setContentForm] = useState({
//     productName: '',
//     category: '',
//     features: '',
//     audience: '',
//     contentType: 'description',
//     sizeTableType: 'clothing',
//     unitType: 'inches'
//   });

//   const [generatedContent, setGeneratedContent] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);

//   // Banner state
//   const [bannerForm, setBannerForm] = useState({
//     templateType: 'sale',
//     mainText: 'SUMMER SALE',
//     subtext: 'Up to 50% OFF',
//     ctaText: 'Shop Now',
//     bgColor: '#667eea',
//     textColor: '#ffffff',
//     accentColor: '#ffd700'
//   });
//   const [bannerPreview, setBannerPreview] = useState(null);

//   // Catalogue state
//   const [catalogueForm, setCatalogueForm] = useState({
//     title: 'Spring Collection 2024',
//     brand: 'FASHION CO.',
//     catalogueColor: '#2c3e50',
//     style: 'modern'
//   });

//   // Toast notification
//   const [toast, setToast] = useState(null);

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // Image upload handler
//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     const formData = new FormData();
    
//     files.forEach(file => {
//       formData.append('images', file);
//     });

//     try {
//     //  console.log(API_URL) ; 
//       const response = await axios.post(`${API_URL}/images/upload`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//      // console.log('response', response) ; 

//       setUploadedImages([...uploadedImages, ...response.data.files]);
//       setStats(prev => ({ ...prev, images: prev.images + response.data.files.length }));
//       showToast('Images uploaded successfully!', 'success');
//     } catch (error) {
//       showToast('Failed to upload images', 'error');
//       console.error('Upload error:', error); 
//     }
//   };

//   // Apply image enhancements
//   const applyEnhancements = async () => {
//     if (!currentImage) {
//       showToast('Please select an image first', 'warning');
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_URL}/images/enhance`, {
//         filename: currentImage.filename,
//         enhancements: {
//           brightness: enhancements.brightness / 100,
//           contrast: enhancements.contrast / 100,
//           saturation: enhancements.saturation / 100,
//           sharpness: enhancements.sharpness / 10
//         }
//       });

//       showToast('Image enhanced successfully!', 'success');
//       // Update the current image with enhanced path
//       setCurrentImage({
//         ...currentImage,
//         enhancedPath: response.data.enhancedPath
//       });
//     } catch (error) {
//       showToast('Failed to enhance image', 'error');
//       console.error('Enhancement error:', error);
//     }
//   };

//   // Generate content
//   const generateContent = async () => {
//     if (!contentForm.productName && contentForm.contentType !== 'sizetable') {
//       showToast('Please enter a product name', 'warning');
//       return;
//     }

//     setIsGenerating(true);
//     setGeneratedContent('<div class="spinner"></div>');

//     try {
//       const response = await axios.post(`${API_URL}/content/generate`, {
//         ...contentForm,
//         tone: selectedTone
//       });

//       setGeneratedContent(response.data.content);
//       setStats(prev => ({ ...prev, content: prev.content + 1 }));
//       showToast('Content generated successfully!', 'success');
//     } catch (error) {
//       showToast('Failed to generate content', 'error');
//       console.error('Content generation error:', error);
//       setGeneratedContent('<p style="color: red;">Error generating content. Please try again.</p>');
//     } finally {
//       setIsGenerating(false);
//     }
//   };
     
//   // Generate banner
//   const generateBanner = async () => {
//     try {
//       const response = await axios.post(`${API_URL}/banners/generate`, {
//         templateType: bannerForm.templateType,
//         mainText: bannerForm.mainText,
//         subtext: bannerForm.subtext,
//         ctaText: bannerForm.ctaText,
//         colors: {
//           background: bannerForm.bgColor,
//           text: bannerForm.textColor,
//           accent: bannerForm.accentColor
//         }
//       });

//       setBannerPreview(response.data.path);
//       setStats(prev => ({ ...prev, banners: prev.banners + 1 }));
//       showToast('Banner generated successfully!', 'success');
//     } catch (error) {
//       showToast('Failed to generate banner', 'error');
//       console.error('Banner generation error:', error);
//     }
//   };

//   // Reset enhancements
//   const resetEnhancements = () => {
//     setEnhancements({
//       brightness: 100,
//       contrast: 100,
//       saturation: 100,
//       sharpness: 0
//     });
//     showToast('Reset to defaults', 'success');
//   };

//   return (
//     <div className="app">
//       <div className="container">
//         {/* Header */}
//         <div className="header">
//           <div className="header-content">
//             <div className="logo">
//               <div className="logo-icon">✨</div>
//               <div className="logo-text">
//                 <h1>ContentCraft Pro</h1>
//                 <p>E-commerce Content Creation Suite</p>
//               </div>
//             </div>
//             <div className="header-actions">
//               <button className="btn btn-secondary" onClick={() => showToast('Project saved!', 'success')}>
//                 💾 Save Project
//               </button>
//               <button className="btn btn-primary" onClick={() => showToast('Exporting...', 'success')}>
//                 📦 Export All
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <h4>Images Enhanced</h4>
//             <div className="stat-value">{stats.images}</div>
//             <div className="stat-change">+0 today</div>
//           </div>
//           <div className="stat-card">
//             <h4>Content Generated</h4>
//             <div className="stat-value">{stats.content}</div>
//             <div className="stat-change">+0 today</div>
//           </div>
//           <div className="stat-card">
//             <h4>Banners Created</h4>
//             <div className="stat-value">{stats.banners}</div>
//             <div className="stat-change">+0 today</div>
//           </div>
//           <div className="stat-card">
//             <h4>Projects Saved</h4>
//             <div className="stat-value">{stats.projects}</div>
//             <div className="stat-change">Ready to export</div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="main-content">
//           {/* Tabs */}
//           <div className="tabs">
//             <button 
//               className={`tab ${activeTab === 'enhance' ? 'active' : ''}`}
//               onClick={() => setActiveTab('enhance')}
//             >
//               🎨 Image Enhancement
//             </button>
//             <button 
//               className={`tab ${activeTab === 'writing' ? 'active' : ''}`}
//               onClick={() => setActiveTab('writing')}
//             >
//               ✍️ Content Writing
//             </button>
//             <button 
//               className={`tab ${activeTab === 'banners' ? 'active' : ''}`}
//               onClick={() => setActiveTab('banners')}
//             >
//               🎯 Marketing Banners
//             </button>
//             <button 
//               className={`tab ${activeTab === 'catalogue' ? 'active' : ''}`}
//               onClick={() => setActiveTab('catalogue')}
//             >
//               📚 Catalogue Design
//             </button>
//           </div>

//           {/* Image Enhancement Tab */}
//           {activeTab === 'enhance' && (
//             <div className="tab-content active">
//               <div 
//                 className="upload-area" 
//                 onClick={() => document.getElementById('imageUpload').click()}
//               >
//                 <div className="upload-icon">📸</div>
//                 <h3>Upload Product Images</h3>
//                 <p>Drag & drop images here or click to browse</p>
//                 <p style={{ marginTop: '8px', fontSize: '12px' }}>Supports: JPG, PNG, WebP (Max 10MB)</p>
//               </div>
//               <input 
//                 type="file" 
//                 id="imageUpload" 
//                 accept="image/*" 
//                 multiple 
//                 // style={{ display: 'none' }}
//                 onChange={handleImageUpload}
//               />

//               {uploadedImages.length > 0 && (
//                 <>
//                   <div className="image-preview-grid">
//                     {uploadedImages.map((img, index) => (
//                       <div key={index} className="image-card">
//                         <img src={`http://localhost:5001${img.path}`} alt={img.originalName} />
//                         <div className="image-card-actions">
//                           <button 
//                             className="btn btn-primary btn-small"
//                             onClick={() => setCurrentImage(img)}
//                           >
//                             ✏️ Edit
//                           </button>
//                           <button 
//                             className="btn btn-secondary btn-small"
//                             onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== index))}
//                           >
//                             🗑️
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="enhancement-controls">
//                     <h3 style={{ marginBottom: '20px' }}>🎛️ Enhancement Controls</h3>
                    
//                     {['brightness', 'contrast', 'saturation'].map((control) => (
//                       <div key={control} className="control-group">
//                         <label>{control.charAt(0).toUpperCase() + control.slice(1)}</label>
//                         <div className="slider-container">
//                           <input 
//                             type="range" 
//                             min="0" 
//                             max="200" 
//                             value={enhancements[control]}
//                             onChange={(e) => setEnhancements({...enhancements, [control]: parseInt(e.target.value)})}
//                           />
//                           <span className="slider-value">{enhancements[control]}%</span>
//                         </div>
//                       </div>
//                     ))}

//                     <div className="control-group">
//                       <label>Sharpness</label>
//                       <div className="slider-container">
//                         <input 
//                           type="range" 
//                           min="0" 
//                           max="100" 
//                           value={enhancements.sharpness}
//                           onChange={(e) => setEnhancements({...enhancements, sharpness: parseInt(e.target.value)})}
//                         />
//                         <span className="slider-value">{enhancements.sharpness}%</span>
//                       </div>
//                     </div>

//                     <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
//                       <button className="btn btn-primary" onClick={applyEnhancements}>
//                         ✨ Apply Enhancements
//                       </button>
//                       <button className="btn btn-secondary" onClick={resetEnhancements}>
//                         🔄 Reset
//                       </button>
//                       <button className="btn btn-secondary">
//                         ⬇️ Download
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Content Writing Tab */}
//           {activeTab === 'writing' && (
//             <div className="tab-content active">
//               <div className="writing-grid">
//                 <div className="input-section">
//                   <h3>📝 Product Information</h3>
                  
//                   <div className="form-group">
//                     <label>Product Name</label>
//                     <input 
//                       type="text" 
//                       placeholder="e.g., Premium Cotton T-Shirt"
//                       value={contentForm.productName}
//                       onChange={(e) => setContentForm({...contentForm, productName: e.target.value})}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Product Category</label>
//                     <select 
//                       value={contentForm.category}
//                       onChange={(e) => setContentForm({...contentForm, category: e.target.value})}
//                     >
//                       <option value="">Select category...</option>
//                       <option value="apparel">Apparel</option>
//                       <option value="electronics">Electronics</option>
//                       <option value="home">Home & Living</option>
//                       <option value="beauty">Beauty & Care</option>
//                       <option value="sports">Sports & Fitness</option>
//                       <option value="accessories">Accessories</option>
//                     </select>
//                   </div>

//                   <div className="form-group">
//                     <label>Key Features (comma-separated)</label>
//                     <textarea 
//                       placeholder="e.g., 100% cotton, breathable, machine washable"
//                       value={contentForm.features}
//                       onChange={(e) => setContentForm({...contentForm, features: e.target.value})}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Target Audience</label>
//                     <input 
//                       type="text" 
//                       placeholder="e.g., Young professionals, 25-35 years"
//                       value={contentForm.audience}
//                       onChange={(e) => setContentForm({...contentForm, audience: e.target.value})}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Content Tone</label>
//                     <div className="tone-selector">
//                       {['professional', 'casual', 'luxury', 'playful', 'urgent'].map(tone => (
//                         <button 
//                           key={tone}
//                           className={`tone-btn ${selectedTone === tone ? 'active' : ''}`}
//                           onClick={() => setSelectedTone(tone)}
//                         >
//                           {tone.charAt(0).toUpperCase() + tone.slice(1)}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <label>Content Type</label>
//                     <select 
//                       value={contentForm.contentType}
//                       onChange={(e) => setContentForm({...contentForm, contentType: e.target.value})}
//                     >
//                       <option value="description">Product Description</option>
//                       <option value="title">Product Title</option>
//                       <option value="bullets">Bullet Points</option>
//                       <option value="seo">SEO Description</option>
//                       <option value="social">Social Media Post</option>
//                       <option value="email">Email Marketing</option>
//                       <option value="sizetable">Size Chart/Table</option>
//                     </select>
//                   </div>

//                   {contentForm.contentType === 'sizetable' && (
//                     <>
//                       <div className="form-group">
//                         <label>Size Chart Type</label>
//                         <select 
//                           value={contentForm.sizeTableType}
//                           onChange={(e) => setContentForm({...contentForm, sizeTableType: e.target.value})}
//                         >
//                           <option value="clothing">Clothing (S, M, L, XL)</option>
//                           <option value="shoes">Shoes (US/EU/UK)</option>
//                           <option value="kids">Kids Clothing (Age-based)</option>
//                           <option value="rings">Rings</option>
//                           <option value="international">International Sizing</option>
//                         </select>
//                       </div>

//                       <div className="form-group">
//                         <label>Measurement Unit</label>
//                         <select 
//                           value={contentForm.unitType}
//                           onChange={(e) => setContentForm({...contentForm, unitType: e.target.value})}
//                         >
//                           <option value="inches">Inches</option>
//                           <option value="cm">Centimeters</option>
//                           <option value="both">Both (Inches & CM)</option>
//                         </select>
//                       </div>
//                     </>
//                   )}

//                   <button className="btn btn-primary" onClick={generateContent} style={{ width: '100%' }}>
//                     ✨ Generate Content
//                   </button>
//                 </div>





//                 <div className="output-section">
//                   <h3>📄 Generated Content</h3>
//                   <div 
//                     className={`generated-content ${isGenerating ? 'loading' : ''}`}
//                     dangerouslySetInnerHTML={{ __html: generatedContent || '<p style="color: var(--text-light); text-align: center; padding: 60px 20px;">Fill in the product details and click "Generate Content" to see AI-powered copy</p>' }}
//                   />
//                   <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
//                     <button className="btn btn-secondary" style={{ flex: 1 }}>
//                       📋 Copy
//                     </button>
//                     <button className="btn btn-secondary" onClick={generateContent} style={{ flex: 1 }}>
//                       🔄 Regenerate
//                     </button>
//                     <button className="btn btn-secondary" style={{ flex: 1 }}>
//                       💾 Save
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}




//           {/* Marketing Banners Tab */}
//           {activeTab === 'banners' && (
//             <div className="tab-content active">
//               <h3 style={{ marginBottom: '20px' }}>🎯 Choose a Banner Template</h3>
              
//               <div className="template-grid">
//                 {[
//                   { type: 'sale', emoji: '🏷️', name: 'Flash Sale Banner', desc: 'Perfect for time-limited offers' },
//                   { type: 'new', emoji: '⭐', name: 'New Arrival Banner', desc: 'Showcase latest products' },
//                   { type: 'collection', emoji: '👗', name: 'Collection Banner', desc: 'Highlight product collections' },
//                   { type: 'seasonal', emoji: '🎄', name: 'Seasonal Banner', desc: 'Holiday & seasonal promotions' }
//                 ].map(template => (
//                   <div 
//                     key={template.type}
//                     className={`template-card ${bannerForm.templateType === template.type ? 'selected' : ''}`}
//                     onClick={() => setBannerForm({...bannerForm, templateType: template.type})}
//                   >
//                     <div className="template-preview" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
//                       {template.emoji}
//                     </div>
//                     <div className="template-info">
//                       <h4>{template.name}</h4>
//                       <p>{template.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {bannerForm.templateType && (
//                 <div className="canvas-container">
//                   <h3 style={{ marginBottom: '20px' }}>🎨 Customize Your Banner</h3>
                  
//                   {bannerPreview && (
//                     <div className="canvas-wrapper">
//                       <img src={`http://localhost:5000${bannerPreview}`} alt="Banner Preview" style={{ width: '100%' }} />
//                     </div>
//                   )}

//                   <div className="design-controls">
//                     <div className="form-group">
//                       <label>Main Text</label>
//                       <input 
//                         type="text" 
//                         placeholder="Enter main text"
//                         value={bannerForm.mainText}
//                         onChange={(e) => setBannerForm({...bannerForm, mainText: e.target.value})}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label>Subtitle</label>
//                       <input 
//                         type="text" 
//                         placeholder="Enter subtitle"
//                         value={bannerForm.subtext}
//                         onChange={(e) => setBannerForm({...bannerForm, subtext: e.target.value})}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label>CTA Text</label>
//                       <input 
//                         type="text" 
//                         placeholder="Call to action"
//                         value={bannerForm.ctaText}
//                         onChange={(e) => setBannerForm({...bannerForm, ctaText: e.target.value})}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label>Background Color</label>
//                       <div className="color-picker-group">
//                         <input 
//                           type="color" 
//                           value={bannerForm.bgColor}
//                           onChange={(e) => setBannerForm({...bannerForm, bgColor: e.target.value})}
//                         />
//                         <span>Background</span>
//                       </div>
//                     </div>

//                     <div className="form-group">
//                       <label>Text Color</label>
//                       <div className="color-picker-group">
//                         <input 
//                           type="color" 
//                           value={bannerForm.textColor}
//                           onChange={(e) => setBannerForm({...bannerForm, textColor: e.target.value})}
//                         />
//                         <span>Text</span>
//                       </div>
//                     </div>

//                     <div className="form-group">
//                       <label>Accent Color</label>
//                       <div className="color-picker-group">
//                         <input 
//                           type="color" 
//                           value={bannerForm.accentColor}
//                           onChange={(e) => setBannerForm({...bannerForm, accentColor: e.target.value})}
//                         />
//                         <span>Accent</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
//                     <button className="btn btn-primary" onClick={generateBanner}>
//                       🎨 Update Design
//                     </button>
//                     <button className="btn btn-secondary">
//                       ⬇️ Download Banner
//                     </button>
//                     <button className="btn btn-secondary">
//                       💾 Save Project
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Catalogue Design Tab */}
//           {activeTab === 'catalogue' && (
//             <div className="tab-content active">
//               <h3 style={{ marginBottom: '20px' }}>📚 Catalogue Design Templates</h3>
              
//               <div className="template-grid">
//                 {[
//                   { type: 'modern', emoji: '📱', name: 'Modern Minimalist', desc: 'Clean and professional layout' },
//                   { type: 'fashion', emoji: '👔', name: 'Fashion Lookbook', desc: 'Perfect for apparel brands' },
//                   { type: 'grid', emoji: '🎯', name: 'Product Grid', desc: 'Multi-product showcase' },
//                   { type: 'luxury', emoji: '💎', name: 'Luxury Collection', desc: 'Premium product display' }
//                 ].map(template => (
//                   <div key={template.type} className="template-card">
//                     <div className="template-preview" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
//                       {template.emoji}
//                     </div>
//                     <div className="template-info">
//                       <h4>{template.name}</h4>
//                       <p>{template.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>






//       {/* Toast Notification */}
//       {toast && (
//         <div className={`toast ${toast.type}`}>
//           <span style={{ fontSize: '20px' }}>
//             {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : '⚠'}
//           </span>
//           <span>{toast.message}</span>
//         </div>
//       )} 
//     </div>
//   );
// }



// export default App;



































import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

function App() {
  // State management
  const [activeTab, setActiveTab] = useState('enhance');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [stats, setStats] = useState({
    images: 0,
    content: 0,
    banners: 0,
    projects: 0
  });

  console.log(uploadedImages);
  console.log('Current Image:', currentImage);

  // Enhancement controls
  const [enhancements, setEnhancements] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 0
  });

  // Content generation state
  const [contentForm, setContentForm] = useState({
    productName: '',
    category: '',
    features: '',
    audience: '',
    contentType: 'description',
    sizeTableType: 'clothing',
    unitType: 'inches'
  });

  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Banner state
  const [bannerForm, setBannerForm] = useState({
    templateType: 'sale',
    mainText: 'SUMMER SALE',
    subtext: 'Up to 50% OFF',
    ctaText: 'Shop Now',
    bgColor: '#667eea',
    textColor: '#ffffff',
    accentColor: '#ffd700'
  });
  const [bannerPreview, setBannerPreview] = useState(null);

  // Catalogue state
  const [catalogueForm, setCatalogueForm] = useState({
    title: 'Spring Collection 2024',
    brand: 'FASHION CO.',
    catalogueColor: '#2c3e50',
    style: 'modern'
  });

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post(`${API_URL}/images/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploadedImages([...uploadedImages, ...response.data.files]);
      setStats(prev => ({ ...prev, images: prev.images + response.data.files.length }));
      showToast('Images uploaded successfully!', 'success');
    } catch (error) {
      showToast('Failed to upload images', 'error');
      console.error('Upload error:', error); 
    }
  };

  // Apply image enhancements
  const applyEnhancements = async () => {
    if (!currentImage) {
      showToast('Please select an image first', 'warning');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/images/enhance`, {
        filename: currentImage.filename,
        enhancements: {
          brightness: enhancements.brightness / 100,
          contrast: enhancements.contrast / 100,
          saturation: enhancements.saturation / 100,
          sharpness: enhancements.sharpness / 10
        }
      });

      showToast('Image enhanced successfully!', 'success');
      
      // Update the current image with enhanced path
      const updatedImage = {
        ...currentImage,
        enhancedPath: response.data.enhancedPath
      };
      setCurrentImage(updatedImage);
      
      // Also update in the uploadedImages array so it persists
      setUploadedImages(prevImages => 
        prevImages.map(img => 
          img.filename === currentImage.filename 
            ? updatedImage 
            : img
        )
      );
    } catch (error) {
      showToast('Failed to enhance image', 'error');
      console.error('Enhancement error:', error);
    }
  };

  // Generate content
  const generateContent = async () => {
    if (!contentForm.productName && contentForm.contentType !== 'sizetable') {
      showToast('Please enter a product name', 'warning');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('<div class="spinner"></div>');

    try {
      const response = await axios.post(`${API_URL}/content/generate`, {
        ...contentForm,
        tone: selectedTone
      });

      setGeneratedContent(response.data.content);
      setStats(prev => ({ ...prev, content: prev.content + 1 }));
      showToast('Content generated successfully!', 'success');
    } catch (error) {
      showToast('Failed to generate content', 'error');
      console.error('Content generation error:', error);
      setGeneratedContent('<p style="color: red;">Error generating content. Please try again.</p>');
    } finally {
      setIsGenerating(false);
    }
  };
     
  // Generate banner
  const generateBanner = async () => {
    try {
      const response = await axios.post(`${API_URL}/banners/generate`, {
        templateType: bannerForm.templateType,
        mainText: bannerForm.mainText,
        subtext: bannerForm.subtext,
        ctaText: bannerForm.ctaText,
        colors: {
          background: bannerForm.bgColor,
          text: bannerForm.textColor,
          accent: bannerForm.accentColor
        }
      });

      setBannerPreview(response.data.path);
      setStats(prev => ({ ...prev, banners: prev.banners + 1 }));
      showToast('Banner generated successfully!', 'success');
    } catch (error) {
      showToast('Failed to generate banner', 'error');
      console.error('Banner generation error:', error);
    }
  };

  // Reset enhancements
  const resetEnhancements = () => {
    setEnhancements({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sharpness: 0
    });
    showToast('Reset to defaults', 'success');
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">✨</div>
              <div className="logo-text">
                <h1>ContentCraft Pro</h1>
                <p>E-commerce Content Creation Suite</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={() => showToast('Project saved!', 'success')}>
                💾 Save Project
              </button>
              <button className="btn btn-primary" onClick={() => showToast('Exporting...', 'success')}>
                📦 Export All
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Images Enhanced</h4>
            <div className="stat-value">{stats.images}</div>
            <div className="stat-change">+0 today</div>
          </div>
          <div className="stat-card">
            <h4>Content Generated</h4>
            <div className="stat-value">{stats.content}</div>
            <div className="stat-change">+0 today</div>
          </div>
          <div className="stat-card">
            <h4>Banners Created</h4>
            <div className="stat-value">{stats.banners}</div>
            <div className="stat-change">+0 today</div>
          </div>
          <div className="stat-card">
            <h4>Projects Saved</h4>
            <div className="stat-value">{stats.projects}</div>
            <div className="stat-change">Ready to export</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'enhance' ? 'active' : ''}`}
              onClick={() => setActiveTab('enhance')}
            >
              🎨 Image Enhancement
            </button>
            <button 
              className={`tab ${activeTab === 'writing' ? 'active' : ''}`}
              onClick={() => setActiveTab('writing')}
            >
              ✍️ Content Writing
            </button>
            <button 
              className={`tab ${activeTab === 'banners' ? 'active' : ''}`}
              onClick={() => setActiveTab('banners')}
            >
              🎯 Marketing Banners
            </button>
            <button 
              className={`tab ${activeTab === 'catalogue' ? 'active' : ''}`}
              onClick={() => setActiveTab('catalogue')}
            >
              📚 Catalogue Design
            </button>
          </div>

          {/* Image Enhancement Tab */}
          {activeTab === 'enhance' && (
            <div className="tab-content active">
              <div 
                className="upload-area" 
                onClick={() => document.getElementById('imageUpload').click()}
              >
                <div className="upload-icon">📸</div>
                <h3>Upload Product Images</h3>
                <p>Drag & drop images here or click to browse</p>
                <p style={{ marginTop: '8px', fontSize: '12px' }}>Supports: JPG, PNG, WebP (Max 10MB)</p>
              </div>
              <input 
                type="file" 
                id="imageUpload" 
                accept="image/*" 
                multiple 
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />

              {uploadedImages.length > 0 && (
                <>
                  <div className="image-preview-grid">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="image-card">
                        <img 
                          src={`${BASE_URL}${img.path}`} 
                          alt={img.originalName}
                          className={currentImage?.filename === img.filename ? 'selected' : ''}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImage(img);
                          }}
                          style={{ userSelect: 'auto', pointerEvents: 'auto' }}
                        />
                        {img.enhancedPath && (
                          <div className="enhanced-badge">✨ Enhanced</div>
                        )}
                        <div className="image-card-actions">
                          <button 
                            className="btn btn-primary btn-small"
                            onClick={() => setCurrentImage(img)}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn btn-secondary btn-small"
                            onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== index))}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Before/After Comparison Section */}
                  {currentImage && currentImage.enhancedPath && (
                    <div className="comparison-section">
                      <h3 style={{ marginBottom: '20px' }}>🔍 Before vs After Comparison</h3>
                      <div className="comparison-container">
                        <div className="comparison-image-wrapper">
                          <div className="comparison-label">Original</div>
                          <img 
                            src={`${BASE_URL}${currentImage.path}`} 
                            alt="Original"
                            className="comparison-image"
                          />
                        </div>
                        <div className="comparison-arrow">→</div>
                        <div className="comparison-image-wrapper">
                          <div className="comparison-label enhanced">Enhanced ✨</div>
                          <img 
                            src={`${BASE_URL}${currentImage.enhancedPath}`} 
                            alt="Enhanced"
                            className="comparison-image"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center' }}>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => {
                            // Download original
                            const link = document.createElement('a');
                            link.href = `${BASE_URL}${currentImage.path}`;
                            link.download = currentImage.originalName;
                            link.click();
                          }}
                        >
                          ⬇️ Download Original
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={() => {
                            // Download enhanced
                            const link = document.createElement('a');
                            link.href = `${BASE_URL}${currentImage.enhancedPath}`;
                            link.download = `enhanced-${currentImage.originalName}`;
                            link.click();
                          }}
                        >
                          ⬇️ Download Enhanced
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="enhancement-controls">
                    <h3 style={{ marginBottom: '20px' }}>🎛️ Enhancement Controls</h3>
                    
                    {currentImage && (
                      <div style={{ 
                        padding: '12px', 
                        background: '#e3f2fd', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        borderLeft: '4px solid #2196f3'
                      }}>
                        <strong>Selected Image:</strong> {currentImage.originalName}
                        {currentImage.enhancedPath && <span style={{ marginLeft: '8px', color: '#2196f3' }}>✨ Enhanced</span>}
                      </div>
                    )}
                    
                    {['brightness', 'contrast', 'saturation'].map((control) => (
                      <div key={control} className="control-group">
                        <label>{control.charAt(0).toUpperCase() + control.slice(1)}</label>
                        <div className="slider-container">
                          <input 
                            type="range" 
                            min="0" 
                            max="200" 
                            value={enhancements[control]}
                            onChange={(e) => setEnhancements({...enhancements, [control]: parseInt(e.target.value)})}
                          />
                          <span className="slider-value">{enhancements[control]}%</span>
                        </div>
                      </div>
                    ))}

                    <div className="control-group">
                      <label>Sharpness</label>
                      <div className="slider-container">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={enhancements.sharpness}
                          onChange={(e) => setEnhancements({...enhancements, sharpness: parseInt(e.target.value)})}
                        />
                        <span className="slider-value">{enhancements.sharpness}%</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                      <button 
                        className="btn btn-primary" 
                        onClick={applyEnhancements}
                        disabled={!currentImage}
                      >
                        ✨ Apply Enhancements
                      </button>
                      <button className="btn btn-secondary" onClick={resetEnhancements}>
                        🔄 Reset
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Content Writing Tab */}
          {activeTab === 'writing' && (
            <div className="tab-content active">
              <div className="writing-grid">
                <div className="input-section">
                  <h3>📝 Product Information</h3>
                  
                  <div className="form-group">
                    <label>Product Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Premium Cotton T-Shirt"
                      value={contentForm.productName}
                      onChange={(e) => setContentForm({...contentForm, productName: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Product Category</label>
                    <select 
                      value={contentForm.category}
                      onChange={(e) => setContentForm({...contentForm, category: e.target.value})}
                    >
                      <option value="">Select category...</option>
                      <option value="apparel">Apparel</option>
                      <option value="electronics">Electronics</option>
                      <option value="home">Home & Living</option>
                      <option value="beauty">Beauty & Care</option>
                      <option value="sports">Sports & Fitness</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Key Features (comma-separated)</label>
                    <textarea 
                      placeholder="e.g., 100% cotton, breathable, machine washable"
                      value={contentForm.features}
                      onChange={(e) => setContentForm({...contentForm, features: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Target Audience</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Young professionals, 25-35 years"
                      value={contentForm.audience}
                      onChange={(e) => setContentForm({...contentForm, audience: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Content Tone</label>
                    <div className="tone-selector">
                      {['professional', 'casual', 'luxury', 'playful', 'urgent'].map(tone => (
                        <button 
                          key={tone}
                          className={`tone-btn ${selectedTone === tone ? 'active' : ''}`}
                          onClick={() => setSelectedTone(tone)}
                        >
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Content Type</label>
                    <select 
                      value={contentForm.contentType}
                      onChange={(e) => setContentForm({...contentForm, contentType: e.target.value})}
                    >
                      <option value="description">Product Description</option>
                      <option value="title">Product Title</option>
                      <option value="bullets">Bullet Points</option>
                      <option value="seo">SEO Description</option>
                      <option value="social">Social Media Post</option>
                      <option value="email">Email Marketing</option>
                      <option value="sizetable">Size Chart/Table</option>
                    </select>
                  </div>

                  {contentForm.contentType === 'sizetable' && (
                    <>
                      <div className="form-group">
                        <label>Size Chart Type</label>
                        <select 
                          value={contentForm.sizeTableType}
                          onChange={(e) => setContentForm({...contentForm, sizeTableType: e.target.value})}
                        >
                          <option value="clothing">Clothing (S, M, L, XL)</option>
                          <option value="shoes">Shoes (US/EU/UK)</option>
                          <option value="kids">Kids Clothing (Age-based)</option>
                          <option value="rings">Rings</option>
                          <option value="international">International Sizing</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Measurement Unit</label>
                        <select 
                          value={contentForm.unitType}
                          onChange={(e) => setContentForm({...contentForm, unitType: e.target.value})}
                        >
                          <option value="inches">Inches</option>
                          <option value="cm">Centimeters</option>
                          <option value="both">Both (Inches & CM)</option>
                        </select>
                      </div>
                    </>
                  )}

                  <button className="btn btn-primary" onClick={generateContent} style={{ width: '100%' }}>
                    ✨ Generate Content
                  </button>
                </div>

                <div className="output-section">
                  <h3>📄 Generated Content</h3>
                  <div 
                    className={`generated-content ${isGenerating ? 'loading' : ''}`}
                    dangerouslySetInnerHTML={{ __html: generatedContent || '<p style="color: var(--text-light); text-align: center; padding: 60px 20px;">Fill in the product details and click "Generate Content" to see AI-powered copy</p>' }}
                  />
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }}>
                      📋 Copy
                    </button>
                    <button className="btn btn-secondary" onClick={generateContent} style={{ flex: 1 }}>
                      🔄 Regenerate
                    </button>
                    <button className="btn btn-secondary" style={{ flex: 1 }}>
                      💾 Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Marketing Banners Tab */}
          {activeTab === 'banners' && (
            <div className="tab-content active">
              <h3 style={{ marginBottom: '20px' }}>🎯 Choose a Banner Template</h3>
              
              <div className="template-grid">
                {[
                  { type: 'sale', emoji: '🏷️', name: 'Flash Sale Banner', desc: 'Perfect for time-limited offers' },
                  { type: 'new', emoji: '⭐', name: 'New Arrival Banner', desc: 'Showcase latest products' },
                  { type: 'collection', emoji: '👗', name: 'Collection Banner', desc: 'Highlight product collections' },
                  { type: 'seasonal', emoji: '🎄', name: 'Seasonal Banner', desc: 'Holiday & seasonal promotions' }
                ].map(template => (
                  <div 
                    key={template.type}
                    className={`template-card ${bannerForm.templateType === template.type ? 'selected' : ''}`}
                    onClick={() => setBannerForm({...bannerForm, templateType: template.type})}
                  >
                    <div className="template-preview" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      {template.emoji}
                    </div>
                    <div className="template-info">
                      <h4>{template.name}</h4>
                      <p>{template.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {bannerForm.templateType && (
                <div className="canvas-container">
                  <h3 style={{ marginBottom: '20px' }}>🎨 Customize Your Banner</h3>
                  
                  {bannerPreview && (
                    <div className="canvas-wrapper">
                      <img src={`${BASE_URL}${bannerPreview}`} alt="Banner Preview" style={{ width: '100%' }} />
                    </div>
                  )}

                  <div className="design-controls">
                    <div className="form-group">
                      <label>Main Text</label>
                      <input 
                        type="text" 
                        placeholder="Enter main text"
                        value={bannerForm.mainText}
                        onChange={(e) => setBannerForm({...bannerForm, mainText: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Subtitle</label>
                      <input 
                        type="text" 
                        placeholder="Enter subtitle"
                        value={bannerForm.subtext}
                        onChange={(e) => setBannerForm({...bannerForm, subtext: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>CTA Text</label>
                      <input 
                        type="text" 
                        placeholder="Call to action"
                        value={bannerForm.ctaText}
                        onChange={(e) => setBannerForm({...bannerForm, ctaText: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Background Color</label>
                      <div className="color-picker-group">
                        <input 
                          type="color" 
                          value={bannerForm.bgColor}
                          onChange={(e) => setBannerForm({...bannerForm, bgColor: e.target.value})}
                        />
                        <span>Background</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Text Color</label>
                      <div className="color-picker-group">
                        <input 
                          type="color" 
                          value={bannerForm.textColor}
                          onChange={(e) => setBannerForm({...bannerForm, textColor: e.target.value})}
                        />
                        <span>Text</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Accent Color</label>
                      <div className="color-picker-group">
                        <input 
                          type="color" 
                          value={bannerForm.accentColor}
                          onChange={(e) => setBannerForm({...bannerForm, accentColor: e.target.value})}
                        />
                        <span>Accent</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button className="btn btn-primary" onClick={generateBanner}>
                      🎨 Update Design
                    </button>
                    <button className="btn btn-secondary">
                      ⬇️ Download Banner
                    </button>
                    <button className="btn btn-secondary">
                      💾 Save Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Catalogue Design Tab */}
          {activeTab === 'catalogue' && (
            <div className="tab-content active">
              <h3 style={{ marginBottom: '20px' }}>📚 Catalogue Design Templates</h3>
              
              <div className="template-grid">
                {[
                  { type: 'modern', emoji: '📱', name: 'Modern Minimalist', desc: 'Clean and professional layout' },
                  { type: 'fashion', emoji: '👔', name: 'Fashion Lookbook', desc: 'Perfect for apparel brands' },
                  { type: 'grid', emoji: '🎯', name: 'Product Grid', desc: 'Multi-product showcase' },
                  { type: 'luxury', emoji: '💎', name: 'Luxury Collection', desc: 'Premium product display' }
                ].map(template => (
                  <div key={template.type} className="template-card">
                    <div className="template-preview" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      {template.emoji}
                    </div>
                    <div className="template-info">
                      <h4>{template.name}</h4>
                      <p>{template.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span style={{ fontSize: '20px' }}>
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : '⚠'}
          </span>
          <span>{toast.message}</span>
        </div>
      )} 
    </div>
  );
}

export default App;